export default function Home() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body text-center">
              <h1 className="display-4 mb-4">🐙 OctoFit Tracker</h1>
              <p className="lead mb-4">
                Track your fitness activities, compete with your team, and stay motivated!
              </p>
              <div className="alert alert-info">
                <h5>Welcome to OctoFit Tracker</h5>
                <p>Use the navigation above to:</p>
                <ul className="text-start">
                  <li>Manage <strong>Users</strong> (students and gym teachers)</li>
                  <li>Log your <strong>Activities</strong> (workouts)</li>
                  <li>Create and manage <strong>Teams</strong></li>
                  <li>Check the <strong>Leaderboard</strong> rankings</li>
                  <li>Get <strong>Workout Suggestions</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
