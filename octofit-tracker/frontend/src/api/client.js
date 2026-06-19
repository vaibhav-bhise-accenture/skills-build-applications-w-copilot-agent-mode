const API_BASE_URL = 'http://localhost:8000/api';

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

// User API
export const getUsers = () => apiCall('/users');
export const createUser = (user) => apiCall('/users', 'POST', user);
export const getUser = (id) => apiCall(`/users/${id}`);
export const updateUser = (id, user) => apiCall(`/users/${id}`, 'PUT', user);
export const deleteUser = (id) => apiCall(`/users/${id}`, 'DELETE');

// Activity API
export const getActivities = () => apiCall('/activities');
export const createActivity = (activity) => apiCall('/activities', 'POST', activity);
export const getUserActivities = (userId) => apiCall(`/activities/user/${userId}`);
export const getActivity = (id) => apiCall(`/activities/${id}`);
export const updateActivity = (id, activity) => apiCall(`/activities/${id}`, 'PUT', activity);
export const deleteActivity = (id) => apiCall(`/activities/${id}`, 'DELETE');

// Team API
export const getTeams = () => apiCall('/teams');
export const createTeam = (team) => apiCall('/teams', 'POST', team);
export const getTeam = (id) => apiCall(`/teams/${id}`);
export const addTeamMember = (teamId, userId) => apiCall(`/teams/${teamId}/members`, 'POST', { userId });
export const removeTeamMember = (teamId, userId) => apiCall(`/teams/${teamId}/members/${userId}`, 'DELETE');
export const updateTeam = (id, team) => apiCall(`/teams/${id}`, 'PUT', team);
export const deleteTeam = (id) => apiCall(`/teams/${id}`, 'DELETE');

// Leaderboard API
export const getLeaderboard = () => apiCall('/leaderboard');
export const getUserRank = (userId) => apiCall(`/leaderboard/user/${userId}`);

// Workout API
export const getWorkouts = () => apiCall('/workouts');
export const createWorkout = (workout) => apiCall('/workouts', 'POST', workout);
export const getWorkout = (id) => apiCall(`/workouts/${id}`);
export const updateWorkout = (id, workout) => apiCall(`/workouts/${id}`, 'PUT', workout);
export const deleteWorkout = (id) => apiCall(`/workouts/${id}`, 'DELETE');
