import jwt from "jsonwebtoken";

//use user id to generate token
const generateToken = (id, name, email, role, photo) => {
  // token must be returned to the client
  return jwt.sign({ id, name, email, role, photo }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
