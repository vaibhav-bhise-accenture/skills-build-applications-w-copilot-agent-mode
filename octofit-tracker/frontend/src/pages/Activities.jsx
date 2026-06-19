import { useState, useEffect } from 'react';
import { getActivities, getUsers, createActivity, deleteActivity } from '../api/client';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [activitiesData, usersData] = await Promise.all([
        getActivities(),
        getUsers(),
      ]);
      setActivities(activitiesData);
      setUsers(usersData);
      if (usersData.length > 0) {
        setUserId(usersData[0]._id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!userId || !type || !duration) {
      alert('Please fill all fields');
      return;
    }

    try {
      await createActivity({
        userId,
        type,
        duration: parseInt(duration),
        date: new Date(),
      });
      setType('');
      setDuration('');
      loadData();
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Failed to create activity');
    }
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm('Delete this activity?')) {
      try {
        await deleteActivity(id);
        loadData();
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity');
      }
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Activity Tracking</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Log Activity</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddActivity}>
                <div className="mb-3">
                  <label className="form-label">User</label>
                  <select
                    className="form-select"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  >
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Activity Type</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Running, Cycling"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
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
                  Log Activity
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Recent Activities ({activities.length})</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Score</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity._id}>
                        <td>{activity.user?.name}</td>
                        <td>{activity.type}</td>
                        <td>{activity.duration} min</td>
                        <td>
                          <strong>{activity.score}</strong>
                        </td>
                        <td>{new Date(activity.date).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteActivity(activity._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
