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

/**
 * Validates form data and returns field-level errors.
 * Returns an empty object if all fields are valid.
 */
function validate(data) {
  const errors = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Bug title is required';
  }

  if (!data.description || !data.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!data.stepsCount || Number(data.stepsCount) <= 0 || !Number.isInteger(Number(data.stepsCount))) {
    errors.stepsCount = 'Steps count must be a positive whole number';
  }

  if (!data.priority) {
    errors.priority = 'Priority is required';
  }

  return errors;
}

function App() {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // FIX 1: Clear field-specific error on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    // Clear success/server messages when user starts editing again
    if (success) setSuccess('');
    if (serverError) setServerError('');
  };

  // FIX 2-6: Complete validation, loading guard, form reset, error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIX 2 + FIX 6: Validate all fields including stepsCount > 0
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // FIX 3: Prevent double-submit with loading guard
    setLoading(true);
    setServerError('');
    setSuccess('');

    try {
      const result = await submitBugReport(form);
      setSuccess(`Bug #${result.id} submitted successfully!`);

      // FIX 4: Reset form after successful submission
      setForm({ ...EMPTY_FORM });
      setErrors({});
      setServerError('');
    } catch (error) {
      // FIX 5: Surface server errors to the UI
      if (error.field) {
        setErrors({ [error.field]: error.message });
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
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
            {errors.title && <p className="field-error">{errors.title}</p>}
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
            {errors.description && <p className="field-error">{errors.description}</p>}
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
            {errors.stepsCount && <p className="field-error">{errors.stepsCount}</p>}
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
            {errors.priority && <p className="field-error">{errors.priority}</p>}
          </div>

          {/* Submit Button — disabled during loading to prevent double-submit */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Bug Report'}
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
