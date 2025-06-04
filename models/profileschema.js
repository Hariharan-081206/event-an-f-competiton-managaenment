import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  fullName:{type: String,required: true},
  Dept:{type: String,required: true},
  RegNo:{type:String,unique:true},
  batch:{type: String,required:true},
  email:{type:String,required:true},
  Gender:{type:String},
  domain:{type:String},
  //college:{type: String},
  // if wanted profilePicture:{type: String},
  bio:{type: String},
  // Competition stats (for user role)
  competitionStats:{
    //registered:{type: Number,default: 0},
    attended:{type: Number,default: 0},
   // reachedFirstRound:{type: Number,default: 0},
    //nooffinalroundselected:{type:Number,default:0},
    won:{type: Number,default: 0}}
},{ timestamps: true });

export default mongoose.model('Profile', profileSchema);

