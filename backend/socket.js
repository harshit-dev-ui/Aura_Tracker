export default function initializeSocket(io) {
  const rooms = {};
  const timers = {};

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', ({ roomId, userId, userName }) => {
      socket.join(roomId);
      console.log(`User ${userName} (${userId}) joined room ${roomId}`);
    
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
    
      rooms[roomId].push({ userId, name: userName });
      io.to(roomId).emit('userJoined', { name: userName, userId });
      io.to(roomId).emit('updateParticipants', rooms[roomId]); // Send updated participants list
    });
    
    socket.on('leaveRoom', ({ roomId, userId }) => {
      console.log(`User ${userId} left room ${roomId}`);
      socket.leave(roomId);
    
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter((p) => p.userId !== userId);
        io.to(roomId).emit('updateParticipants', rooms[roomId]); // Send updated participants list
      }
    });

    socket.on("startTimer", (roomId, timerDuration) => {
      console.log(`Starting timer for room ${roomId} with duration ${timerDuration}`);
      
      if (!timers[roomId] || !timers[roomId].isRunning) {
        let timeLeft = timerDuration;

        timers[roomId] = { timeLeft, isRunning: true };

        const interval = setInterval(() => {
          if (timeLeft <= 0) {
            clearInterval(interval);
            io.to(roomId).emit("timerFinished");
            timers[roomId].isRunning = false;
          } else {
            timeLeft -= 1;
            timers[roomId].timeLeft = timeLeft;
            io.to(roomId).emit("timerUpdate", timeLeft);
          }
        }, 1000);

        timers[roomId].interval = interval;

        // Broadcast that the timer has started to all clients
        io.to(roomId).emit("timerStarted", timeLeft);
      }
    });

    socket.on("stopTimer", (roomId) => {
      console.log(`Stopping timer for room ${roomId}`);
      if (timers[roomId]) {
        clearInterval(timers[roomId].interval);
        timers[roomId] = { timeLeft: 0, isRunning: false };
        io.to(roomId).emit("timerUpdate", 0); // Send reset timer to clients
        io.to(roomId).emit("timerStopped"); // Broadcast stop to the room
      }
    });

    socket.on("sendMessage", ({ roomId, message, userId, userName }) => {
      io.to(roomId).emit("receiveMessage", { userId, userName, message });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
