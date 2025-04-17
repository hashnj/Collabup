import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const createToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

export const decodeToken = (token: string | undefined) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (err) {
    return null;
  }
};
