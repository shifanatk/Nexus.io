import { useState } from 'react';
import axios from 'axios';

const TaskModal = ({ spaceId, task, close, refresh, isWorkspace }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [longDesc, setLongDesc] = useState(task.longDescription || '');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Logic to switch between Space URL and Subspace URL
  const baseUrl = isWorkspace 
    ? `http://localhost:5000/api/spaces/${spaceId}`
    : `http://localhost:5000/api/subspaces/${spaceId}`;

  const saveDescription = async () => {
    try {
      await axios.put(`${baseUrl}/tasks/${task._id}`, { longDescription: longDesc });
      alert('Description Saved!');
      refresh(); 
    } catch (err) { alert('Failed to save description'); }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      await axios.post(`${baseUrl}/tasks/${task._id}/attachment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('File Uploaded!');
      setFile(null);
      refresh();
    } catch (err) { alert('Upload failed'); } 
    finally { setUploading(false); }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(`${baseUrl}/tasks/${task._id}/comment`, {
        username: user.username, text: comment
      });
      setComment('');
      refresh();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={styles.overlay}>
      <div className="card" style={styles.modal}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
          <h2 style={{margin: 0, fontSize: '1.2rem', color: '#fff'}}>{task.description}</h2>
          <button onClick={close} className="btn-secondary" style={{padding:'4px 10px', borderRadius: '50%', background: '#333'}}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #444', marginBottom: '15px' }}>
          <button onClick={() => setActiveTab('details')} style={{...styles.tab, borderBottom: activeTab === 'details' ? '2px solid #7c4dff' : 'none', color: activeTab === 'details' ? '#fff' : '#888'}}>Details & Files</button>
          <button onClick={() => setActiveTab('chat')} style={{...styles.tab, borderBottom: activeTab === 'chat' ? '2px solid #7c4dff' : 'none', color: activeTab === 'chat' ? '#fff' : '#888'}}>Comments ({task.comments?.length || 0})</button>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
          
          {activeTab === 'details' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              
              {/* DESCRIPTION */}
              <div>
                <label style={styles.label}>DESCRIPTION</label>
                <textarea 
                  style={styles.textarea}
                  value={longDesc} 
                  onChange={(e) => setLongDesc(e.target.value)}
                  placeholder="Add detailed notes here..."
                />
                <button onClick={saveDescription} className="btn-secondary" style={{marginTop: '8px', fontSize: '0.8rem'}}>Save Description</button>
              </div>

              {/* ATTACHMENTS */}
              <div>
                <label style={styles.label}>ATTACHMENTS</label>
                <div style={{ marginBottom: '10px' }}>
                  {task.attachments?.map((att, i) => (
                    <div key={i} style={styles.fileItem}>
                      <span>📄 {att.originalName}</span>
                      <a href={`http://localhost:5000/${att.path}`} target="_blank" rel="noopener noreferrer" style={{color: '#7c4dff'}}>Download</a>
                    </div>
                  ))}
                  {(!task.attachments || task.attachments.length === 0) && <p style={{fontSize:'0.9rem', color:'#666'}}>No attachments.</p>}
                </div>

                <div style={styles.uploadBox}>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{fontSize:'0.9rem', color: '#ccc'}} />
                  <button onClick={handleUpload} className="btn-primary" disabled={!file || uploading} style={{width: 'auto', fontSize:'0.8rem', padding: '6px 12px'}}>
                    {uploading ? '...' : 'Upload'}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            // COMMENTS
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px' }}>
                {task.comments?.map((c, i) => (
                  <div key={i} style={{ marginBottom: '10px', background: '#222', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ color: '#7c4dff', fontWeight:'bold', fontSize:'0.8rem' }}>{c.username}</div>
                    <div style={{color: '#ddd'}}>{c.text}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendComment} style={{ display: 'flex', gap: '8px' }}>
                <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Type a comment..." style={{marginBottom:0, flex: 1}} />
                <button type="submit" className="btn-primary" style={{width:'auto'}}>Post</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { width: '500px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '25px', background: '#1a1a23', border: '1px solid #333', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  tab: { flex: 1, padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize:'0.9rem', transition: '0.2s' },
  label: { color: '#888', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', display: 'block' },
  textarea: { width: '100%', height: '100px', background: '#111', color: '#e0e0e0', padding: '10px', border: '1px solid #333', borderRadius: '4px', resize: 'vertical' },
  fileItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#222', marginBottom: '5px', borderRadius: '4px', fontSize: '0.9rem' },
  uploadBox: { display: 'flex', gap: '10px', alignItems: 'center', background:'#222', padding:'10px', borderRadius:'6px', border: '1px dashed #444' }
};

export default TaskModal;