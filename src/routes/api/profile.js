const express = require("express");
const axios = require("axios");
const router = express.Router();
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");

const Profile = require("../../models/profile");
const User = require("../../models/user");
const { findOne } = require("../../models/user");
const { default: Axios } = require("axios");

//  @route      GET api/profile
//  @desc       Get Current Users Profile
//  @access     Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).send({ msg: "There is no profile for this user" });
    }
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//  @route      POST api/profile
//  @desc       Create or update user profile
//  @access     Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile object
    const profileFields = {
      user: req.user.id,
      company,
      website:
        website && website !== ""
          ? normalize(website, { forceHttps: true })
          : "",
      location,
      bio,
      status,
      githubusername,
    };

    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    const socialFields = {
      youtube,
      facebook,
      instagram,
      twitter,
      linkedin,
    };

    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true });
    }

    profileFields.social = socialFields;

    try {
      //upsert creates a new doc if no match is found
      var profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        profileFields,
        { new: true, upsert: true }
      );

      res.send(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//  @route      GET api/profile
//  @desc       Get all profiles
//  @access     Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.send(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//  @route      GET api/profile/user/:user_id
//  @desc       Get profile by user ID
//  @access     Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    res.send(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).send({ msg: "Profile not found" });
    }
    res.status(500).send("Server error");
  }
});

//  @route      DELETE api/profile/user/:user_id
//  @desc       Delete profile, user & posts
//  @access     Private
router.delete("/", auth, async (req, res) => {
  try {
    // @todo - remove users posts

    //remove profile
    await Profile.findOneAndRemove({ user: req.user._id });

    await User.findOneAndRemove({ _id: req.user._id });

    res.send({ msg: "User deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//  @route      PUT api/profile/experience
//  @desc       Add profile experience
//  @access     Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const newExp = { ...req.body };

    try {
      const profile = await Profile.findOne({ user: req.user._id });
      profile.experience.unshift(newExp);

      await profile.save();
      res.send(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

//  @route      DELETE api/profile/experience/:exp_id
//  @desc       Delete experience from profile
//  @access     Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    const removeIndex = profile.experience
      .map((item) => item._id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.send(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

//  @route      PUT api/profile/education
//  @desc       Add profile education
//  @access     Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("fieldofstudy", "field of study is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const newEdu = { ...req.body };

    try {
      const profile = await Profile.findOne({ user: req.user._id });
      profile.education.unshift(newEdu);

      await profile.save();
      res.send(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

//  @route      DELETE api/profile/education/:exp_id
//  @desc       Delete education from profile
//  @access     Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    const removeIndex = profile.education
      .map((item) => item._id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.send(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

//  @route      GET api/profile/github/:username
//  @desc       Get user repos from Github
//  @access     Public
router.get("/github/:username", async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`
    );

    const headers = {
      "user-agent": "node.js",
    };

    const gitHubResponse = await Axios.get(uri, { headers });

    res.send(gitHubResponse.data);
  } catch (err) {
    console.log(err.message);
    res.status(404).send({ msg: "No Github profile found" });
  }
});
module.exports = router;
