import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method === "POST") {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Invalid token" });
        }
        res.status(200).json(user);
      });
    } else {
      res.status(401).json({ error: "Authorization header missing" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
