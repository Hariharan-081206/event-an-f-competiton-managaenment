import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  fullName: String,
  RegNo: String,
  email: String,
  Dept: String,
  batch: String,
  Gender: String,
  domain: String,
  bio: String,
});

export default function createProfileModel(db) {
  return db.models.Profile || db.model('Profile', profileSchema);
}

