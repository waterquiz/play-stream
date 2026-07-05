import { useState } from 'react';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

function AdminLogin({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const targetEmail = 'frazmain128@gmail.com';
    const targetPassword = 'F1r2a3z@';

    if (email.trim() === targetEmail && password === targetPassword) {
      onLoginSuccess();
    } else {
      setError('Invalid email address or admin password.');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrapper">
            <img src="/logo.png" alt="Play Stream Brand" className="login-logo-img" />
          </div>
          <h2>Admin Control Panel</h2>
          <p>Please log in to manage video content</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error-alert">{error}</div>}

          <div className="login-form-group">
            <label htmlFor="email-input">Admin Email</label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" />
              <input
                id="email-input"
                type="email"
                className="login-control"
                placeholder="e.g. admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="pass-input">Security Password</label>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-input-icon" />
              <input
                id="pass-input"
                type="password"
                className="login-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            Authenticate & Sign In
          </button>

          <button type="button" className="login-cancel-btn" onClick={onCancel}>
            <ArrowLeft size={14} style={{ marginRight: '6px' }} />
            Cancel & Return to Homepage
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
