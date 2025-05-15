import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  userName:{type:String, required:true,unique:true},
  email:{type:String, required:true},
  password:{type:String, required:true},
  provider: { type: String, default: "credentials" },
  date:{type:Date, default:Date.now}
});

const User = models.User || model('User', UserSchema);
export default User;