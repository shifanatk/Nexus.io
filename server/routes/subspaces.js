const router = require('express').Router();
const Subspace = require('../models/Subspace');
const Space = require('../models/Space');
const multer = require('multer');

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 1. Create Subspace
router.post('/', async (req, res) => {
  try {
    const newSubspace = new Subspace(req.body);
    const savedSubspace = await newSubspace.save();
    // Link to Parent Space
    await Space.findByIdAndUpdate(req.body.space, {
      $push: { subspaces: savedSubspace._id }
    });
    res.status(200).json(savedSubspace);
  } catch (err) { res.status(500).json(err); }
});

// 2. Get Subspace
router.get('/:id', async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    res.status(200).json(subspace);
  } catch (err) { res.status(500).json(err); }
});

// 3. Add Task
router.post('/:id/tasks', async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    subspace.tasks.push({ description: req.body.description });
    await subspace.save();
    res.status(200).json(subspace);
  } catch (err) { res.status(500).json(err); }
});

// 4. Toggle Task Status
router.patch('/:id/tasks/:taskId', async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    const task = subspace.tasks.id(req.params.taskId);
    task.status = task.status === 'Done' ? 'Todo' : 'Done';
    await subspace.save();
    res.status(200).json(subspace);
  } catch (err) { res.status(500).json(err); }
});

// 5. UPDATE DESCRIPTION (The Missing Route)
router.put('/:id/tasks/:taskId', async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    const task = subspace.tasks.id(req.params.taskId);
    if (req.body.longDescription !== undefined) {
      task.longDescription = req.body.longDescription;
    }
    await subspace.save();
    res.status(200).json(subspace);
  } catch (err) { res.status(500).json(err); }
});

// 6. UPLOAD ATTACHMENT
router.post('/:id/tasks/:taskId/attachment', upload.single('file'), async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    const task = subspace.tasks.id(req.params.taskId);
    task.attachments.push({ originalName: req.file.originalname, path: req.file.path });
    await subspace.save();
    res.status(200).json(subspace);
  } catch (err) { res.status(500).json(err); }
});

// 7. ADD COMMENT (The Other Missing Route)
router.post('/:id/tasks/:taskId/comment', async (req, res) => {
  try {
    const subspace = await Subspace.findById(req.params.id);
    const task = subspace.tasks.id(req.params.taskId);
    task.comments.push({ username: req.body.username, text: req.body.text });
    await subspace.save();
    res.status(200).json(subspace);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;