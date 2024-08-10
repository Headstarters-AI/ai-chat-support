// src/pages/api/login.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/db';
import User from '../../../models/user';

const JWT_SECRET = '123456'

export default async function handler(req, res) {
  await dbConnect();

  const { username, password } = req.body;

  // Find user by username
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create a JWT token
  const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ token });
}
