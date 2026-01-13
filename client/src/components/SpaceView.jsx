import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import TaskModal from './TaskModal'; // <--- NEW IMPORT

const SpaceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Data State
  const [space, setSpace] = useState(null);
  const [subspaces, setSubspaces] = useState([]);
  
  // Input State
  const [taskDesc, setTaskDesc] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [newSubspaceName, setNewSubspaceName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // UI State
  const [selectedTask, setSelectedTask] = useState(null); // <--- For the Modal

  useEffect(() => {
    fetchSpace();
    fetchSubspaces();
  }, [id]);

  const fetchSpace = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/spaces/${id}`);
      setSpace(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchSubspaces = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subspaces/space/${id}/${user._id}`);
      setSubspaces(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/spaces/${id}/tasks`, { description: taskDesc });
      setTaskDesc('');
      fetchSpace();
    } catch (err) { console.error(err); }
  };

  const toggleTask = async (taskId) => {
    try {
      await axios.patch(`http://localhost:5000/api/spaces/${id}/tasks/${taskId}`);
      fetchSpace();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/spaces/${id}/tasks/${taskId}`);
      fetchSpace();
    } catch (err) { console.error(err); }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/spaces/${id}/invite`, { username: inviteName });
      alert(`User ${inviteName} added!`);
      setInviteName('');
      fetchSpace();
    } catch (err) { alert('User not found.'); }
  };

  const handleCreateSubspace = async (e) => {
    e.preventDefault();
    const membersToInclude = [...selectedMembers, user._id];
    try {
      await axios.post('http://localhost:5000/api/subspaces/create', {
        name: newSubspaceName,
        parentSpaceId: id,
        memberIds: membersToInclude
      });
      setNewSubspaceName('');
      setSelectedMembers([]);
      fetchSubspaces();
    } catch (err) { console.error(err); }
  };

  const toggleMemberSelection = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  if (!space) return <div className="container"><p>Loading Space...</p></div>;

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      
      {/* --- TASK MODAL (Popup) --- */}
      {selectedTask && (
        <TaskModal 
          spaceId={id} 
          task={selectedTask} 
          close={() => setSelectedTask(null)} 
          refresh={fetchSpace}
        />
      )}

      <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📂 {space.name}</h1>
        <span style={{ background: '#2a2a35', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
          {space.members.length} Members
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* --- LEFT COLUMN --- */}
        <div>
          {/* Invite Box */}
          <div className="card" style={{ border: '1px solid #333' }}>
            <h4 style={{marginTop: 0}}>👥 Add People to Workspace</h4>
            <form onSubmit={handleInvite} style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Invite by username..." value={inviteName} onChange={(e) => setInviteName(e.target.value)} style={{ marginBottom: 0 }} />
              <button type="submit" className="btn-secondary">Invite</button>
            </form>
          </div>

          {/* Subspace Creation */}
          <div className="card" style={{ border: '1px solid var(--accent)' }}>
            <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>🔒 Create Restricted Subspace</h3>
            <form onSubmit={handleCreateSubspace}>
              <input type="text" placeholder="Subspace Name..." value={newSubspaceName} onChange={(e) => setNewSubspaceName(e.target.value)} />
              
              {space.members.length <= 1 && <p style={{ color: '#ff5252', fontSize: '0.8rem' }}>⚠️ Invite people to workspace first!</p>}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                {space.members.map(member => (
                   member !== user._id && (
                    <label key={member} style={{ background: '#333', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" checked={selectedMembers.includes(member)} onChange={() => toggleMemberSelection(member)} style={{ width: 'auto', margin: '0 8px 0 0' }} />
                      User ID: {member.slice(-4)} 
                    </label>
                   )
                ))}
              </div>
              <button type="submit" className="btn-primary">Create Subspace</button>
            </form>
          </div>

          {/* Subspaces List */}
          <h3 style={{ color: '#a0a0b0' }}>Subspaces</h3>
          <div className="card" style={{ padding: 0, marginBottom: '20px' }}>
             {subspaces.length === 0 ? <p style={{ padding: '20px' }}>No subspaces.</p> : (
               subspaces.map((sub) => (
                 <div key={sub._id} className="list-item" onClick={() => navigate(`/subspace/${sub._id}`)}>
                   <div style={{ display: 'flex', alignItems: 'center' }}>
                     <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>🔐</span>
                     <strong>{sub.name}</strong>
                   </div>
                 </div>
               ))
             )}
          </div>

          {/* General Tasks */}
          <h3 style={{ color: '#a0a0b0' }}>General Tasks</h3>
          <div className="card">
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input type="text" placeholder="New Task..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} style={{marginBottom:0}} />
              <button type="submit" className="btn-primary" style={{width:'auto'}}>Add</button>
            </form>
            {space.tasks.map(task => (
              <div key={task._id} className="list-item">
                <span 
                  onClick={() => setSelectedTask(task)} // <--- Open Modal on Click
                  style={{ flex: 1, cursor: 'pointer', textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}
                >
                  {task.status === 'Done' ? '✅' : '⬜'} {task.description}
                  {task.comments?.length > 0 && <span style={{fontSize:'0.7rem', color:'#aaa', marginLeft:'10px'}}>💬 {task.comments.length}</span>}
                </span>
                <button onClick={() => toggleTask(task._id)} className="btn-secondary" style={{marginRight:'5px'}}>✓</button>
                <button onClick={() => deleteTask(task._id)} className="btn-danger">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div>
           <ChatRoom contextId={id} contextType="space" user={user} isOwner={space.owner === user._id} />
        </div>

      </div>
    </div>
  );
};

export default SpaceView;