import { useState, useEffect } from 'react';
import { getTeams, getUsers, createTeam, deleteTeam, addTeamMember } from '../api/client';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [memberToAdd, setMemberToAdd] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, usersData] = await Promise.all([
        getTeams(),
        getUsers(),
      ]);
      setTeams(teamsData);
      setUsers(usersData);
      if (usersData.length > 0) {
        setCreatorId(usersData[0]._id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!name || !description || !creatorId) {
      alert('Please fill all fields');
      return;
    }

    try {
      await createTeam({ name, description, creatorId });
      setName('');
      setDescription('');
      loadData();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    }
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm('Delete this team?')) {
      try {
        await deleteTeam(id);
        setSelectedTeam(null);
        loadData();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team');
      }
    }
  };

  const handleAddMember = async (teamId) => {
    if (!memberToAdd) {
      alert('Please select a member');
      return;
    }

    try {
      await addTeamMember(teamId, memberToAdd);
      setMemberToAdd('');
      loadData();
      setSelectedTeam(null);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading...</p></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Team Management</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Create Team</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateTeam}>
                <div className="mb-3">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <label className="form-label">Creator</label>
                  <select
                    className="form-select"
                    value={creatorId}
                    onChange={(e) => setCreatorId(e.target.value)}
                  >
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Create Team
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Teams ({teams.length})</h5>
            </div>
            <div className="card-body">
              <div className="list-group">
                {teams.map((team) => (
                  <div key={team._id} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{team.name}</h5>
                        <p className="mb-1 text-muted">{team.description}</p>
                        <small>
                          Creator: <strong>{team.creator?.name}</strong> | Members:{' '}
                          <strong>{team.members?.length || 0}</strong>
                        </small>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => setSelectedTeam(team)}
                        >
                          Manage
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteTeam(team._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {selectedTeam?._id === team._id && (
                      <div className="mt-3 p-3 bg-light rounded">
                        <h6 className="mb-2">Members</h6>
                        <ul className="mb-2">
                          {team.members?.map((member) => (
                            <li key={member._id}>{member.name}</li>
                          ))}
                        </ul>
                        <div className="input-group input-group-sm">
                          <select
                            className="form-select"
                            value={memberToAdd}
                            onChange={(e) => setMemberToAdd(e.target.value)}
                          >
                            <option value="">Select user to add...</option>
                            {users.map((user) => {
                              const isMember = team.members?.some((m) => m._id === user._id);
                              if (!isMember) {
                                return (
                                  <option key={user._id} value={user._id}>
                                    {user.name}
                                  </option>
                                );
                              }
                              return null;
                            })}
                          </select>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddMember(team._id)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
