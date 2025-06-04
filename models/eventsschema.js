import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
  title: {type: String,required: true},
  description:{type: String},
  collegeName:{type: String},
  venue:{
    roomNumber:String,
    location: String,
    capacity: Number,
  },
  startDateTime:{type: Date},
  endDateTime:{type: Date},
  isRegistrationOpen:{type: Boolean,default: true},

}, { timestamps: true });

 export default mongoose.model('Event', eventSchema);

