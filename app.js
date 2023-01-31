const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

dotenv.config({ path: './config.env' });

const PORT = process.env.PORT;
require("./db/conn.js");

app.use(express.json());

// const User = require("./models/userSchema");

app.use(cors({
  origin: '*', // use your actual domain name (or localhost), using * is not recommended
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}))

// app.UseCors(x => x
//   .AllowAnyMethod()
//   .AllowAnyHeader()
//   .SetIsOriginAllowed(origin => true) // allow any origin 
//   .AllowCredentials());

app.use(require('./router/auth'));

// app.get('/', (req, res) => {
//   res.send("Hello from server in app!");
// })

// app.get('/signin', (req, res) => {
//   res.send("Hello to signin from server!");
// })

// app.post('/signin', (req, res) => {
//   console.log(req.body);
//   res.json({ message: req.body });
// })

app.get('/signup', (req, res) => {
  res.send("Hello to signup from server!");
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
})