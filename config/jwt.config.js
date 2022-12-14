import jwt from "jsonwebtoken";

export function generateToken(user) {
  const { _id, name, email, role, profileImg } = user;

  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "12h";

  return jwt.sign({ _id, name, email, role, profileImg }, signature, {
    expiresIn: expiration,
  });
}
