/* ----------------------------- filepath ----------------------------- */
const FILE_PATH = "server/services/socket.service";

/* ----------------------------- socket handler ----------------------------- */
const socketHandlers = require('../routes/socket.route');

/* ----------------------------- libraries ----------------------------- */
const { Server } = require("socket.io");

/* ----------------------------- middleware ----------------------------- */
const { socketAuthentication } = require("../middlewares/authentication.middleware");

const initializeSocket = (server) => {
  try {
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
      },
    });

    io.use(socketAuthentication);

    io.on("connection", (socket) => {
      socketHandlers(io, socket);
    });
  } catch (error) {
    console.error(FILE_PATH + "-> initializeSocket", error);
  }
};

module.exports = initializeSocket;
