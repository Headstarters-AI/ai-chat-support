import bcrypt from 'bcryptjs'; // Library for comparing passwords
import jwt from 'jsonwebtoken'; // Library for generating JWT tokens
import { connectToDatabase } from '../../../lib/db'; // Utility function to connect to MongoDB

export default async function login(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Return 405 if method is not POST
  }

  const { email, password } = req.body;
  const { db } = await connectToDatabase(); // Connect to the database

  // Find the user in the database
  const user = await db.collection('users').findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' }); // Return 401 if credentials are invalid
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({ token }); // Return the token to the client
}
