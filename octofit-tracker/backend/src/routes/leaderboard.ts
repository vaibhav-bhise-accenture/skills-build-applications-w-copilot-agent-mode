import express from 'express';
import { Leaderboard } from '../models/Leaderboard.js';

const router = express.Router();

// Get leaderboard (all users ranked by score)
router.get('/', async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .sort({ totalScore: -1 })
      .populate('user', 'name email');

    // Update ranks
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user rank
router.get('/user/:userId', async (req, res) => {
  try {
    const userEntry = await Leaderboard.findOne({ user: req.params.userId }).populate('user', 'name email');

    if (!userEntry) {
      res.status(404).json({ error: 'User not found in leaderboard' });
      return;
    }

    const allUsers = await Leaderboard.find().sort({ totalScore: -1 });
    const rank = allUsers.findIndex((entry) => entry.user.toString() === req.params.userId) + 1;

    res.json({ ...userEntry.toObject(), rank });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
});

export default router;
