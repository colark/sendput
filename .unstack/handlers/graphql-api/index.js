import { GraphQLServer } from 'graphql-yoga';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');

const wrapComponent = ({ makeConfig }, context) => {
  const build = (config) => {};

  return {
    start: (config) => {
      const server = new GraphQLServer(makeConfig(context));
      server.start(() => console.log('Server is running on localhost:4000'));
    },
    test: (config) => {},
    provideContext: async (config) => {},
    build,
    deploy: async (config) => {}
  };
};

module.exports = {
  wrapComponent
};
