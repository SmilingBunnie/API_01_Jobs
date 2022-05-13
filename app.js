require('dotenv').config();
require('express-async-errors');
const express = require('express');

//extra security packages
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')

const app = express();

const connectDB = require('./db/connect')
connectDB(process.env.MONGO_URI)
  .then((result) => {
    console.log('connected to dB')
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  })
  .catch((err) => {
    console.log(err)
  })

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
)
app.use(helmet())
app.use(xss())
app.use(cors())

app.get('/', (req, res) =>{
  res.send('APP IS RUNNING')
})
// routes
app.use('/api/v1/jobs', jobsRouter)
app.use('/api/v1/auth', authRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

/*const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();*/
