import createEventModel from '../models/eventSchema.js';
import createClassroomModel from '../models/venueschema.js';
import { scheduleVenueFreeingJob } from '../utils/scheduleJobs.js';

// 📌 Get venues from venueDB (MONGO_URI2)
export async function listVenues(req, res) {
  const venueDb = req.app.locals.venueDb;
  const Venue = createClassroomModel(venueDb);

  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
export async function bookVenue(req, res) {
  const { eventId, name, startTime, endTime } = req.body;

  const venueDb = req.app.locals.venueDb;
  const myProjectDb = req.app.locals.myProjectDb;

  const Venue = createClassroomModel(venueDb);
  const Event = createEventModel(myProjectDb);

  const io = req.io; // ✅ ACCESS io from middleware

  // ✅ Basic validation
  if (!eventId || !name || !startTime || !endTime) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    // 🔄 Instead of venueId, find by name
  const normalizedRoom = name.trim();
  const venue = await Venue.findOne({
  name: new RegExp(`^${normalizedRoom}$`, 'i') 
});

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // ✅ Check for overlapping booking in events
    const conflictingBooking = await Event.findOne({
  'venueDetails.name': name,
  $or: [
    { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
  ],
});

if (conflictingBooking) {
  return res.status(400).json({ message: 'Venue already booked for the selected time slot' });
}

    // ✅ Emit temporary occupied status
    io.emit('venueStatusChanged', {
      name: venue.name.toString(),
      newStatus: 'occupied',
    });

    // ✅ Update event with booking details
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        venueDetails: {
          venueId: venue._id.toString(),
          name: venue.name,
          capacity: venue.capacity,
          location: venue.location,
        },
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      { new: true }
    );

    if (!updatedEvent) {
      // Revert emitted status
      io.emit('venueStatusChanged', {
        venueId: venue.name.toString(),
        newStatus: 'free',
      });
      return res.status(404).json({ message: 'Event not found' });
    }

    // ✅ Schedule job to emit venue availability later
    scheduleVenueFreeingJob(updatedEvent.endTime, venue.name, io);

    res.json({
      message: 'Venue booked and event updated successfully',
      event: updatedEvent,
      venue,
    });

  } catch (error) {
    console.error('Error booking venue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
