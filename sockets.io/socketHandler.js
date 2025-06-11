// export function setupSocket(io) {
//   io.on('connection', (socket) => {
//     console.log('🔌 Client connected:', socket.id);

//     socket.on('pingServer', () => {
//       console.log(`📨 Received ping from client ${socket.id}`);
//       socket.emit('pongServer', 'Pong from server');
//     });

//     // You can listen to other client events here if needed

//     socket.on('disconnect', (reason) => {
//       console.log(`❌ Client disconnected: ${socket.id} (${reason})`);
//     });
//   });

//   // ✅ Utility method attached to io instance for easy emitting from anywhere
//   io.emitVenueStatusChange = (venueId, newStatus) => {
//     io.emit('venueStatusChanged', { venueId, newStatus });
//     console.log(`📡 Emitted venueStatusChanged: ${venueId} => ${newStatus}`);
//   };

//   console.log('✅ Socket.IO setup complete');
// }



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
  io.emitVenueStatusChange = (roomnumber, newStatus) => {
    io.emit('venueStatusChanged', { roomnumber, newStatus }); // 🔄 CHANGED: venueId → roomnumber
    console.log(`📡 Emitted venueStatusChanged: ${roomnumber} => ${newStatus}`);
  };

  console.log('✅ Socket.IO setup complete');
}
