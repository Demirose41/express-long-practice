const express = require('express');
const app = express();
const dogs = require('./routes/dogs')


app.use("/static", express.static("assets"))
app.use(express.json())
app.use(dogs)


const errorHandling = (err, req, res, next) => {
  if(process.env.NODE_ENV === 'development'){
    res.json({
      message: err.message,
      statuscode: err.statusCode || 500,
      stack: err.stack 
    });
  } else {
    res.json({
      message: err.message,
      statuscode: err.statusCode || 500
    });
  }
};

const resourceNotFound = ( req, res, next) => {
  res.status(404)
  throw new Error("The requested resource coudln't be found")
}

const logger = (req, res, next) => {
  console.log("url:", req.url)
  res.on('finish', () => {
    console.log("\n StatusCode: ", res.statusCode )
  })
  next()
}

app.use(logger)

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// app.get("/images/:imgName", (req, res ) => {

// })

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
});

// For testing express-async-errors
app.get('/test-error', async (req, res, next) => {
  try {
    throw new Error("Hello World!")
  } catch (err) {
    next(err)
  }
});


app.use("*", resourceNotFound)
app.use(errorHandling)

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is listening on port: ${port}\n NODE_ENV: ${process.env.NODE_ENV}`));