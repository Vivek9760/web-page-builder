/* ----------------------------- set server timezone to UTC-0 ----------------------------- */
process.env.TZ = "0";

/* ----------------------------- libraries ----------------------------- */
/* -----------------------------  Load env variables first ----------------------------- */
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");

/* ----------------------------- services ----------------------------- */
const initializeSocket = require("./services/socket.service.js");

const app = express();
const server = http.createServer(app);

/* ----------------------------- initialize socket ----------------------------- */
initializeSocket(server);

if (["development", "test"].includes(process.env.ENVIRONMENT)) {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

/* --------------------- Connect to database before anything else --------------------- */
require("./configs/db.config.js");

/* ----------------------------- constants ----------------------------- */
const HttpStatus = require("./constants/http-status.constant");
const Toasty = require("./constants/toasty.constant.js");

const port = process.env.SERVER_PORT;

/* --------------------- Middlewares --------------------- */
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

/* --------------------- Base Route  --------------------- */
app.use("/api", require("./routes"));

/* --------------------- Handle Invalid Routes --------------------- */
app.use((req, res) => {
  res.status(HttpStatus.NOT_FOUND).json({ msg: "Sorry, This route is not found on this server" });
});

/* ----------------------------- Error-handling middleware ----------------------------- */
app.use((err, req, res, next) => {
  console.error(err, "Error-handling middleware");
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: Toasty.SERVER.INTERNAL_SERVER_ERROR });
});

/* --------------------- Start Server --------------------- */
server.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});

/* ----------------------------- handle uncaught exception errors ----------------------------- */
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
