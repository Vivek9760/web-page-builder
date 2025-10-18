const ONLINE_USERS = new Map(); // Track online users
const PAGE_ROOMS = new Map(); // Track users in specific pages

/* ----------------------------- filepath ----------------------------- */
const FILE_PATH = "server/controllers/socket.controller";

/**
 * ONLINE_USERS structure:
 * {
 *   userId: {
 *     socketId1: { path: '/builder/page-1' },
 *     socketId2: { path: '/preview/page-1' }
 *   }
 * }
 *
 * PAGE_ROOMS structure:
 * {
 *   'slug': [
 *     { socketId: 'socket1', userId: 'user1' },
 *     { socketId: 'socket2', userId: 'user2' }
 *   ]
 * }
 */

const userConnect = (io, socket) => {
  try {
    const { userId, path } = socket;
    const userData = ONLINE_USERS.get(userId) || {};
    userData[socket.id] = { path };
    ONLINE_USERS.set(userId, userData);

    broadcastToAllActiveInstanceOfUser(io, socket);

    console.log("✅ User connected");
  } catch (error) {
    console.error(FILE_PATH + "-> userConnect", error);
  }
};

const updatePath = (socket, path) => {
  try {
    const { userId } = socket;
    const userData = ONLINE_USERS.get(userId);

    if (userData?.[socket.id]) {
      userData[socket.id].path = path;
      ONLINE_USERS.set(userId, userData);
    }
  } catch (error) {
    console.error(FILE_PATH + "-> updatePath", error);
  }
};

const userDisconnect = (io, socket) => {
  try {
    const { userId } = socket;
    const userData = ONLINE_USERS.get(userId);

    if (userData) {
      delete userData[socket.id];

      for (const [pageSlug, users] of PAGE_ROOMS.entries()) {
        const updatedUsers = users.filter((u) => u.socketId !== socket.id);
        if (updatedUsers.length === 0) {
          PAGE_ROOMS.delete(pageSlug);
        } else if (updatedUsers.length !== users.length) {
          PAGE_ROOMS.set(pageSlug, updatedUsers);
          socket.to(pageSlug).emit("USER_LEFT", {
            activeUsers: updatedUsers,
          });
        }
      }

      if (Object.keys(userData).length === 0) {
        ONLINE_USERS.delete(userId);
      } else {
        ONLINE_USERS.set(userId, userData);
      }

      broadcastToAllActiveInstanceOfUser(io, socket);

      console.log("❌ User disconnected");
    }
  } catch (error) {
    console.error(FILE_PATH + "-> userDisconnect", error);
  }
};

const joinPage = (socket, { pageSlug }) => {
  try {
    const { userId } = socket;

    socket.join(pageSlug);

    const roomUsers = PAGE_ROOMS.get(pageSlug) || [];
    const existingUser = roomUsers.find((u) => u.socketId === socket.id);

    if (!existingUser) {
      roomUsers.push({ socketId: socket.id, userId });
      PAGE_ROOMS.set(pageSlug, roomUsers);
    }

    socket.emit("ROOM_USERS", { users: roomUsers });

    socket.to(pageSlug).emit("USER_JOINED", {
      activeUsers: roomUsers,
    });

    console.log("👥 User joined page");
  } catch (error) {
    console.error(FILE_PATH + "-> joinPage", error);
  }
};

const leavePage = (socket, { pageSlug }) => {
  try {
    socket.leave(pageSlug);

    const roomUsers = PAGE_ROOMS.get(pageSlug) || [];
    const updatedUsers = roomUsers.filter((u) => u.socketId !== socket.id);

    if (updatedUsers.length === 0) {
      PAGE_ROOMS.delete(pageSlug);
    } else {
      PAGE_ROOMS.set(pageSlug, updatedUsers);
    }

    socket.to(pageSlug).emit("USER_LEFT", {
      activeUsers: updatedUsers,
    });

    console.log("👋 User left page");
  } catch (error) {
    console.error(FILE_PATH + "-> leavePage", error);
  }
};

const blockUpdate = (socket, { pageSlug, blocks }) => {
  try {
    socket.to(pageSlug).emit("BLOCKS_UPDATED", { blocks });
  } catch (error) {
    console.error(FILE_PATH + "-> blockUpdate", error);
  }
};

const titleUpdate = (socket, { pageSlug, title }) => {
  try {
    socket.to(pageSlug).emit("TITLE_UPDATED", { title });
  } catch (error) {
    console.error(FILE_PATH + "-> titleUpdate", error);
  }
};

const broadcastToAllActiveInstanceOfUser = (io, socket) => {
  try {
    const allUsers = [];
    const socketIds = [];
    const userData = ONLINE_USERS.get(socket.userId);
    if (userData) {
      for (const [socketId, data] of Object.entries(userData)) {
        socketIds.push(socketId);
        allUsers.push({
          socketId,
          userId: socket.userId,
          path: data.path,
        });
      }
    }

    console.log(socketIds);

    socketIds.forEach((socketId) => {
      io.to(socketId).emit("ALL_ACTIVE_USERS", { users: allUsers });
    });
  } catch (error) {
    console.error(FILE_PATH + "-> broadcastToAllActiveInstanceOfUser", error);
  }
};

module.exports = {
  userConnect,
  updatePath,
  userDisconnect,
  joinPage,
  leavePage,
  blockUpdate,
  titleUpdate,
};
