import dbConnect from '../../../lib/db';
import User from '../../../models/user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, updatedHistory } = req.body;
    console.log(username,updatedHistory)

    try {
      await dbConnect(); 

      const user = await User.findOne({ username });

      if (user) {
        user.chatHistory = updatedHistory;
        await user.save();
        res.status(200).json({ message: 'Chat history updated successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating chat history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
