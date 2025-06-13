// models/CompetitionSchema.js
import mongoose from 'mongoose';

const CompetitionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  organiser: { type: String, required: true, trim: true },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    required: true,
    trim: true
  },
  // Rules: {
  //   type: String,
  //   trim: true
  // },
  location: {
    type: String,
    trim: true
  },
  prize: {
    type: String,
    required: true,
    trim: true
  },
  daysLeft: {
    type: Date,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }
}, { timestamps: true });

// ✅ Factory function for correct DB binding
export default function createCompetitionModel(db) {
  return db.models.Competition || db.model('Competition', CompetitionSchema);
}
