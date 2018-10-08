import bodyParser from 'body-parser';
const sgMail = require('@sendgrid/mail');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const { Prisma } = require('prisma-binding');
const cors = require('cors')
const express = require('express');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const subscribeTemplate = `
<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Sendput Identity Confirmation Email</title>
<style>
/* -------------------------------------
INLINED WITH htmlemail.io/inline
------------------------------------- /
/ -------------------------------------
RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 620px) {
table[class=body] h1 {
font-size: 28px !important;
margin-bottom: 10px !important;
}
table[class=body] p,
table[class=body] ul,
table[class=body] ol,
table[class=body] td,
table[class=body] span,
table[class=body] a {
font-size: 16px !important;
}
table[class=body] .wrapper,
table[class=body] .article {
padding: 10px !important;
}
table[class=body] .content {
padding: 0 !important;
}
table[class=body] .container {
padding: 0 !important;
width: 100% !important;
}
table[class=body] .main {
border-left-width: 0 !important;
border-radius: 0 !important;
border-right-width: 0 !important;
}
table[class=body] .btn table {
width: 100% !important;
}
table[class=body] .btn a {
width: 100% !important;
}
table[class=body] .img-responsive {
height: auto !important;
max-width: 100% !important;
width: auto !important;
}
}

/* -------------------------------------
  PRESERVE THESE STYLES IN THE HEAD
------------------------------------- */
@media all {
.ExternalClass {
  width: 100%;
}
.ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
  line-height: 100%;
}
.apple-link a {
  color: inherit !important;
  font-family: inherit !important;
  font-size: inherit !important;
  font-weight: inherit !important;
  line-height: inherit !important;
  text-decoration: none !important;
}
.btn-primary table td:hover {
  background-color: #34495e !important;
}
.btn-primary a:hover {
  background-color: #34495e !important;
  border-color: #34495e !important;
}
}
</style>
</head>
<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
<tr>
<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> </td>
<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
<div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

      <!-- START CENTERED WHITE CONTAINER -->
      <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
      <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

        <!-- START MAIN CONTENT AREA -->
        <tr>
          <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
              <tr>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi there,</p>
                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thanks for using Sendput! To claim your first reimbursment, first you'll need to confirm your identity with Bloom. Please scan the QR code below.</p>
                  <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                    <tbody>
                      <tr>
                        <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                            <tbody>
                              <tr>
                                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="https://e925a452.ngrok.io/qr1.jpeg" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Scan QR Code</a> </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Once you submit your first expense, we'll let you know shortly if it's approved.</p>
                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sendput Team</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      <!-- END MAIN CONTENT AREA -->
      </table>

      <!-- START FOOTER -->
      <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
          <tr>
            <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
              <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Colark Inc, San Francisco CA 94110</span>
              <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>.
            </td>
          </tr>
          <tr>
            <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
              Powered by <a href="http://htmlemail.io" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">HTMLemail</a>.
            </td>
          </tr>
        </table>
      </div>
      <!-- END FOOTER -->

    <!-- END CENTERED WHITE CONTAINER -->
    </div>
  </td>
  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
</tr>
</table>
</body>
</html>
`


const emailConfirmationTemplate = `
<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Sendput Confirmation Email</title>
<style>
/* -------------------------------------
INLINED WITH htmlemail.io/inline
------------------------------------- /
/ -------------------------------------
RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 620px) {
table[class=body] h1 {
font-size: 28px !important;
margin-bottom: 10px !important;
}
table[class=body] p,
table[class=body] ul,
table[class=body] ol,
table[class=body] td,
table[class=body] span,
table[class=body] a {
font-size: 16px !important;
}
table[class=body] .wrapper,
table[class=body] .article {
padding: 10px !important;
}
table[class=body] .content {
padding: 0 !important;
}
table[class=body] .container {
padding: 0 !important;
width: 100% !important;
}
table[class=body] .main {
border-left-width: 0 !important;
border-radius: 0 !important;
border-right-width: 0 !important;
}
table[class=body] .btn table {
width: 100% !important;
}
table[class=body] .btn a {
width: 100% !important;
}
table[class=body] .img-responsive {
height: auto !important;
max-width: 100% !important;
width: auto !important;
}
}

/* -------------------------------------
  PRESERVE THESE STYLES IN THE HEAD
------------------------------------- */
@media all {
.ExternalClass {
  width: 100%;
}
.ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
  line-height: 100%;
}
.apple-link a {
  color: inherit !important;
  font-family: inherit !important;
  font-size: inherit !important;
  font-weight: inherit !important;
  line-height: inherit !important;
  text-decoration: none !important;
}
.btn-primary table td:hover {
  background-color: #34495e !important;
}
.btn-primary a:hover {
  background-color: #34495e !important;
  border-color: #34495e !important;
}
}
</style>
</head>
<body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
<table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
<tr>
<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> </td>
<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
<div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

      <!-- START CENTERED WHITE CONTAINER -->
      <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
      <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

        <!-- START MAIN CONTENT AREA -->
        <tr>
          <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
              <tr>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi Lian,</p>
                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thanks for confirming your identity with Bloom!</p>
                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Reply with your expense reports to start a rapid reimbursment.</p>
                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thanks for using Sendput.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      <!-- END MAIN CONTENT AREA -->
      </table>

      <!-- START FOOTER -->
      <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
          <tr>
            <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
              <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Colark Inc, San Francisco CA 94110</span>
              <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif" style="text-decoration: underline; color: #999999; font-size: 12px; text-align: center;">Unsubscribe</a>.
            </td>
          </tr>
          <tr>
            <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
              Powered by <a href="http://htmlemail.io" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">HTMLemail</a>.
            </td>
          </tr>
        </table>
      </div>
      <!-- END FOOTER -->

    <!-- END CENTERED WHITE CONTAINER -->
    </div>
  </td>
  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
</tr>
</table>
</body>
</html>
`

const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

export default {
  withServer: (app, { context }) => {
    const db = new Prisma({
      typeDefs: `./${context.services['backend.prisma'].outputs.dbSchema}`,
      endpoint: context.services['backend.prisma'].outputs.endpoint,
      secret: context.secrets.PRISMA_SECRET
    })

    app.options('*', cors())

    app.use(express.static('backend/manage/assets'));

    app.post("/subscribe", cors(corsOptions), async (req, res) => {
      const foundEmail = 'lianythompson@gmail.com';
      const userExists = await db.exists.User({
        email: foundEmail
      });
      res.status(200);
      if(true){ //!userExists
        // const user = await db.mutation
        //       .createUser(
        //           {
        //               data: {
        //                   email: foundEmail,
        //               }
        //           }
        //       )
        //       .catch((err) => {
        //           console.error(err);
        //           throw new Error("Server error: couldn't perform signUp mutation.");
        //       });
        const msg = {
          to: foundEmail,
          from: 'lian@colark.com',
          subject: 'Please confirm your identity with Bloom',
          text: 'and easy to do anywhere, even with Node.js',
          html: subscribeTemplate,
        }
        sgMail.send(msg);
      } else {
      }
      res.send('Request processed');
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

        const msg = {
          to: 'lianythompson@gmail.com',
          from: 'lian@colark.com',
          subject: 'Thanks for confirming your identity',
          text: 'and easy to do anywhere, even with Node.js',
          html: emailConfirmationTemplate,
        }
        sgMail.send(msg);

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
