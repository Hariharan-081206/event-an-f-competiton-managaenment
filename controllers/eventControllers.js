// COMBINING TWO DATABASES
import mongoose from 'mongoose';
import createEventModel from '../models/eventSchema.js';
import createClassroomModel from '../models/venueschema.js';
import { scheduleVenueFreeingJob } from '../utils/scheduleJobs.js';
export async function createEvent(req, res) {
  const { title, description, collegeName, startTime, endTime, name} = req.body;

  const myProjectDb = req.app.locals.myProjectDb;
  const venueDb = req.app.locals.venueDb;

  const Event = createEventModel(myProjectDb);
  const Venue = createClassroomModel(venueDb);

  // ✅ Basic validation
  if (!title || !description || !collegeName || !startTime || !endTime || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({ message: 'Start time must be before end time' });
  }

  try {
    const normalizedRoom = name.trim();
    const venue = await Venue.findOne({
  name: new RegExp(`^${normalizedRoom}$`, 'i') // 'i' = case-insensitive
});

    if (!venue) {
      return res.status(400).json({ message: 'Venue not found' });
    }

    // ✅ Check for conflicting events using start/end time
    const conflictingEvent = await Event.findOne({
      'venueDetails.venueId': venue._id,
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) },
        },
      ],
    });

    if (conflictingEvent) {
      return res.status(400).json({ message: 'Venue already booked for the selected time range' });
    }


    // ✅ Create new event
    const newEvent = new Event({
      title,
      description,
      collegeName,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      venueDetails: {
        venueId: venue._id.toString(),
        name: venue.name,
        capacity: venue.capacity,
        location: venue.location,
      },
    });

    const savedEvent = await newEvent.save();

    // ✅ Optional: Notify clients via socket
    req.io.emit('venueStatusChanged', {
      venueId: venue.name.toString(),
      status: 'occupied',
    });

    // ✅ Optional: Schedule venue auto-freeing (no longer needed if status is removed, but still usable)
    scheduleVenueFreeingJob(savedEvent.endTime, venue.name, req.io);

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}





/**
 * 📌 Get all events
 */
export async function getAllEvents(req, res) {
  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);

  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * 📌 Get event by ID
 */
export async function getEventById(req, res) {
  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * 📌 Update event by ID (only specific fields)
 */
export async function updateEvent(req, res) {
  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);
  const { title, description, collegeName, startTime, endTime } = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  const updateFields = {};
  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (collegeName) updateFields.collegeName = collegeName;
  if (startTime) updateFields.startTime = new Date(startTime);
  if (endTime) updateFields.endTime = new Date(endTime);

  if (updateFields.startTime && updateFields.endTime && updateFields.startTime >= updateFields.endTime) {
    return res.status(400).json({ message: 'Start time must be before end time' });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * 📌 Delete event by ID
 */
export async function deleteEvent(req, res) {
  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid event ID' });
  }

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });

    // ✅ Free venue if it exists
    if (deletedEvent?.venueDetails?.venueId) {
      const Venue = createClassroomModel(req.app.locals.venueDb);
      await Venue.findByIdAndUpdate(deletedEvent.venueDetails.venueId, { status: 'free' });

      req.io.emit('venueStatusChanged', {
        venueId: deletedEvent.venueDetails.venueId,
        status: 'free',
      });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



