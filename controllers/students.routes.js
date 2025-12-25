const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Mailbox = require("../models/Mailbox");


router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.owner) {
      filter.owner = { $regex: req.query.owner, $options: "i" };
    }

    if (req.query.size) {
      filter.size = req.query.size;
    }

    const mailboxes = await Mailbox.find(filter)
      .select("-__v")
      .lean();

    res.json(mailboxes);
  } catch (err) {
    console.error("GET /mailboxes error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid mailbox id" });
    }

    const mailbox = await Mailbox.findById(id)
      .select("-__v")
      .lean();

    if (!mailbox) {
      return res.status(404).json({ error: "Mailbox not found" });
    }

    res.json(mailbox);
  } catch (err) {
    console.error("GET /mailboxes/:id error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { owner, size } = req.body;

    const mailbox = new Mailbox({ owner, size });
    await mailbox.save();

    res.status(201).json(mailbox);
  } catch (err) {
    console.error("POST /mailboxes error", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors,
      });
    }

    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router