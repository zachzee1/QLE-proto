import React, { useState, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';
import Fuse from 'fuse.js';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const QLECategory = ({ title, events, onSelect, isOpen, onToggle, id, selectedEventId }) => (
  <div className="category">
    <button
      className={`category-button ${isOpen ? 'open' : ''}`}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`category-${id}`}
    >
      <span>{title}</span>
      <svg
        className={`arrow ${isOpen ? 'open' : ''}`}
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </button>
    <div
      id={`category-${id}`}
      className={`category-content ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
    >
      {events.map((event, index) => (
        <div key={index} className="event">
          <h3>
            {event.title}
            {selectedEventId === event.id && (
              <svg className="check-mark" width="20" height="20" viewBox="0 0 20 20">
                <path d="M7 14.17L2.83 10l-1.41 1.41L7 17 19 5l-1.41-1.41L7 14.17z" fill="currentColor" />
              </svg>
            )}
          </h3>
          <p>{event.description}</p>
          <button 
            onClick={() => onSelect(event)}
            className={selectedEventId === event.id ? 'selected' : ''}
          >
            {selectedEventId === event.id ? 'Selected' : 'Select This Event'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

function App() {
  const [selectedQLE, setSelectedQLE] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleQLESelection = (event) => {
    setSelectedQLE(event);
    setOpenCategory(null);
    setSearchTerm('');
    setSelectedDate(null);
    setUploadedFiles([]);
    console.log("Selected QLE:", event);  // Add this line
  };

  const onDrop = useCallback(acceptedFiles => {
    setUploadedFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => Object.assign(file, {
        id: Math.random().toString(36).substr(2, 9)
      }))
    ]);
  }, []);

  const deleteFile = (fileId) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const toggleCategory = (title) => {
    setOpenCategory(openCategory === title ? null : title);
  };

  const qleCategories = [
    {
      title: "Family Changes",
      events: [
        { id: 1, title: "Getting Married", description: "You recently got married and your benefits coverage needs to account for your spouse." },
        { id: 2, title: "Entering a Domestic Partnership", description: "You recently entered a domestic partnership and your benefits coverage needs to account for your partner." },
        { id: 3, title: "Getting Divorced or Legally Separated", description: "Your marriage has ended, and you need to adjust your benefit coverage." },
        { id: 4, title: "Having a Baby or Adopting a Child", description: "You've had a baby, adopted a child, or had a child placed with you for foster care." },
        { id: 5, title: "Death of a Covered Family Member", description: "A dependent on your plan has passed away, affecting your benefits." },
      ],
    },
    {
      title: "Employment Changes",
      events: [
        { id: 6, title: "Change in Your Employment Status", description: "Your work hours or employment status have changed, affecting your eligibility for benefits." },
        { id: 7, title: "Spouse or Dependent's Employment Status Changes", description: "Your spouse or dependent gains or loses a job, impacting their benefits and your coverage options." },
      ],
    },
    {
      title: "Residence Changes",
      events: [
        { id: 8, title: "Moving to a New Residence", description: "You're relocating to a different zip code or county that affects your plan options or network availability." },
      ],
    },
    {
      title: "Changes in Coverage",
      events: [
        { id: 9, title: "Losing Other Health Coverage", description: "You or a dependent have lost existing health insurance coverage." },
        { id: 10, title: "Gaining Access to New Coverage", description: "You become eligible for new health coverage options, such as Medicare, Medicaid, or a spouse's plan." },
        { id: 11, title: "Significant Change in Cost or Coverage of Your Plan", description: "There's a significant increase or decrease in the cost of your current plan, or substantial changes to the coverage it provides." },
      ],
    },
    {
      title: "Dependent Eligibility Changes",
      events: [
        { id: 12, title: "Child Turning 26 Years Old", description: "Your dependent child has reached the age limit for coverage under your plan and may need their own coverage." },
        { id: 13, title: "Dependent Gains Other Coverage", description: "Your dependent becomes eligible for their own employer-sponsored health plan." },
      ],
    },
    {
      title: "Legal or Citizenship Changes",
      events: [
        { id: 14, title: "Qualified Medical Child Support Order", description: "A court order requires you to provide or remove health coverage for a child." },
        { id: 15, title: "Becoming a U.S. Citizen or Lawful Permanent Resident", description: "You gain U.S. citizenship or lawful residency status, affecting your eligibility for benefits." },
        { id: 16, title: "Release from Incarceration", description: "You've been released from jail or prison and need to enroll in health coverage." },
      ],
    },
  ];

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return qleCategories;
    
    const options = {
      keys: ['title', 'description'],
      threshold: 0.3,
      ignoreLocation: true,
    };

    return qleCategories.map(category => {
      const fuse = new Fuse(category.events, options);
      const filteredEvents = fuse.search(searchTerm).map(result => result.item);
      return {
        ...category,
        events: filteredEvents,
      };
    }).filter(category => category.events.length > 0);
  }, [qleCategories, searchTerm]);

  return (
    <div className="qle-component">
      <h1>Select Your Qualifying Life Event</h1>
      <p className="intro">
        A Qualifying Life Event (QLE) lets you change your benefits outside the usual enrollment period. 
        Choose the event that matches your situation.
      </p>
      <input
        type="text"
        placeholder="Search for a Qualifying Life Event..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="categories">
        {filteredCategories.map((category, index) => (
          <QLECategory
            key={index}
            id={index}
            title={category.title}
            events={category.events}
            onSelect={handleQLESelection}
            isOpen={openCategory === category.title || searchTerm !== ''}
            onToggle={() => toggleCategory(category.title)}
            selectedEventId={selectedQLE ? selectedQLE.id : null}
          />
        ))}
      </div>
      {selectedQLE && (
        <div className="selected-event">
          <h2>Selected Event: {selectedQLE.title}</h2>
          <p>{selectedQLE.description}</p>

          <p className="next-steps">Next Steps:</p>
          <ol>
            <li>Select the date when this event occurred or will occur.</li>
            <li>Upload any relevant documentation to support your qualifying life event.</li>
            <li>Review and update your benefit plans to reflect your new situation.</li>
            <li>Submit your changes for approval.</li>
          </ol>
          
          <div className="date-picker-container">
            <h3>Select the date of your Qualifying Life Event:</h3>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              placeholderText="Click to select a date"
            />
          </div>
          
          <div className="document-upload">
            <h3>Upload relevant documentation:</h3>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files:</h4>
                <ul>
                  {uploadedFiles.map((file) => (
                    <li key={file.id}>
                      {file.name}
                      <button onClick={() => deleteFile(file.id)} className="delete-file">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;