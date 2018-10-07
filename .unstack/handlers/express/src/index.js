import server from './server';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');

const wrapComponent = ({ withServer }, context) => {
  return {
    start: async (config) => {
      const serviceName = config.service.name;

      const handlerLocation = config.handler.location;
      const componentLocation = `./${config.service.location}`;
      const appFolder = `./.unstack/tmp/artifacts/start/${serviceName}`;

      try {
        server(withServer);
      } catch (e) {
        console.log(e)
      }

    },
    deploy: () => {
      console.log('deploying express')
    }
  }
}


module.exports = {
  wrapComponent
}
