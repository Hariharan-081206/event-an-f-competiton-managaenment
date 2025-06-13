import createProfileModel from '../models/Profileschema.js';
import createCompetitionModel from '../models/competitions.js';
import createCompetitionParticipantModel from '../models/competitionConfirmation.js';

export const confirmRegistration = async (req, res) => {
  const { competitionId, profileId } = req.body;

  if (!competitionId || !profileId) {
    return res.status(400).json({ error: 'competitionId and profileId are required' });
  }

  try {
    const projectDb = req.app.locals.myProjectDb;

    // ✅ Get models with correct DB
    const Profile = createProfileModel(projectDb);
    const Competition = createCompetitionModel(projectDb);
    const CompetitionParticipant = createCompetitionParticipantModel(projectDb);

    const user = await Profile.findById(profileId);
    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const competition = await Competition.findById(competitionId);
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    const participant = new CompetitionParticipant({
      name: user.fullName,
      RegNo: user.RegNo,
      department: user.Dept,
      batch: user.batch,
      email: user.email,
      competitionTitle: competition.Competitionname,
      competitionId: competition._id,
      profileId: user._id,
      professorUpdated: true
    });

    await participant.save();

    res.status(200).json({
      message: '✅ Participant added successfully to confirmation list',
      participant
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: '⚠️ User has already been added to this competition'
      });
    }

    console.error('❌ Error confirming participation:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
