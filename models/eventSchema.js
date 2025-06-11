/*import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
  title: {type: String,required: true},
  description:{type: String},
  collegeName:{type: String},
  venue:{
    roomNumber:String,
    location: String,
    capacity: Number,
  },
  EventDate:{type:Date},
  startTime:{type:String},
  endTime:{type: String},
  isRegistrationOpen:{type: Boolean,default: true},

}, { timestamps: true });
const createEventModel=mongoose.model('Event',eventSchema);
/*
 export default mongoose.model('event',eventSchema);

const Event = mongoose.model('Event', eventSchema);
export default createEventModel;*/

/*import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  collegeName: { type: String },
  venue: {
    roomNumber: String,
    location: String,
    capacity: Number,
  },
  EventDate: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  isRegistrationOpen: { type: Boolean, default: true },
}, { timestamps: true });

export default function createEventModel(connection) {
  return connection.model('Event', eventSchema);
}
*/

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  collegeName: String,
  venueDetails: {
    venueId: String,
    roomnumber: String,
    capacity: Number,
    location: String,
  },
  startTime: Date,
  endTime: Date,
  EventDate: Date
});

export default function createEventModel(db) {
  return db.models.Event || db.model('Event', eventSchema);
}

