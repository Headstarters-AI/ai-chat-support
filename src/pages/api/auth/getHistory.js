import dbConnect from '../../../lib/db';
import User from '../../../models/user';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username } = req.query; // Extracting the username from query parameters

    try {
      await dbConnect(); // Ensure database connection

      const user = await User.findOne({ username }); // Find the user by username

      if (user) {
        res.status(200).json({ history: user.chatHistory }); // Return the chat history if the user is found
      } else {
        res.status(404).json({ error: 'User not found' }); // Handle the case where the user is not found
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // Handle any other errors
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Handle unsupported HTTP methods
  }
}
