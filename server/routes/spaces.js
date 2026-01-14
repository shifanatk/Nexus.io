const router = require('express').Router();
const Space = require('../models/Space');
const User = require('../models/User');
const multer = require('multer');

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 1. Get All Spaces (Dashboard)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query; 
    const spaces = await Space.find({ members: userId });
    res.status(200).json(spaces);
  } catch (err) { res.status(500).json(err); }
});

// 2. Create Space
router.post('/', async (req, res) => {
  try {
    const newSpace = new Space({
      name: req.body.name,
      owner: req.body.owner,
      members: [req.body.owner] 
    });
    const savedSpace = await newSpace.save();
    res.status(200).json(savedSpace);
  } catch (err) { res.status(500).json(err); }
});

// 3. Get Single Space
router.get('/:id', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id)
      .populate('members', 'username email')
      .populate('subspaces');
    res.status(200).json(space);
  } catch (err) { res.status(500).json(err); }
});

// 4. Invite Member
router.put('/:id/invite', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("User not found");
    const space = await Space.findById(req.params.id);
    if (!space.members.includes(user._id)) {
      space.members.push(user._id);
      await space.save();
      res.status(200).json(space);
    } else {
      res.status(400).json("User already in space");
    }
  } catch (err) { res.status(500).json(err); }
});

// --- TASK ROUTES ---

// 5. Add Task
router.post('/:id/tasks', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    space.tasks.push({ description: req.body.description });
    await space.save();
    res.status(200).json(space);
  } catch (err) { res.status(500).json(err); }
});

// 6. Toggle Task
router.patch('/:id/tasks/:taskId', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    const task = space.tasks.id(req.params.taskId);
    task.status = task.status === 'Done' ? 'Todo' : 'Done';
    await space.save();
    res.status(200).json(space);
  } catch (err) { res.status(500).json(err); }
});

// 7. Update Description (Was missing for spaces?)
router.put('/:id/tasks/:taskId', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    const task = space.tasks.id(req.params.taskId);
    if (req.body.longDescription !== undefined) task.longDescription = req.body.longDescription;
    await space.save();
    res.status(200).json(space);
  } catch (err) { res.status(500).json(err); }
});

// 8. Upload Attachment
router.post('/:id/tasks/:taskId/attachment', upload.single('file'), async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    const task = space.tasks.id(req.params.taskId);
    task.attachments.push({ originalName: req.file.originalname, path: req.file.path });
    await space.save();
    res.status(200).json(space);
  } catch (err) { res.status(500).json(err); }
});

// 9. Add Comment
router.post('/:id/tasks/:taskId/comment', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    const task = space.tasks.id(req.params.taskId);
    task.comments.push({ username: req.body.username, text: req.body.text });
    await space.save();
    res.status(200).json(space);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;