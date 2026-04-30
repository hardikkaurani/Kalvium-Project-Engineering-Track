import React, { useState } from 'react';
import './App.css';

// Simulated API call — mimics server behavior
const submitBugReport = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.title.toLowerCase() === 'login') {
        reject({ field: 'title', message: 'A bug with this title already exists' });
      } else {
        resolve({ success: true, id: Math.floor(Math.random() * 1000) });
      }
    }, 1500);
  });
};

const EMPTY_FORM = {
  title: '',
  description: '',
  stepsCount: '',
  priority: '',
};

function App() {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // BUG 1: Does not clear field-specific error on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Missing: should clear the error for this field
  };

  // BUG 2: No validation at all — empty form can be submitted
  // BUG 3: No loading guard — double submit is possible
  // BUG 4: Form does not reset after successful submission
  // BUG 5: Server errors (from catch) are silently ignored
  // BUG 6: stepsCount allows negative and zero values
  const handleSubmit = async (e) => {
    e.preventDefault();

    // No validation — empty submission passes right through

    try {
      const result = await submitBugReport(form);
      setSuccess(`Bug #${result.id} submitted successfully!`);
      // Form should reset here but doesn't
    } catch (error) {
      // Server errors are completely ignored here
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🐛</span>
          <h1>TrackFlow</h1>
        </div>
        <p className="subtitle">Bug Report Form — QA Engineering Tool</p>
      </header>

      <main className="form-wrapper">
        <form className="bug-form" onSubmit={handleSubmit}>
          {/* Server Error Banner */}
          {serverError && (
            <div className="server-error-banner">
              <span>⚠️</span> {serverError}
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="success-banner">
              <span>✅</span> {success}
            </div>
          )}

          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title">Bug Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Login button unresponsive on mobile"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? 'input-error' : ''}
            />
            {/* BUG: No field-level error message displayed */}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the bug in detail..."
              rows="4"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? 'input-error' : ''}
            />
            {/* BUG: No field-level error message displayed */}
          </div>

          {/* Steps Count Field */}
          <div className="form-group">
            <label htmlFor="stepsCount">Steps to Reproduce (count)</label>
            <input
              id="stepsCount"
              name="stepsCount"
              type="number"
              placeholder="e.g. 3"
              value={form.stepsCount}
              onChange={handleChange}
              className={errors.stepsCount ? 'input-error' : ''}
            />
            {/* BUG: No field-level error message displayed */}
          </div>

          {/* Priority Field */}
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={errors.priority ? 'input-error' : ''}
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {/* BUG: No field-level error message displayed */}
          </div>

          {/* Submit Button — BUG: not disabled during loading */}
          <button type="submit" className="submit-btn">
            Submit Bug Report
          </button>
        </form>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 TrackFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
