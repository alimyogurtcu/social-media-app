const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      if (req.body.password == "") {
        const { password, ...other } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: other,
        });
      } else {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
      }
      res.status(200).json("Account updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("This account not your!");
  }
});

//delete user
router.delete("/:id/:check", async (req, res) => {
  console.log(req.params)
  if (req.params.check) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("This account not your!");
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({
          username: username,
        });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get followers
router.get("/friend/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const followers = await Promise.all(
      user.followings.map((followerId) => {
        return User.findById(followerId);
      })
    );
    let followerList = [];
    followers.map((follower) => {
      const { _id, username, profilePicture } = follower;
      followerList.push({ _id, username, profilePicture });
    });
    res.status(200).json(followerList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        res.status(200).json("User has been follow");
      } else {
        res.status(403).json("You allready follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

//unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        res.status(200).json("User has been unfollow");
      } else {
        res.status(403).json("You allready unfollow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
