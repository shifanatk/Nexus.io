import { useState } from 'react';
import axios from 'axios';

const TaskModal = ({ spaceId, task, close, refresh, isSubspace = false }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [longDesc, setLongDesc] = useState(task.longDescription || '');
  const [comment, setComment] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Decide which API endpoint to use
  const baseUrl = isSubspace 
    ? `http://localhost:5000/api/subspaces/${spaceId}`
    : `http://localhost:5000/api/spaces/${spaceId}`;

  const saveDescription = async () => {
    try {
      // We need a new route for this, but for now let's assume we update the whole task
      // Note: You'll need to add a "Update Task Details" route to backend to make this persistent.
      // For this demo, we will focus on the Chat.
      alert("Feature coming: Save Description");
    } catch (err) { console.error(err); }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/tasks/${task._id}/comment`, {
        userId: user._id,
        username: user.username,
        text: comment
      });
      setComment('');
      refresh(); // Reload parent to see new comment
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '500px', height: '600px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>{task.description}</h2>
          <button onClick={close} className="btn-secondary">✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #333', marginBottom: '15px' }}>
          <button onClick={() => setActiveTab('details')} style={{ flex: 1, background: activeTab === 'details' ? '#333' : 'transparent', color: 'white' }}>Details</button>
          <button onClick={() => setActiveTab('chat')} style={{ flex: 1, background: activeTab === 'chat' ? '#333' : 'transparent', color: 'white' }}>Task Chat ({task.comments?.length || 0})</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'details' ? (
            <div>
              <textarea 
                style={{ width: '100%', height: '300px', background: '#111', color: '#ddd', padding: '10px', border: '1px solid #333' }}
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                placeholder="Add detailed description here..."
              />
              <button onClick={saveDescription} className="btn-primary" style={{ marginTop: '10px' }}>Save Details</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                {task.comments?.map((c, i) => (
                  <div key={i} style={{ marginBottom: '10px', background: '#222', padding: '8px', borderRadius: '5px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{c.username}</div>
                    <div>{c.text}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendComment} style={{ display: 'flex', gap: '5px' }}>
                <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment on this task..." />
                <button type="submit" className="btn-primary">→</button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TaskModal;