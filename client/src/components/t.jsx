import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import TaskModal from './TaskModal'; // <--- NEW IMPORT

const SubspaceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [subspace, setSubspace] = useState(null);
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedTask, setSelectedTask] = useState(null); // <--- Modal State

  useEffect(() => {
    fetchSubspace();
  }, [id]);

  const fetchSubspace = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subspaces/${id}`);
      setSubspace(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/subspaces/${id}/tasks`, { description: taskDesc });
      setTaskDesc('');
      fetchSubspace();
    } catch (err) { console.error(err); }
  };

  const toggleTask = async (taskId) => {
    try {
      await axios.patch(`http://localhost:5000/api/subspaces/${id}/tasks/${taskId}`);
      fetchSubspace();
    } catch (err) { console.error(err); }
  };

  if (!subspace) return <div className="container"><p>Loading Subspace...</p></div>;

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      
      {/* --- TASK MODAL (Popup) --- */}
      {selectedTask && (
        <TaskModal 
          spaceId={id} 
          task={selectedTask} 
          close={() => setSelectedTask(null)} 
          refresh={fetchSubspace}
          isSubspace={true} // <--- Important flag
        />
      )}

      <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: 'var(--accent)' }}>🔐 {subspace.name}</h1>
        <span style={{ background: '#2a2a35', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
          {subspace.members.length} Members
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* --- LEFT COLUMN --- */}
        <div>
           <div className="card">
            <h3>Team Tasks</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input type="text" placeholder="Add task for this team..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} style={{ marginBottom: 0 }} />
              <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Add</button>
            </form>

            {/* Task List */}
            {subspace.tasks.length === 0 ? <p style={{ color: '#666' }}>No tasks yet.</p> : (
              subspace.tasks.map((task) => (
                <div key={task._id} className="list-item">
                  <span 
                    onClick={() => setSelectedTask(task)} // <--- Open Modal
                    style={{ flex: 1, cursor: 'pointer', textDecoration: task.status === 'Done' ? 'line-through' : 'none', color: task.status === 'Done' ? '#666' : 'white' }}
                  >
                    {task.status === 'Done' ? '✅ ' : '⬜ '} {task.description}
                    {task.comments?.length > 0 && <span style={{fontSize:'0.7rem', color:'#aaa', marginLeft:'10px'}}>💬 {task.comments.length}</span>}
                  </span>
                  
                  {/* Optional: Add delete button here if needed */}
                  <button onClick={() => toggleTask(task._id)} className="btn-secondary" style={{fontSize: '0.8rem', padding: '2px 8px'}}>✓</button>
                </div>
              ))
            )}
           </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div>
           <ChatRoom contextId={id} contextType="subspace" user={user} isOwner={true} />
        </div>

      </div>
    </div>
  );
};

export default SubspaceView;