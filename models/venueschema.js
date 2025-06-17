/*import mongoose from 'mongoose';

export default function createVenueModel(connection) {
  const venueSchema = new mongoose.Schema({
    roomNumber: String,
    capacity: Number,
    location: String,
    status: {
      type: String,
      enum: ['free', 'occupied', 'maintenance'],
      default: 'free',
    },
  });
  return connection.model('Venue', venueSchema);
}*/

import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  name: String,
  type:String,
  capacity: Number,
  location: String,
  status: {
  type: String,
  required: true,
  default: 'free',
},

});

export default function createClassroomModel(db) {
  // Check if model is already compiled in the connection
  return db.models.classroom || db.model('classroom', venueSchema);
}

