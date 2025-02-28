const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send(user).status(201);
  } catch (e) {
    res.send(e).status(500);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateToken();

    res.send({ user, token }).status(200);
  } catch (e) {
    res.send().status(400);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();

    res.send().status(200);
  } catch (e) {
    res.send().status(500);
  }
});

router.post("/users/allLogout", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send().status(200);
  } catch (e) {
    res.send().status(500);
  }
});

router.get("/users/me", auth, async (req, res) => {
  const user = req.user;

  res.send(user).status(200);
});

router.patch("/users/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const updatesFileds = ["name", "email", "password", "age"];
    const isValidOperations = updates.every((update) =>
      updatesFileds.includes(update)
    );

    if (!isValidOperations) {
      return res.send({ error: "Invalid operations!" }).status(400);
    }

    const user = req.user;

    updates.forEach((update) => (user[update] = req.body[update]));
    const updatedUser = await user.save();

    res.send(updatedUser);
  } catch (e) {
    res.send().status(400);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user).status(200);
  } catch (e) {
    res.send().status(500);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

router.post(
  "/users/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .png()
        .resize({ width: 250, height: 250 })
        .toBuffer();

      req.user.avatar = buffer;
      await req.user.save();
      res.status(200).send({ message: "Avatar uploaded successfully!" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send("avatar removed");
  } catch (error) {
    //
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new error();
    }

    res.set("Content-Type", "image/png");
    res.status(200).send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
