import 'dotenv/config';
import * as fs from 'fs';
import * as https from 'https';
import setupApp from './src/app';

let port = 4000;
let credentials: any = undefined;

if (process.env.ENV === 'production') {
  port = 80;

  // Certificate
  const privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/api-demo.thesafewaystore.com/privkey.pem',
    'utf8'
  );
  const certificate = fs.readFileSync(
    '/etc/letsencrypt/live/api-demo.thesafewaystore.com/cert.pem',
    'utf8'
  );
  const ca = fs.readFileSync(
    '/etc/letsencrypt/live/api-demo.thesafewaystore.com/chain.pem',
    'utf8'
  );

  credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };
}

setupApp()
  .then(app => {
    if (process.env.ENV === 'production') {
      const httpsServer = https.createServer(credentials, app);
      httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
      });
    }
    app.listen(port, () =>
      console.log(`🚀 Server ready at http://localhost:${port}`)
    );
  })
  .catch((err: Error) => {
    console.log(err);
    process.exit(1);
  });
