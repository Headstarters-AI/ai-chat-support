import bcrypt from 'bcryptjs'; // Library for hashing passwords
import jwt from 'jsonwebtoken'; // Library for generating JWT tokens
import { connectToDatabase } from '../../../lib/db'; // Utility function to connect to MongoDB

export default async function register(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Return 405 if method is not POST
  }

  const { email, password } = req.body;
  const { db } = await connectToDatabase(); // Connect to the database

  // Check if the user already exists
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' }); // Return 409 if user exists
  }

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.collection('users').insertOne({
    email,
    password: hashedPassword,
  });

  // Generate a JWT token
  const token = jwt.sign({ userId: newUser.insertedId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.status(201).json({ token }); // Return the token to the client
}
