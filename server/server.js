const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

let users = []; 
let posts = []; 

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return res.json({ user, message: "Login berhasil!" });
  }

  return res.status(400).json({ error: "Login gagal. Cek email dan password." });
});

app.post('/api/uploadProfilePic', upload.single('profilePic'), (req, res) => {
  const { email } = req.body;  
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan.' });
  }

  user.profilePic = req.file.path; 
  return res.json({ message: "Foto profil berhasil di-upload.", profilePic: req.file.path });
});

app.post('/api/createPost', (req, res) => {
  const { email, title, description, image } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan.' });
  }


  const post = { userId: user.email, title, description, image };
  posts.push(post);
  return res.json({ message: "Post berhasil dibuat!", post });
});

app.get('/api/getPosts', (req, res) => {
  const { email } = req.query;
  const userPosts = posts.filter(post => post.userId === email);
  return res.json(userPosts);
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
