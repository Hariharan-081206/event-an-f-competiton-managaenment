// COMBINING TWO DATABASES

/*
import createEventModel from '../models/eventSchema.js';
import createVenueModel from '../models/venueschema.js';

// 📌 Create an event (venue is NOT booked yet, only event details are saved)
export async function createEvent(req, res) {
  const { title, description, collegeName, startTime, endTime } = req.body;
  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);

  try {
    const newEvent = new Event({
      title,
      description,
      collegeName,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// 📌 Get all events
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

// 📌 Get event by ID
export async function getEventById(req, res) {
  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// 📌 Update event by ID
export async function updateEvent(req, res) {
  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);
  const { title, description, collegeName, startTime, endTime } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        collegeName,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// 📌 Delete event by ID
export async function deleteEvent(req, res) {
  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);

  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}*/


// FOR SINGLE DATABASE

import Event from '../models/eventSchema.js'; // direct import, no multi-db logic

/**
 * 📌 Create a new event
 */
export async function createEvent(req, res) {
  const { title, description, collegeName, venue, EventDate, startTime, endTime } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      collegeName,
      venue, // embedded directly in event
      EventDate: new Date(EventDate),
      startTime,
      endTime,
    });

    const savedEvent = await newEvent.save();
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
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * 📌 Get an event by ID
 */
export async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * 📌 Update an event by ID (Partial Update Support)
 */
export async function updateEvent(req, res) {
  try {
    // If EventDate is present, convert to Date
    if (req.body.EventDate) {
      req.body.EventDate = new Date(req.body.EventDate);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // only update provided fields
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


/**
 * 📌 Delete an event by ID
 */
export async function deleteEvent(req, res) {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
