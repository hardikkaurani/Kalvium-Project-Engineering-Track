// ============================================================
//  TrackFlow ?" Bug Report Form (FIXED)
// ============================================================

import { useState } from 'react'
import { submitBugReport } from './api'

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']
const COMPONENTS = ['Authentication', 'Dashboard', 'Billing', 'API', 'Notifications', 'Settings']

const INITIAL_FORM = {
  title: '',
  severity: '',
  component: '',
  description: '',
  steps: '',
  stepsCount: '',
}

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [submitted, setSubmitted] = useState([])
  const [successId, setSuccessId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    
    // BUG 5 FIX: Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  // BUG 1, 5, 6 FIX: Comprehensive validation
  const validate = () => {
    const newErrors = {}
    
    if (!form.title.trim()) newErrors.title = "A descriptive title is required."
    if (!form.severity) newErrors.severity = "Please select a severity level."
    if (!form.component) newErrors.component = "Please select the affected component."
    if (!form.description.trim()) newErrors.description = "Provide a detailed description of the bug."
    
    // BUG 6 FIX: Ensure stepsCount is a positive integer
    const count = parseInt(form.stepsCount)
    if (!form.stepsCount || isNaN(count) || count <= 0) {
      newErrors.stepsCount = "Steps count must be at least 1."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)
    setSuccessId(null)

    // BUG 1 FIX: Submission is blocked if validation fails
    if (!validate()) return

    // BUG 2 FIX: Set loading state to prevent duplicate submissions
    setLoading(true)

    try {
      const result = await submitBugReport(form)
      
      // BUG 3 FIX: Reset form on success
      setForm(INITIAL_FORM)
      setSuccessId(result.id)
      setSubmitted((prev) => [result, ...prev])
      setErrors({})
    } catch (err) {
      // BUG 4 FIX: Catch and display server-side errors
      setServerError(err.message || "An unexpected error occurred during submission.")
    } finally {
      // BUG 2 FIX: Reset loading state
      setLoading(false)
    }
  }

  const sevClass = (s) =>
    ({ Critical: 'sev-critical', High: 'sev-high', Medium: 'sev-medium', Low: 'sev-low' }[s] ?? '')

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="badge"> TrackFlow Internal Tools</div>
        <h1>Report a Bug</h1>
        <p>
          You're on the <strong>QA Engineering</strong> team at <strong>TrackFlow Inc.</strong> The
          team uses this form to log bugs before sprint planning every Monday. Help your teammates
          by making sure the form works correctly.
        </p>
      </header>

      <div className="card">
        <p className="section-label">New Bug Report</p>
        <form onSubmit={handleSubmit} noValidate>

          {/* SUCCESS BANNER */}
          {successId && (
            <div className="banner success-banner">
              o" Bug <strong>{successId}</strong> filed successfully!
            </div>
          )}

          {/* SERVER ERROR BANNER - BUG 4 FIX */}
          {serverError && (
            <div className="banner error-banner">
              " {serverError}
            </div>
          )}

          <div className="form-group">
            <label>Bug Title <span className="req">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? 'error-field' : ''}
              placeholder="e.g. Checkout button unresponsive on mobile Safari"
              disabled={loading}
            />
            {/* BUG 5 FIX: Render field-specific error */}
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Severity <span className="req">*</span></label>
              <select 
                name="severity" 
                value={form.severity} 
                onChange={handleChange}
                className={errors.severity ? 'error-field' : ''}
                disabled={loading}
              >
                <option value="">?" Select ?"</option>
                {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.severity && <span className="error-text">{errors.severity}</span>}
            </div>
            <div className="form-group">
              <label>Affected Component <span className="req">*</span></label>
              <select 
                name="component" 
                value={form.component} 
                onChange={handleChange}
                className={errors.component ? 'error-field' : ''}
                disabled={loading}
              >
                <option value="">?" Select ?"</option>
                {COMPONENTS.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.component && <span className="error-text">{errors.component}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Description <span className="req">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? 'error-field' : ''}
              placeholder="Describe what's happening and what the expected behaviour should be?"
              disabled={loading}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <hr className="divider" />

          <div className="form-row">
            <div className="form-group">
              <label>Steps to Reproduce</label>
              <textarea
                name="steps"
                value={form.steps}
                onChange={handleChange}
                style={{ minHeight: 72 }}
                placeholder="1. Go to?&#10;2. Click?&#10;3. Observe?"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>No. of Steps <span className="req">*</span></label>
              <input
                type="number"
                name="stepsCount"
                value={form.stepsCount}
                onChange={handleChange}
                className={errors.stepsCount ? 'error-field' : ''}
                placeholder="e.g. 3"
                disabled={loading}
              />
              {/* BUG 6 FIX: Display validation for steps count */}
              {errors.stepsCount && <span className="error-text">{errors.stepsCount}</span>}
            </div>
          </div>

          {/* BUG 2 FIX: Disable button and show loading state */}
          <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
            {loading ? (
              <span className="flex-center">
                <span className="mini-spinner"></span> SYNCING WITH JIRA...
              </span>
            ) : 'Submit Bug Report'}
          </button>

        </form>
      </div>

      {submitted.length > 0 && (
        <div className="submitted-list">
          <p className="section-label" style={{ marginBottom: 8 }}>Filed This Session</p>
          {submitted.map((bug, i) => (
            <div key={i} className="submitted-item">
              <div>
                <div className="title">{bug.title}</div>
                <div className="meta">{bug.component} A {bug.stepsCount} steps</div>
              </div>
              <span className={`severity-badge ${sevClass(bug.severity)}`}>{bug.severity}</span>
            </div>
          ))}
        </div>
      )}

      {/* Internal CSS for UI polish */}
      <style>{`
        .banner { borderRadius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 14px; border: 1px solid; }
        .success-banner { background: rgba(76,175,125,0.1); border-color: rgba(76,175,125,0.3); color: #4caf7d; }
        .error-banner { background: rgba(247,95,95,0.1); border-color: rgba(247,95,95,0.3); color: #f75f5f; }
        .error-field { border-color: #f75f5f !important; background-color: #fffafa !important; }
        .error-text { color: #f75f5f; font-size: 11px; font-weight: 600; margin-top: 4px; display: block; text-transform: uppercase; letter-spacing: 0.05em; }
        .req { color: #f75f5f; }
        .flex-center { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .mini-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .btn.loading { opacity: 0.8; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
