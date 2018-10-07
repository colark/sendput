import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

export default {
  withServer: (app) => {
    app.get("/",(req, res) => {
      res.status(200);
      res.send("hi!");
      res.end();
    })

    app.post('/receiveData', urlencodedParser, async (req, res) => {
      try {
        console.log(req.body)
        const actualBody = JSON.parse(Object.keys(req.body)[0])
        console.log(`Received data for request token ${actualBody.token}`)
        const parsedData = actualBody.data;
        parsedData.forEach(dataToVerify => {
          console.log(`Attempting to verify ${JSON.stringify(dataToVerify)}`)
        })
        return res.status(200).json({
          success: true,
          token: actualBody.token,
        })
      } catch (error) {
        console.log(error)
      }
    })
  }
 }
