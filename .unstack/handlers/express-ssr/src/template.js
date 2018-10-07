import cssReset from './css-reset';

export default (app, state, styleTags) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>test app</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
        <!-- css reset -->
        <style>
          ${cssReset}
        </style>
        <!-- styled-components -->
        ${styleTags}

        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">

        <script>
          window.__isNew__ = true;
          window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};
        </script>
    </head>
    <body>
        <div id="app">${app}</div>
        <script src="http://localhost:3000/bundle/dist/entry.unstack.js"></script>
    </body>
    </html>
`
