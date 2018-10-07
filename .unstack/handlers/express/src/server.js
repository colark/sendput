import express from 'express';

export default (withServer, { context }) => {
  const app = express()

  withServer(app, { context });

  app.listen(8000, function (err){
    console.log("Calling express server's callback function.");
    console.log(err);
  })
}
