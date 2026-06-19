import express from 'express';
import { Workout } from '../models/Workout.js';

const router = express.Router();

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Create a new workout
router.post('/', async (req, res) => {
  try {
    const { title, description, type, difficulty, duration } = req.body;

    if (!title || !description || !type || !difficulty || !duration) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const workout = new Workout({
      title,
      description,
      type,
      difficulty,
      duration
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// Get workout by ID
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

// Get workouts by difficulty
router.get('/difficulty/:difficulty', async (req, res) => {
  try {
    const workouts = await Workout.find({ difficulty: req.params.difficulty });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Get workout suggestions (random)
router.get('/suggestions/random', async (req, res) => {
  try {
    const workouts = await Workout.find();
    const random = workouts[Math.floor(Math.random() * workouts.length)];
    res.json(random || { message: 'No workouts available' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Update workout
router.put('/:id', async (req, res) => {
  try {
    const { title, description, type, difficulty, duration } = req.body;
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { title, description, type, difficulty, duration },
      { new: true }
    );

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// Delete workout
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

export default router;
