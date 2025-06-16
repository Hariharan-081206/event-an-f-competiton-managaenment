import createProfileModel from '../models/Profileschema.js';
import createEventModel from '../models/eventSchema.js';
import createEventParticipantModel from '../models/eventConfirmation.js';

export const confirmRegistration = async (req, res) => {
  const { eventId, profileId } = req.body;

  if (!eventId || !profileId) {
    return res.status(400).json({ error: 'eventId and profileId are required' });
  }

  try {
    const projectDb = req.app.locals.myProjectDb;

    // ✅ Get models with correct DB
    const Profile = createProfileModel(projectDb);
    const Event = createEventModel(projectDb);
    const EventParticipant = createEventParticipantModel(projectDb);

    const user = await Profile.findById(profileId);
    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'event not found' });
    }

    const participant = new EventParticipant({
      name: user.fullName,
      RegNo: user.RegNo,
      department: user.Dept,
      batch: user.batch,
      title: event.title,
      eventId: event._id,
      profileId: user._id
    });

    await participant.save();

    res.status(200).json({
      message: '✅ Participant added successfully to confirmation list',
      participant
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: '⚠️ User has already been added to this event'
      });
    }

    console.error('❌ Error confirming participation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
