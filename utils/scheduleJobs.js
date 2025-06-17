import schedule from 'node-schedule';

/**
 * 📅 Schedule a job to notify that a venue (by roomnumber) is now available after the event ends
 * @param {Date} endTime - Time when venue should be considered free
 * @param {string} name - Room number of the venue (used instead of MongoDB _id)
 * @param {mongoose.Model} VenueModel - Venue model (used only if needed for further logic)
 * @param {SocketIO.Server} io - Socket.IO server instance
 */
export function scheduleVenueFreeingJob(endTime, name, io) {
  if (!(endTime instanceof Date) || isNaN(endTime.getTime())) {
    console.warn('⚠️ Invalid endTime for scheduling venue freeing.');
    return;
  }

  if (!name || typeof name !== 'string') {
    console.warn('⚠️ Room number not provided or invalid for scheduling.');
    return;
  }

  // ✅ Schedule job to emit free event
  schedule.scheduleJob(endTime, () => {
    console.log(`✅ Emitting venue free event for Room: ${name} at ${endTime.toISOString()}`);

    io.emit('venueStatusChanged', {
      name,
      newStatus: 'free',
    });
  });

  console.log(`📌 Venue freeing (notification only) scheduled at ${endTime.toISOString()} for Room: ${name}`);
}
