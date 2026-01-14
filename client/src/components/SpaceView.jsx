import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import TaskModal from './TaskModal';

const SpaceView = () => {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [subspaceName, setSubspaceName] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchSpace();
  }, [id]);

  const fetchSpace = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/spaces/${id}`);
      setSpace(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskDesc.trim()) return;
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

  const createSubspace = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/subspaces', { name: subspaceName, space: id });
      setSubspaceName('');
      fetchSpace();
    } catch (err) { console.error(err); }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/spaces/${id}/invite`, { username: inviteName });
      alert('User added!');
      setInviteName('');
      fetchSpace();
    } catch (err) { alert('User not found'); }
  };

  // --- NEW SORTING LOGIC ---
  const sortedTasks = space?.tasks ? [...space.tasks].sort((a, b) => {
    // 1. Status: Done goes to bottom
    if (a.status !== b.status) return a.status === 'Done' ? 1 : -1;
    // 2. Recency: Newest first
    return a._id < b._id ? 1 : -1; 
  }) : [];

  if (!space) return <div style={{color:'white', padding:'20px'}}>Loading...</div>;

  return (
    <div className="container" style={{maxWidth: '1200px'}}>
      
      {selectedTask && (
        <TaskModal 
          spaceId={id} 
          task={selectedTask} 
          close={() => setSelectedTask(null)} 
          refresh={fetchSpace}
          isWorkspace={true}
        />
      )}

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <h1 style={{color: '#fff'}}>{space.name}</h1>
        <div style={{color: '#aaa'}}>Owner: {space.owner?.username}</div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px'}}>
        
        {/* LEFT COLUMN */}
        <div>
          <div className="card" style={{marginBottom: '20px'}}>
            <h3>🚀 Subspaces</h3>
            <div style={{display:'grid', gap:'10px'}}>
              {space.subspaces.map(sub => (
                <Link key={sub._id} to={`/subspace/${sub._id}`} style={{textDecoration:'none'}}>
                  <div className="list-item">
                    {sub.name} <span style={{float:'right'}}>→</span>
                  </div>
                </Link>
              ))}
            </div>
            <form onSubmit={createSubspace} style={{marginTop:'15px', display:'flex', gap:'10px'}}>
              <input type="text" placeholder="New Subspace Name" value={subspaceName} onChange={(e)=>setSubspaceName(e.target.value)} style={{marginBottom:0}} />
              <button className="btn-primary" style={{width:'auto'}}>Create</button>
            </form>
          </div>

          <div className="card">
            <h3>📌 General Workspace Tasks</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input type="text" placeholder="Add a general task..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} style={{ marginBottom: 0 }} />
              <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Add</button>
            </form>

            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              {/* USE sortedTasks HERE */}
              {sortedTasks.map((task) => (
                <div key={task._id} className="list-item" style={{display:'flex', alignItems:'center'}}>
                   <button 
                    onClick={() => toggleTask(task._id)}
                    style={{
                      background: task.status === 'Done' ? '#4caf50' : 'transparent',
                      border: '2px solid #555',
                      borderRadius: '50%', width:'24px', height:'24px', minWidth: '24px', minHeight: '24px', flexShrink: 0,
                      marginRight: '15px', cursor:'pointer', color:'white', display:'flex', alignItems:'center', justifyContent:'center'
                    }}
                  >
                    {task.status === 'Done' ? '✓' : ''}
                  </button>
                  <span 
                    onClick={() => setSelectedTask(task)}
                    style={{ 
                      flex: 1, cursor: 'pointer', 
                      textDecoration: task.status === 'Done' ? 'line-through' : 'none', 
                      color: task.status === 'Done' ? '#666' : 'white' 
                    }}
                  >
                    {task.description}
                  </span>
                  {task.attachments?.length > 0 && <span style={{fontSize:'0.8rem', color:'#aaa', marginLeft:'8px'}}>📎</span>}
                </div>
              ))}
              {sortedTasks.length === 0 && <p style={{color:'#666'}}>No general tasks.</p>}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="card" style={{marginBottom: '20px', border: '1px solid #7c4dff'}}>
            <h4 style={{marginTop:0}}>👥 Members</h4>
            <div style={{maxHeight:'100px', overflowY:'auto', marginBottom:'10px'}}>
              {space.members.map(m => (
                <div key={m._id} style={{fontSize:'0.9rem', color:'#ccc'}}>{m.username}</div>
              ))}
            </div>
            <form onSubmit={handleInvite} style={{display:'flex', gap:'5px'}}>
              <input placeholder="Username..." value={inviteName} onChange={(e)=>setInviteName(e.target.value)} style={{marginBottom:0, padding:'5px'}} />
              <button className="btn-secondary" style={{padding:'5px 10px'}}>Add</button>
            </form>
          </div>
          <ChatRoom contextId={id} contextType="space" user={user} />
        </div>

      </div>
    </div>
  );
};

export default SpaceView;