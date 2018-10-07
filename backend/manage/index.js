import bodyParser from 'body-parser';
const sgMail = require('@sendgrid/mail');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const { Prisma } = require('prisma-binding');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      res.status(200);
      if(!userExists){
        const user = await db.mutation
              .createUser(
                  {
                      data: {
                          email: req.query.email,
                      }
                  }
              )
              .catch((err) => {
                  console.error(err);
                  throw new Error("Server error: couldn't perform signUp mutation.");
              });
        const msg = {
          to: 'lianythompson@gmail.com',
          from: 'lian@colark.com',
          subject: 'HI LIAN',
          text: 'and easy to do anywhere, even with Node.js',
          html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        sgMail.send(msg);
        res.send(`Hi! we sent you an email ${userExists}`);
      }
      res.send('Hi, no email.');
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
