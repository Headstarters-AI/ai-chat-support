import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    // Here you would typically create a new user in your database
    // For this example, we'll just create a token for any valid email
    if (email && password) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token, user: { email } });
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
