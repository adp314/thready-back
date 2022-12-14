import express from "express";
import { generateToken } from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { UserModel } from "../model/user.model.js";

import bcrypt from "bcrypt";
import { ThreadModel } from "../model/thread.model.js";

const SALT_ROUNDS = 10;

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { passwordHash } = req.body;

    if (
      !passwordHash ||
      !passwordHash.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({
        msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
      });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(passwordHash, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    delete createdUser._doc.passwordHash;
    return res.status(201).json(createdUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Email ou senha invalidos." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
          profileImg: user.profileImg,
        },
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Email ou senha invalidos." });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.get("/profile", isAuth, attachCurrentUser, (req, res) => {
  const loggedInUser = req.currentUser;

  return res.status(200).json(loggedInUser);
});

userRouter.get("/search/:userName", async (req, res) => {
  try {
    const user = await UserModel.findOne({ userName: req.params.userName });
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

userRouter.put("/edit", isAuth, attachCurrentUser, async (req, res) => {
  try {
      const loggedInUser = req.currentUser;

      const updatedUser = await UserModel.findOneAndUpdate(
          { _id: loggedInUser._id },
          { ...req.body },
          { new: true, runValidators: true }
      )

      return res.status(200).json(updatedUser);
  }
  catch {
      console.log(err);
      return res.status(500).json(err);
  }
});

userRouter.delete("/delete", isAuth, attachCurrentUser, async (req, res) => {
  try {
      const loggedInUser = req.currentUser;

      await ThreadModel.deleteOne(
        { creator: loggedInUser._id },
    );

      const deleteUser = await UserModel.deleteOne({
          _id: loggedInUser._id,
        });

      return res.status(200).json(deleteUser);
  }
  catch (err) {
      console.log(err);
      return res.status(500).json(err);
  }
});

export { userRouter };
