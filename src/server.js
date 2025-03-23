const express = require("express");
const serverless = require("serverless-http");
const transactionRoutes = require("./src/routes/transactionRoutes");

const app = express();

app.use("/api", transactionRoutes);

module.exports.handler = serverless(app);
