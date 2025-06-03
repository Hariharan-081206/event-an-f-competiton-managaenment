import mongoose from 'mongoose';
const Competitionschema=new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    Organizer:{type:String,required:true,trim:true},
    mode:{type:String,
        enum: ['online', 'offline', 'hybrid'],
        required:true,trim:true},
    Rules:{type:String,
        required:true,
        trim:true},
    location: {type: String,
              trim: true},

    daysLeft: {
        type: Date,
        required: true,
        trim: true
    },
  
    link:{
        type:String,
        required:true,
        trim: true,
        validate: {
            validator: function(v) {
                 return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
},{timestamps:true});
export default mongoose.model('Competitions', Competitionschema);