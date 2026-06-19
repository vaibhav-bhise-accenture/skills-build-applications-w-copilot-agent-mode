import express from 'express';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';

const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('creator', 'name email')
      .populate('members', 'name email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Create a new team
router.post('/', async (req, res) => {
  try {
    const { name, description, creatorId } = req.body;

    if (!name || !description || !creatorId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const creator = await User.findById(creatorId);
    if (!creator) {
      res.status(404).json({ error: 'Creator not found' });
      return;
    }

    const team = new Team({
      name,
      description,
      creator: creatorId,
      members: [creatorId]
    });

    await team.save();
    await User.findByIdAndUpdate(creatorId, { team: team._id });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('members', 'name email');
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Add member to team
router.post('/:id/members', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!team.members.includes(user._id)) {
      team.members.push(user._id);
      await team.save();
      await User.findByIdAndUpdate(userId, { team: team._id });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Remove member from team
router.delete('/:id/members/:userId', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    team.members = team.members.filter((id) => id.toString() !== req.params.userId);
    await team.save();
    await User.findByIdAndUpdate(req.params.userId, { team: null });

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    )
      .populate('creator', 'name email')
      .populate('members', 'name email');

    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    // Remove team reference from all members
    await User.updateMany({ team: team._id }, { team: null });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

export default router;
