const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const yaml = require('write-yaml');

const wrapComponent = (_, context) => {
  const baseOutputs = {
    endpoint: ''
  };

  const schemaConfig = {
    projects: {
      database: {
        schemaPath: `./generated/prisma.graphql`,
        extensions: {
          prisma: `./prisma.yml`,
        }
      }
    }
  }

  return {
    start: async (config) => {
      const serviceName = config.service.name;
      const handlerLocation = config.handler.location;
      const componentLocation = `./${config.service.location}`;
      const appFolder = `./.unstack/tmp/docker-apps/${serviceName}`;
      const artifactsFolder = `./.unstack/tmp/artifacts/${serviceName}`;

      //build tmp docker app folder
      const buildAppFolderCommand = `mkdir -p ${appFolder}`;
      const buildAppFolder = await exec(buildAppFolderCommand, { cwd: process.cwd() });

      //build tmp docker app folder
      const buildArtifactsFolderCommand = `mkdir -p ${artifactsFolder}`;
      const buildArtifactsFolder = await exec(buildArtifactsFolderCommand, { cwd: process.cwd() });

      const prismaConfig = {
        datamodel: `prisma.graphql`,
        endpoint: 'http://localhost:4466',
        secret: 'mysecret123'
      };

      yaml.sync(`${artifactsFolder}/prisma.yml`, prismaConfig);

      const copyPrismaSchemaCommand = `cp -rf ${componentLocation}/datamodel.graphql ${artifactsFolder}/prisma.graphql`;
      const copyPrismaSchema = await exec(copyPrismaSchemaCommand, { cwd: process.cwd() });

      yaml.sync(`${artifactsFolder}/.graphqlconfig.yml`, schemaConfig);

      const schemaBuildCommand = `npm install -g graphql-cli && graphql get-schema`;
      const schemaBuildResult = await exec(schemaBuildCommand, { cwd: artifactsFolder, maxBuffer: 1024 * 500 });
      console.log(schemaBuildResult.stdout);
      console.log(schemaBuildResult.stderr);

      //copy files to tmp docker app folder
      const copyDockerFileCommand = `cp -rf ${handlerLocation}/local-docker-compose.yml ${appFolder}/docker-compose.yml`;
      const copyDockerFile = await exec(copyDockerFileCommand, { cwd: process.cwd() });


      const startCommand = `docker-compose up -d --force-recreate`;
      const startResult = await exec(startCommand, { cwd: appFolder, maxBuffer: 1024 * 500 });
      console.log(startResult.stdout);
      console.log(startResult.stderr);

      const prismaDeployCommand = `npm config set unsafe-perm true; sudo npm install -g prisma; sleep 10; prisma deploy -f;`;
      const prismaDeployResult = await exec(prismaDeployCommand, {
        cwd: artifactsFolder,
        maxBuffer: 1024 * 500,
        env: { ...process.env, PRISMA_MANAGEMENT_API_SECRET: 'mysecret123' }
      });

      console.log(prismaDeployResult.stdout);
      console.log(prismaDeployResult.stderr);

      const tokenCommand = `prisma token`;
      const tokenResult = await exec(tokenCommand, {
        cwd: artifactsFolder,
        maxBuffer: 1024 * 500,
        env: { ...process.env, PRISMA_MANAGEMENT_API_SECRET: 'mysecret123' }
      });

      await exec(`cp -rf ${artifactsFolder}/generated/prisma.graphql ./backend/api/src/generated/prisma.graphql`, { cwd: process.cwd() });
      return {
        endpoint: 'http://localhost:4466',
        prismaToken: tokenResult.stdout,
        dbSchema: `${artifactsFolder}/generated/prisma.graphql`,
      };
    },
    test: (config) => {},
    build: (config) => {},
    deploy: async (config) => {
      return new Promise(async (resolve, reject) => {
        const serviceName = config.service.name;
        const handlerLocation = config.handler.location;
        const componentLocation = `./${config.service.location}`;
        const appFolder = `./.unstack/tmp/docker-apps/${serviceName}`;
        const artifactsFolder = `./.unstack/tmp/artifacts/${serviceName}`;
        const awsRegion = context.secrets.AWS_REGION;

        //build tmp docker app folder
        const buildAppFolderCommand = `mkdir -p ${appFolder}`;
        const buildAppFolder = await exec(buildAppFolderCommand, { cwd: process.cwd() });

        //build tmp docker app folder
        const buildArtifactsFolderCommand = `mkdir -p ${artifactsFolder}`;
        const buildArtifactsFolder = await exec(buildArtifactsFolderCommand, {
          cwd: process.cwd()
        });

        const copyPrismaSchemaCommand = `cp -rf ${componentLocation}/datamodel.graphql ${artifactsFolder}/prisma.graphql`;
        const copyPrismaSchema = await exec(copyPrismaSchemaCommand, { cwd: process.cwd() });

        // to get the aws eb config
        const ebDockerrunString = fs.readFileSync(handlerLocation + '/local.Dockerrun.aws.json', {
          encoding: 'utf-8'
        });

        const dbUser = {
          key: 'dbUser',
          value: context.services['backend.postgres-db'].outputs.user
        };

        const dbHost = {
          key: 'dbHost',
          value:  context.services['backend.postgres-db'].outputs.endpoint
        };

        const dbPassword = {
          key: 'dbPassword',
          value: context.services['backend.postgres-db'].outputs.password
        };

        const prismaSecret = {
          key: 'secret',
          value: context.secrets.PRISMA_SECRET
        };

        const evaluatedConfigString = [dbUser, dbHost, dbPassword, prismaSecret].reduce(
          (result, variable) => {
            return result.replace(`{{${variable.key}}}`, variable.value);
          },
          ebDockerrunString
        );

        // make sure json is valid
        JSON.parse(evaluatedConfigString);

        fs.writeFileSync(appFolder + '/Dockerrun.aws.json', evaluatedConfigString, 'utf-8');

        const ebEnvironment = `${serviceName.split('.').join('')}-${
          context.environment.name == 'review'
            ? context.branch.name.split('-').join('')
            : context.environment.name
        }`;

        const ebConfig = {
          'branch-defaults': {
            default: {
              environment: ebEnvironment,
              group_suffix: serviceName
            }
          },
          deploy: {
            artifact: 'Dockerrun.aws.json'
          },
          global: {
            application_name: serviceName,
            branch: null,
            default_ec2_keyname: null,
            default_platform: 'multi-container-docker-18.03.1-ce-(generic)',
            default_region: awsRegion,
            include_git_submodules: true,
            instance_profile: null,
            platform_name: null,
            platform_version: null,
            profile: null,
            repository: null,
            sc: null,
            workspace_type: 'Application'
          }
        };

        yaml.sync(`${appFolder}/.elasticbeanstalk/config.yml`, ebConfig);

        const listEnvCommand = `eb list`;
        const listEnv = await exec(listEnvCommand, { cwd: appFolder, maxBuffer: 1024 * 500 });
        if (listEnv.stdout.indexOf(ebEnvironment) == -1) {
          const createCommand = `eb create ${ebEnvironment} --elb-type application`;
          const createResult = await exec(createCommand, { cwd: appFolder, maxBuffer: 1024 * 500 });
          console.log(createResult.stdout);
          console.log(createResult.stderr);
        }

        // run eb deploy
        const deployCommand = `eb deploy`;
        const deploy = await exec(deployCommand, { cwd: appFolder, maxBuffer: 1024 * 500 });
        console.log(deploy.stdout);
        console.log(deploy.stderr);

        // get endpoint
        const statusCommand = `eb status`;
        const status = await exec(statusCommand, { cwd: appFolder, maxBuffer: 1024 * 500 });
        console.log(status.stdout);

        const secretsString = status.stdout;

        const cnameString = secretsString
          .split('\n')
          .find((string) => string.indexOf('CNAME: ') != -1);
        const cname = cnameString.slice('CNAME: '.length + 2);
        console.log(cname);
        const endpoint = cname;

        const prismaConfig = {
          datamodel: `prisma.graphql`,
          endpoint: `http://${endpoint}`,
          secret: context.secrets.PRISMA_SECRET
        };

        yaml.sync(`${artifactsFolder}/prisma.yml`, prismaConfig);

        const prismaInstallCommand = `sudo npm install -g prisma && sudo prisma login --key ${
          process.env.PRISMA_CLOUD_SESSION_KEY
        }`;
        const prismaInstall = await exec(prismaInstallCommand, {
          cwd: artifactsFolder,
          maxBuffer: 1024 * 500,
          env: {
            ...process.env,
            PRISMA_MANAGEMENT_API_SECRET: context.secrets.PRISMA_SECRET,
            DEBUG: '*'
          }
        });

        console.log(prismaInstall.stdout);
        console.log(prismaInstall.stderr);

        const prismaDeployCommand = `prisma deploy -f`;
        const prismaDeployResult = await exec(prismaDeployCommand, {
          cwd: artifactsFolder,
          maxBuffer: 1024 * 500,
          env: {
            ...process.env,
            PRISMA_MANAGEMENT_API_SECRET: context.secrets.PRISMA_SECRET,
            DEBUG: '*'
          }
        });

        console.log(prismaDeployResult.stdout);
        console.log(prismaDeployResult.stderr);

        yaml.sync(`${artifactsFolder}/.graphqlconfig.yml`, schemaConfig);

        const schemaBuildCommand = `sudo npm install -g graphql-cli && sudo graphql get-schema`;
        const schemaBuildResult = await exec(schemaBuildCommand, { cwd: artifactsFolder, maxBuffer: 1024 * 500 });
        console.log(schemaBuildResult.stdout);
        console.log(schemaBuildResult.stderr);

        const tokenCommand = `sudo prisma token`;
        const tokenResult = await exec(tokenCommand, {
          cwd: artifactsFolder,
          maxBuffer: 1024 * 500,
          env: {
            ...process.env,
            PRISMA_MANAGEMENT_API_SECRET: context.secrets.PRISMA_SECRET,
            DEBUG: '*'
          }
        });

        // resolve with outputs
        const outputs = {
          endpoint,
          prismaToken: tokenResult.stdout,
          dbSchema: `${artifactsFolder}/generated/prisma.graphql`,
        };
        resolve(outputs);
      });
    }
  };
};

module.exports = {
  wrapComponent
};
