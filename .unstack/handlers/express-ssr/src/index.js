import server from './server';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');

const wrapComponent = (component, context) => {
  return {
    start: async (config) => {
      const serviceName = config.service.name;

      const handlerLocation = config.handler.location;
      const componentLocation = `./${config.service.location}`;
      const appFolder = `./.unstack/tmp/artifacts/start/${serviceName}`;

      //build tmp docker app folder
      const buildBundleFolderCommand = `mkdir -p ${appFolder}`;
      const buildBundleFolder = await exec(buildBundleFolderCommand, { cwd: process.cwd() });

      await exec(`cp -R ${handlerLocation}/* ${appFolder}`, {
        cwd: process.cwd()
      });

      await exec(`cp -R ${handlerLocation}/.babelrc ${appFolder}/.babelrc`, {
        cwd: process.cwd()
      });


      await exec(`rm -rf ${appFolder}/component`, { cwd: process.cwd() });
      await exec(`cp -rf ${componentLocation}/. ${appFolder}/component`, { cwd: process.cwd() });

      const handlerPackageJson = JSON.parse(
        fs.readFileSync(handlerLocation + '/package.json', { encoding: 'utf-8' })
      );

      // to get es6 goodness via babel
      const serviceDependencies = JSON.parse(
        fs.readFileSync(handlerLocation + '/service-dependencies.json', { encoding: 'utf-8' })
      );

      const componentPackageJson = JSON.parse(
        fs.readFileSync(componentLocation + '/package.json', { encoding: 'utf-8' })
      );

      // merge package.json dependencies in place with handler dependencies
      componentPackageJson.dependencies = Object.assign(
        {},
        handlerPackageJson.dependencies,
        componentPackageJson.dependencies,
        serviceDependencies
      );

      fs.writeFileSync(
        appFolder + '/package.json',
        JSON.stringify(componentPackageJson),
        'utf-8'
      );

      try {
        const babelFile = await exec(
          'parcel build entry.unstack.js component/pages/dashboard.js',
          { cwd: appFolder, maxBuffer: 1024 * 500 }
        );
        console.log(babelFile.stdout)
        console.log(babelFile.stderr)
      } catch (e) {
        console.log(e)
      }
      try {
        server(component.app, { API_URL: 'http://localhost:4000', BUNDLE_DIRECTORY: appFolder });
      } catch (e) {
        console.log(e)
      }

    },
    deploy: () => {
      console.log('deploying express-ssr!!')
    }
  }
}


module.exports = {
  wrapComponent
}
