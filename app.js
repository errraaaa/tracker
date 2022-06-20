const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

if (process.env.NODE_ENV === 'production') {
  console.log('imhelelele');
  app.get('/*', (req, res) => {
    req.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}
app.use(express.static('build'));
// const indexRouter = require('./routes/indexRouter');

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/', indexRouter);
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is started on port: ${PORT}`);
});
