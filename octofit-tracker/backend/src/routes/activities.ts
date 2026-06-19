import express from 'express';
import { Activity } from '../models/Activity.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { User } from '../models/User.js';

const router = express.Router();

// Get all activities
router.get('/', async (req, res) => {
  try {
    const activities = await Activity.find().populate('user', 'name email');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Create a new activity
router.post('/', async (req, res) => {
  try {
    const { userId, type, duration, date } = req.body;

    if (!userId || !type || !duration) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Calculate score: 1 point per minute
    const score = duration;

    const activity = new Activity({
      user: userId,
      type,
      duration,
      date: date || new Date(),
      score
    });

    await activity.save();

    // Update leaderboard
    const leaderboard = await Leaderboard.findOne({ user: userId });
    if (leaderboard) {
      leaderboard.totalScore += score;
      await leaderboard.save();
    }

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Get activities by user
router.get('/user/:userId', async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.params.userId }).populate('user', 'name email');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get activity by ID
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('user', 'name email');
    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Update activity
router.put('/:id', async (req, res) => {
  try {
    const { type, duration, date } = req.body;
    const oldActivity = await Activity.findById(req.params.id);
    
    if (!oldActivity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    const newScore = duration;
    const scoreDifference = newScore - oldActivity.score;

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { type, duration, date, score: newScore },
      { new: true }
    ).populate('user', 'name email');

    // Update leaderboard
    if (scoreDifference !== 0) {
      await Leaderboard.updateOne(
        { user: oldActivity.user },
        { $inc: { totalScore: scoreDifference } }
      );
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// Delete activity
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    // Update leaderboard
    await Leaderboard.updateOne(
      { user: activity.user },
      { $inc: { totalScore: -activity.score } }
    );

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;
