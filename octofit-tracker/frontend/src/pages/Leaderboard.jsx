import { useState, useEffect } from 'react';
import { getLeaderboard } from '../api/client';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      alert('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">🏆 Leaderboard</h1>

      <div className="card">
        <div className="card-body">
          {leaderboard.length === 0 ? (
            <div className="alert alert-info">No users on leaderboard yet</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry._id}>
                      <td>
                        <strong className="fs-5">#{index + 1}</strong>
                      </td>
                      <td>
                        <strong>{entry.user?.name}</strong>
                      </td>
                      <td>{entry.user?.email}</td>
                      <td>
                        <span className="badge bg-success fs-6">
                          {entry.totalScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={loadLeaderboard}>
          Refresh
        </button>
      </div>
    </div>
  );
}
