const socket = (io) => {
  io.on("connection", (socket) => {
    console.log("connect socket");
    socket.on("create", ({ success = null }) => {
      if (success) socket.broadcast.emit("reload", { success: true });
    });
    socket.on("edit", ({ success = null }) => {
      if (success) socket.broadcast.emit("reload", { success: true });
    });
    socket.on("remove", ({ success = null }) => {
      if (success) socket.broadcast.emit("reload", { success: true });
    });
  });
};

module.exports = socket;
