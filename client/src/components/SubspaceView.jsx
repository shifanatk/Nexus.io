import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import TaskModal from './TaskModal';

const SubspaceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [subspace, setSubspace] = useState(null);
  const [taskDesc, setTaskDesc] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

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
    if (!taskDesc.trim()) return;
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

  // --- NEW SORTING LOGIC ---
  const sortedTasks = subspace?.tasks ? [...subspace.tasks].sort((a, b) => {
    // 1. Status: Put 'Done' at the bottom
    if (a.status !== b.status) {
      return a.status === 'Done' ? 1 : -1;
    }
    // 2. Recency: Newest first (Compare IDs descending)
    return a._id < b._id ? 1 : -1; 
  }) : [];

  if (!subspace) return <div className="container" style={{color:'white'}}>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      
      {selectedTask && (
        <TaskModal 
          spaceId={id} 
          task={selectedTask} 
          close={() => setSelectedTask(null)} 
          refresh={fetchSubspace}
          isWorkspace={false} 
        />
      )}

      <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#fff' }}>🔐 {subspace.name}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* LEFT: Tasks */}
        <div>
           <div className="card">
            <h3>Team Tasks</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input 
                type="text" placeholder="Add a new task..." 
                value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} 
                style={{ marginBottom: 0 }} 
              />
              <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Add</button>
            </form>

            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              {/* USE sortedTasks HERE INSTEAD OF subspace.tasks */}
              {sortedTasks.map((task) => (
                <div key={task._id} className="list-item" style={{display:'flex', alignItems:'center'}}>
                  <button 
                    onClick={() => toggleTask(task._id)}
                    style={{
                      background: task.status === 'Done' ? '#4caf50' : 'transparent',
                      border: '2px solid #555',
                      borderRadius: '50%', 
                      width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', flexShrink: 0,
                      marginRight: '15px', cursor: 'pointer', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
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
                  
                  {task.attachments?.length > 0 && <span style={{fontSize:'0.8rem', color:'#aaa', marginLeft: '8px'}}>📎</span>}
                </div>
              ))}
              {sortedTasks.length === 0 && <p style={{color:'#666'}}>No tasks yet.</p>}
            </div>
           </div>
        </div>

        {/* RIGHT: Chat */}
        <div>
           <ChatRoom contextId={id} contextType="subspace" user={user} />
        </div>

      </div>
    </div>
  );
};

export default SubspaceView;