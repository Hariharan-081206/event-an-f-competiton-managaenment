// import schedule from 'node-schedule';

// /**
//  * 📅 Schedule a job to emit that a venue is now available after the event ends
//  * @param {Date} endTime - Time when venue should be considered free
//  * @param {mongoose.Types.ObjectId | string} venueId - ID of the venue to notify about
//  * @param {SocketIO.Server} io - Socket.IO server instance
//  */
// export function scheduleVenueFreeingJob(endTime, venueId, VenueModel, io) {
//   if (!(endTime instanceof Date) || isNaN(endTime.getTime())) {
//     console.warn('⚠️ Invalid endTime for scheduling venue freeing.');
//     return;
//   }

//   if (!venueId) {
//     console.warn('⚠️ Venue ID not provided for scheduling.');
//     return;
//   }

//   // ✅ Schedule job only to notify clients via Socket.IO
//   schedule.scheduleJob(endTime, () => {
//     console.log(`✅ Emitting venue free event for Venue ID: ${venueId} at ${endTime.toISOString()}`);

//     io.emit('venueStatusChanged', {
//       venueId: venueId.toString(),
//       newStatus: 'free',
//     });
//   });

//   console.log(`📌 Venue freeing (notification only) scheduled at ${endTime.toISOString()} for Venue ID: ${venueId}`);
// }


import schedule from 'node-schedule';

/**
 * 📅 Schedule a job to notify that a venue (by roomnumber) is now available after the event ends
 * @param {Date} endTime - Time when venue should be considered free
 * @param {string} roomnumber - Room number of the venue (used instead of MongoDB _id)
 * @param {mongoose.Model} VenueModel - Venue model (used only if needed for further logic)
 * @param {SocketIO.Server} io - Socket.IO server instance
 */
export function scheduleVenueFreeingJob(endTime, roomnumber, io) {
  if (!(endTime instanceof Date) || isNaN(endTime.getTime())) {
    console.warn('⚠️ Invalid endTime for scheduling venue freeing.');
    return;
  }

  if (!roomnumber || typeof roomnumber !== 'string') {
    console.warn('⚠️ Room number not provided or invalid for scheduling.');
    return;
  }

  // ✅ Schedule job to emit free event
  schedule.scheduleJob(endTime, () => {
    console.log(`✅ Emitting venue free event for Room: ${roomnumber} at ${endTime.toISOString()}`);

    io.emit('venueStatusChanged', {
      roomnumber,
      newStatus: 'free',
    });
  });

  console.log(`📌 Venue freeing (notification only) scheduled at ${endTime.toISOString()} for Room: ${roomnumber}`);
}
