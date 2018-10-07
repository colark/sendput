import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const { Prisma } = require('prisma-binding');

export default {
  withServer: (app, { context }) => {
    const db = new Prisma({
      typeDefs: `./${context.services['backend.prisma'].outputs.dbSchema}`,
      endpoint: context.services['backend.prisma'].outputs.endpoint,
      secret: context.secrets.PRISMA_SECRET
    })

    app.get("/", async (req, res) => {
      res.status(200);
      const userExists = await db.exists.User({
        email: req.query.email
      });
      res.send(`hi! user exists? ${userExists}`);
      res.end();
    })

    app.post('/receiveData', urlencodedParser, async (req, res) => {
      try {
        console.log(req.body)
        const actualBody = JSON.parse(Object.keys(req.body)[0])
        console.log(req.body)
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
