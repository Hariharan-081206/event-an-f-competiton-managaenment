import createtemplateModel from '../models/templateschema.js';
import createClassroomModel from '../models/venueschema.js';
import createEventModel from '../models/eventSchema.js';
import { scheduleVenueFreeingJob } from '../utils/scheduleJobs.js';
export async function createTemplate(req, res) {
  const { title, description, collegeName, EventDate, StartTime, endTime, name} = req.body;

  const myProjectDb = req.app.locals.myProjectDb;
  const venueDb = req.app.locals.venueDb;

  const Template = createtemplateModel(myProjectDb);
  const Venue = createClassroomModel(venueDb);

  if (!title || !description || !collegeName || !EventDate || !StartTime || !endTime || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (new Date(StartTime) >= new Date(endTime)) {
    return res.status(400).json({ message: 'Start time must be before end time' });
  }

  try {
    const normalizedRoom = name.trim();
    const venue = await Venue.findOne({
  name: new RegExp(`^${normalizedRoom}$`, 'i') // 'i' = case-insensitive
});

    if (!venue) {
      return res.status(400).json({ message: 'Room not found in venue database' });
    }

    const conflict = await Template.findOne({
  'venueDetails.name': venue.name, // ✅ Match on roomnumber
  $or: [
    {
      StartTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(StartTime) },
    },
  ],
});

if (conflict) {
  return res.status(400).json({ message: 'Room already reserved during selected time' });
}


    // ✅ Create template
    const newTemplate = new Template({
      title,
      description,
      collegeName,
      EventDate: new Date(EventDate),
      StartTime: new Date(StartTime),
      endTime: new Date(endTime),
      venueDetails: {
        venueId: venue._id.toString(),
        name: venue.name,
        location: venue.location,
      },
    });

    const savedTemplate = await newTemplate.save();
    console.log('✅ Emitting venueStatusChanged for:', venue.name);
    req.io.emit('venueStatusChanged', {
      venueId: venue.name.toString(),
      status: 'occupied',
    });

    scheduleVenueFreeingJob(savedTemplate.endTime, venue.name, req.io);

    res.status(201).json({
      message: '✅ Template created successfully',
      template: savedTemplate,
    });

  } catch (error) {
    console.error('❌ Error creating template:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


export async function getAllTemplates(req, res) {
  const myProjectDb = req.app.locals.myProjectDb;
  const Template = createtemplateModel(myProjectDb);

  try {
    const templates = await Template.find().sort({ EventDate: 1, StartTime: 1 }); // optional: sort by date/time
    res.status(200).json(templates);
  } catch (error) {
    console.error('❌ Error fetching templates:', error);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
}


export async function deleteTemplate(req, res) {
  const { id } = req.params;

  const myProjectDb = req.app.locals.myProjectDb;
  const Template = createtemplateModel(myProjectDb);

  try {
    const deletedTemplate = await Template.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Optional: Notify clients that a template was deleted
    req.io.emit('templateDeleted', { id });

    res.status(200).json({
      message: '✅ Template deleted successfully',
      deletedTemplate,
    });
  } catch (error) {
    console.error('❌ Error deleting template:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function updateTemplate(req, res) {
  const { id } = req.params;
  const {
    title,
    description,
    collegeName,
    EventDate,
    StartTime,
    endTime,
    name
  } = req.body;

  const myProjectDb = req.app.locals.myProjectDb;
  const venueDb = req.app.locals.venueDb;

  const Template = createtemplateModel(myProjectDb);
  const Venue = createClassroomModel(venueDb);

  try {
    const existingTemplate = await Template.findById(id);
    if (!existingTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Prepare updated fields (preserve old ones if not provided)
    const updatedFields = {
      title: title ?? existingTemplate.title,
      description: description ?? existingTemplate.description,
      collegeName: collegeName ?? existingTemplate.collegeName,
      EventDate: EventDate ? new Date(EventDate) : existingTemplate.EventDate,
      StartTime: StartTime ? new Date(StartTime) : existingTemplate.StartTime,
      endTime: endTime ? new Date(endTime) : existingTemplate.endTime,
    };

    // Ensure time is valid
    if (updatedFields.StartTime >= updatedFields.endTime) {
      return res.status(400).json({ message: 'Start time must be before end time' });
    }

    let venueToUse = existingTemplate.venueDetails;

    // If name is being changed
    if (name && name !== existingTemplate.venueDetails.name) {
      const normalizedRoom = name.trim().toLowerCase();
      const venue = await Venue.findOne({name: normalizedRoom });

      if (!venue) {
        return res.status(400).json({ message: 'Room not found in venue database' });
      }

      // Check conflict with other templates (excluding current one)
      const conflict = await Template.findOne({
        _id: { $ne: id },
        'venueDetails.name': normalizedRoom,
        $or: [
          {
            StartTime: { $lt: updatedFields.endTime },
            endTime: { $gt: updatedFields.StartTime },
          },
        ],
      });

      if (conflict) {
        return res.status(400).json({ message: 'Room is already booked during the selected time' });
      }

      // Update venue details
      venueToUse = {
        venueId: venue._id.toString(),
        name: venue.name,
        location: venue.location,
      };
    }

    // Perform the update
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      {
        ...updatedFields,
        venueDetails: venueToUse,
      },
      { new: true }
    );

    // Notify and reschedule
    req.io.emit('templateUpdated', { id, updatedTemplate });
    scheduleVenueFreeingJob(updatedTemplate.endTime, venueToUse.name, req.io);

    res.status(200).json({
      message: '✅ Template updated successfully',
      template: updatedTemplate,
    });

  } catch (error) {
    console.error('❌ Error editing template:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function postTemplateToUsers(req, res) {
  const { id } = req.params;

  const myProjectDb = req.app.locals.myProjectDb;
  const Event = createEventModel(myProjectDb);
  const Template = createtemplateModel(myProjectDb);

  try {
    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const { title, description, collegeName, StartTime, endTime, venueDetails } = template;

    // ✅ Final time conflict check
    const conflictingEvent = await Event.findOne({
      'venueDetails.venueId': venueDetails.venueId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: StartTime },
        },
      ],
    });

    if (conflictingEvent) {
      return res.status(400).json({ message: 'Venue already booked for the selected time range' });
    }

    // ✅ Create Event
    const newEvent = new Event({
      title,
      description: description,
      collegeName,
      startTime: StartTime,
      endTime: endTime,
      venueDetails,
    });

    const savedEvent = await newEvent.save();

    // ✅ Emit socket to update clients
    req.io.emit('venueStatusChanged', {
      venueId: venueDetails.name,
      status: 'occupied',
    });

    // ✅ Schedule venue auto-freeing
    scheduleVenueFreeingJob(savedEvent.endTime, venueDetails.name, req.io);

    res.status(201).json({
      message: '✅ Template successfully posted as event',
      event: savedEvent,
    });
  } catch (error) {
    console.error('❌ Error posting template to event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

