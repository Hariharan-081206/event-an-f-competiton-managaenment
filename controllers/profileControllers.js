import mongoose from 'mongoose';
// POST /profile/create
import createProfileModel from '../models/Profileschema.js';

export const createProfile = async (req, res) => {
  try {
    const projectDb = req.app.locals.myProjectDb;
    const Profile = createProfileModel(projectDb); // ✅ Use the right DB

    const { fullName, RegNo, email, Dept, batch, Gender, domain, bio } = req.body;

    const newProfile = new Profile({ fullName, RegNo, email, Dept, batch, Gender, domain, bio });
    const savedProfile = await newProfile.save();

    res.status(201).json({
      message: 'Profile created successfully',
      profile: savedProfile,
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Server error while creating profile' });
  }
};

// PUT /profile/update/:id
export const updateProfileById = async (req, res) => {
  try {
    const projectDb = req.app.locals.myProjectDb;
    const Profile = createProfileModel(projectDb); // ✅ Correct DB

    const { id } = req.params;
    const updateData = req.body; // 👈 Accept fields like fullName, bio, etc.

    const updatedProfile = await Profile.findByIdAndUpdate(id, updateData, {
      new: true,        // Return the updated document
      runValidators: true, // Enforce schema validation
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const projectDb = req.app.locals.myProjectDb;
    const Profile = createProfileModel(projectDb); // ✅ Fix: now Profile is defined

    const { id } = req.params;

    const profile = await Profile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};