import { useState, useEffect } from 'react';
import { getWorkouts, createWorkout, deleteWorkout } from '../api/client';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error('Error loading workouts:', error);
      alert('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    if (!title || !description || !type || !duration) {
      alert('Please fill all fields');
      return;
    }

    try {
      await createWorkout({
        title,
        description,
        type,
        difficulty,
        duration: parseInt(duration),
      });
      setTitle('');
      setDescription('');
      setType('');
      setDifficulty('easy');
      setDuration('');
      loadWorkouts();
    } catch (error) {
      console.error('Error creating workout:', error);
      alert('Failed to create workout');
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Delete this workout?')) {
      try {
        await deleteWorkout(id);
        loadWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Failed to delete workout');
      }
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">💪 Workout Suggestions</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Add New Workout</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddWorkout}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Cardio, Strength"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Difficulty</label>
                  <select
                    className="form-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Add Workout
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Available Workouts ({workouts.length})</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {workouts.map((workout) => (
                  <div key={workout._id} className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{workout.title}</h5>
                        <p className="card-text">{workout.description}</p>
                        <small className="text-muted">
                          <p className="mb-1">
                            Type: <strong>{workout.type}</strong>
                          </p>
                          <p className="mb-1">
                            Difficulty:{' '}
                            <span
                              className={`badge ${
                                workout.difficulty === 'easy'
                                  ? 'bg-success'
                                  : workout.difficulty === 'medium'
                                    ? 'bg-warning'
                                    : 'bg-danger'
                              }`}
                            >
                              {workout.difficulty}
                            </span>
                          </p>
                          <p>Duration: {workout.duration} min</p>
                        </small>
                      </div>
                      <div className="card-footer bg-light">
                        <button
                          className="btn btn-sm btn-danger w-100"
                          onClick={() => handleDeleteWorkout(workout._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {workouts.length === 0 && (
                <div className="alert alert-info">No workouts available yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
