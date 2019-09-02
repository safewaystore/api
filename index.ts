import 'dotenv/config';
import setupApp from './src/app';

let port = 4000;
if (process.env.ENV === 'production') {
  port = 80;
}

setupApp()
  .then(app =>
    app.listen(port, () =>
      console.log(`🚀 Server ready at http://localhost:${port}`)
    )
  )
  .catch((err: Error) => {
    console.log(err);
    process.exit(1);
  });
