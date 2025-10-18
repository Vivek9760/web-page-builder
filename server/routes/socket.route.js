const socketController = require("../controllers/socket.controller.js");

module.exports = (io, socket) => {
  socketController.userConnect(io, socket);

  socket.on("UPDATE_PATH", (path) => {
    socketController.updatePath(socket, path);
  });

  socket.on("JOIN_PAGE", (data) => {
    socketController.joinPage(socket, data);
  });

  socket.on("LEAVE_PAGE", (data) => {
    socketController.leavePage(socket, data);
  });

  socket.on("BLOCK_UPDATE", (data) => {
    socketController.blockUpdate(socket, data);
  });

  socket.on("TITLE_UPDATE", (data) => {
    socketController.titleUpdate(socket, data);
  });

  socket.on("disconnect", () => {
    socketController.userDisconnect(io, socket);
  });
};
