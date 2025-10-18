import { io } from "socket.io-client";

const socket = io(__SERVER_URL__, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.on("connect", () => console.log("✅ Socket connected:", socket.id));

socket.on("disconnect", (reason) => console.log("❌ Socket disconnected:", reason));

/* ----------------------------- connect socket ----------------------------- */
const connectSocket = ({ path }) => {
  if (!socket.connected) {
    socket.auth = {
      path: path || "/",
    };

    socket.connect();
  }
};

/* ----------------------------- disconnect socket ----------------------------- */
const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

/* ----------------------------- send event from client to socket ----------------------------- */
const sendEventToSocket = (event, ...args) => {
  if (socket.connected) socket.emit(event, ...args);
};

/* ----------------------------- receive event from socket ----------------------------- */
const receiveEventFromSocket = (event, callback) => {
  socket.off(event);

  socket.on(event, (...args) => {
    callback(...args);
  });
};

const closeSocketEvent = (event) => {
    socket.off(event);
}

export { socket, connectSocket, disconnectSocket, sendEventToSocket, receiveEventFromSocket, closeSocketEvent };
