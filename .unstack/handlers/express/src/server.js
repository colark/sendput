import express from 'express';

export default (withServer) => {
  const app = express()

  withServer(app);

  app.listen(8080, function (err){
    console.log("Calling express server's callback function.");
    console.log(err);
  })
}
