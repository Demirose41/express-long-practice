const express = require('express');
const app = express();

app.use("/static", express.static("assets"))
app.use(express.json())

const errorHandling = (err, req, res, next) => {
  res.status(500).json({
    msg: err.message,
    success: false,
  });
};

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

app.use(errorHandling)

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));