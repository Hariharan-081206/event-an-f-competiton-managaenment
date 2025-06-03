import mongoose from 'mongoose';
const Competitionschema=new mongoose.Schema({
    Competitionname:{type:String,required:true,trim:true},
    Organizationname:{type:String,required:true,trim:true},
    Description:{type:String,required:true,trim:true},
    Rules:{type:String,required:true,trim:true},
    Status:{
        type:String,
        enum:['Upcoming','ongoing','completed','cancelled'],
        default:'upcoming'
    },  
    RegistrationLink:{
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
    ConfirmationLink:{
        type:String,
        required:true,
        trim:true,
        validate:{
            validator:function(v){
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
            },
            message:props => `${props.value} is not valid URL!`
        }
    },
},{timestamps:true});
export default mongoose.model('Competitions', Competitionschema);