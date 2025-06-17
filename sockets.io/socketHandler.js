export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // ✅ Listen for simple ping/pong test
    socket.on('pingServer', () => {
      console.log(`📨 Received ping from client ${socket.id}`);
      socket.emit('pongServer', 'Pong from server');
    });

    // ℹ️ Add more socket event listeners here if needed

    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} (${reason})`);
    });
  });

  /**
   * ✅ Custom utility to emit venue status changes using roomnumber
   * This replaces the old venueId-based emitter
   */
  io.emitVenueStatusChange = (name, newStatus) => {
    io.emit('venueStatusChanged', { name, newStatus }); // 🔄 CHANGED: venueId → roomnumber
    console.log(`📡 Emitted venueStatusChanged: ${name} => ${newStatus}`);
  };

  console.log('✅ Socket.IO setup complete');
}
