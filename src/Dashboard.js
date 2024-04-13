import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import CSS file for styling

function Sidebar({ setActiveTab }) {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => handleTabClick('profile')}>Profile</li>
        <li onClick={() => handleTabClick('subjects')}>Subjects</li>
        <li onClick={() => handleTabClick('students')}>Students</li>
        <li onClick={() => handleTabClick('timetable')}>Timetable</li>
      </ul>
    </div>
  );
}

function Dashboard({ facultyData }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    axios.get(`http://localhost:5000/api/faculty/${facultyData.faculty_id}/subjects`)
      .then(res => {
        setSubjects(res.data.subjects);
      })
      .catch(err => {
        console.error(err);
      });
  }, [facultyData]);

  useEffect(() => {
    if (activeTab === 'students' && subjects.length > 0) {
      const subjectId = subjects[0].id;
      axios.get(`http://localhost:5000/api/faculty/${facultyData.faculty_id}/subjects/${subjectId}/students`)
        .then(res => {
          setStudents(res.data.students);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [activeTab, facultyData, subjects]);

  useEffect(() => {
    if (activeTab === 'timetable') {
      axios.get(`http://localhost:5000/api/faculty/${facultyData.faculty_id}/timetable`)
        .then(res => {
          setTimetable(res.data.timetable);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [activeTab, facultyData]);

 

    const handleDeleteSlot = (id) => {
      axios.delete(`http://localhost:5000/api/timetable/${id}`)
      .then(() => {
        setTimetable(timetable.filter(slot => slot.id !== id));
      })
      .catch(err => {
        console.error(err);
      });
      }

      const handleChangeSlot = (timeSlot) => {
        // const existingSlot = filteredTimetable.find(slot => slot.time_slot === timeSlot);
        console.log(timeSlot);
        }
  

  const filteredTimetable = selectedDay ? timetable.filter(item => item.day === selectedDay) : timetable;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="tab-content">
            <h2>Welcome, {facultyData.faculty_name}!</h2>
            <p>Faculty ID: {facultyData.faculty_id}</p>
            <p>Department: {facultyData.department}</p>
            <p>Email: {facultyData.email}</p>
            <p>Date of Birth: {facultyData.dob}</p>
            <p>Designation: {facultyData.designation}</p>
          </div>
        );
      case 'subjects':
        return (
          <div className="tab-content">
            <h2>Subjects</h2>
            <ul>
              {subjects.map(subject => (
                <li key={subject.id}>{subject.subject_name} - {subject.subject_code}</li>
              ))}
            </ul>
          </div>
        );
      case 'students':
        return (
          <div className="tab-content">
            <h2>Students</h2>
            <ul>
              {students.map(student => (
                <li key={student.id}>{student.name} - {student.name} {student.student_name}</li>
              ))}
            </ul>
          </div>
        );
      case 'timetable':
        return (
          <div className="tab-content">
            <h2>Timetable</h2>
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
              <option value="">Select Day</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Subject</th>
                  <th>Classroom</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimetable.map(item => (
                  <tr key={item.id}>
                    <td>{item.day}</td>
                    <td>{item.time_slot}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.classroom}</td>
                    {/* <td><button onClick={() => handleAddSlot(item.time_slot)}>Add</button></td> */}
                  <td><button onClick={() => handleDeleteSlot(item.id)}>Delete</button></td>
                  <td><button onClick={() => handleChangeSlot(item.id)}>Change</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar setActiveTab={setActiveTab} />
      <div className="main-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Dashboard;









