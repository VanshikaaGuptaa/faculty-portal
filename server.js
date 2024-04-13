// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Create MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // your MySQL username
  password: '', // your MySQL password
  database: 'minor'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.use(cors());
app.use(bodyParser.json());

// API to validate faculty login
app.post('/api/login', (req, res) => {
  const { faculty_id, password } = req.body;
  const sql = `SELECT * FROM faculty WHERE faculty_id = ? AND password = ?`;

  db.query(sql, [faculty_id, password], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length > 0) {
      res.json({ success: true, faculty: result[0] });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// API to fetch subjects taught by a faculty
app.get('/api/faculty/:facultyId/subjects', (req, res) => {
  const facultyId = req.params.facultyId;
  const sql = `SELECT * FROM faculty_subjects WHERE faculty_id = ?`;

  db.query(sql, [facultyId], (err, results) => {
    if (err) {
      throw err;
    }
    res.json({ subjects: results });
  });
});

// API to fetch students enrolled in a subject taught by a faculty
app.get('/api/faculty/:facultyId/subjects/:subjectId/students', (req, res) => {
  const { facultyId } = req.params;
  const sql = `SELECT name, subject_name, student_name FROM faculty_students WHERE faculty_id = ? ORDER BY subject_name, id`;

  db.query(sql, [facultyId], (err, results) => {
    if (err) {
      throw err;
    }
    res.json({ students: results });
  });
});
app.get('/api/faculty/:facultyId/timetable', (req, res) => {
    const facultyId = req.params.facultyId;
    const sql = `SELECT * FROM timetable WHERE faculty_id = ?`;
  
    db.query(sql, [facultyId], (err, results) => {
      if (err) {
        throw err;
      }
      res.json({ timetable: results });
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
