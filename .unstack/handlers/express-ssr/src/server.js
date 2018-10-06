require('isomorphic-fetch');
import React from 'react';
import express from 'express';
import httpProxy from 'http-proxy';
import toHtmlString from './template';
import ReactDOM from 'react-dom/server';
import { ApolloClient } from 'apollo-client';
import { StaticRouter } from 'react-router';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { getDataFromTree } from 'react-apollo';
import { ServerStyleSheet } from 'styled-components'
import { renderStylesToString } from 'emotion-server'

import makeShell from './makeShell';

export default (App, options) => {
  const app = express()

  //make js bundles be served from this server
  app.use('/bundle', express.static(options.BUNDLE_DIRECTORY))
  app.use(express.static('web'));
  app.use('*', function(req, res) {
    const apolloClient = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: options.API_URL,
      }),
      cache: new InMemoryCache(),
    });

    const context = {};
    const sheet = new ServerStyleSheet();

    const RoutedApp = (
      <StaticRouter location={req.originalUrl} context={context}>
        {makeShell(App, { apolloClient })}
      </StaticRouter>
    );

    getDataFromTree(RoutedApp).then(() => {
      const content = renderStylesToString(ReactDOM.renderToString(sheet.collectStyles(RoutedApp)));
      const initialState = apolloClient.extract();
      const styleTags = sheet.getStyleTags();

      res.status(200);
      res.send(toHtmlString(content, initialState, styleTags));
      res.end();
    });
  })

  app.listen(3000, function (err){
    console.log("Calling app.listen's callback function.");
    console.log(err);
  })
}
