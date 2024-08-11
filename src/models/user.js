import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  title: String,
  chat: [
    {
      role: String,
      content: String,
    }
  ]
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  chatHistory: [ChatSchema],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
