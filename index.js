const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const seedRoutes = require('./routes/dbSeed');
const taskRoutes = require('./routes/taskRoute');

//express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get('/', async (req, res) => {
  res.json({ msg: 'Welcome to .....' });
});

app.use('/seed', seedRoutes);
app.use('/api/tasks', taskRoutes);

//connected to db
mongoose
  .connect('mongodb+srv://newinjam:3KxAOaJHbMRNWDZY@cluster0.a30hcma.mongodb.net/seedData?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });

//listen for request
app.listen(7500, () => {
  console.log('http://localhost:' + 7500);
});
