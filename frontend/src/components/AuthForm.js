import { useState } from 'react';

import { validateAuthForm } from '../utils/validation';

const emptyForm = {
  email: '',
  password: '',
  username: '',
};

export default function AuthForm({ isSubmitting, onSubmit, serverError }) {
  const [mode, setMode] = useState('login');
  const [formValues, setFormValues] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const handleFieldChange = (fieldName, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
  };

  const handleModeChange = () => {
    setMode((currentMode) => (currentMode === 'login' ? 'register' : 'login'));
    setFormValues(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, values } = validateAuthForm(mode, formValues);

    if (error) {
      setFormError(error);
      return;
    }

    setFormError('');

    const didSucceed = await onSubmit(mode, values);

    if (didSucceed) {
      setFormValues(emptyForm);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="brand-chip">Portfolio Project</div>
        <h1>AI Chat Assistant</h1>
        <p className="auth-subtitle">
          A full-stack practice app with authentication, chat persistence, and an
          AI-ready backend.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label>
              <span>Username</span>
              <input
                autoComplete="username"
                onChange={(event) => handleFieldChange('username', event.target.value)}
                placeholder="Choose a username"
                value={formValues.username}
              />
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <input
              autoComplete="email"
              onChange={(event) => handleFieldChange('email', event.target.value)}
              placeholder="you@example.com"
              value={formValues.email}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChange={(event) => handleFieldChange('password', event.target.value)}
              placeholder="At least 8 characters"
              type="password"
              value={formValues.password}
            />
          </label>

          {formError ? <div className="form-alert">{formError}</div> : null}
          {serverError ? <div className="form-alert form-alert-server">{serverError}</div> : null}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? 'Working...'
              : mode === 'login'
                ? 'Log In'
                : 'Create Account'}
          </button>
        </form>

        <button className="ghost-button" onClick={handleModeChange} type="button">
          {mode === 'login'
            ? 'Need an account? Register'
            : 'Already registered? Log in'}
        </button>
      </div>
    </div>
  );
}
