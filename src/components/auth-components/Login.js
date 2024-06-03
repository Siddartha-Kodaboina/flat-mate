import React, { useState } from 'react';
import '../../styles/Login.css';
import { signInWithGoogle, signUpWithEmailAndPassword, signInWithCustomEmailAndPassword } from '../../services/googleAuthService';

const Login = () => {
  const [isLoginOn, setIsLoginOn] = useState(true);
  const [credentials, setCredentials] = useState({
    user_name: '',
    user_pwd: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const validateCredentials = () => {
    for (const [key, value] of Object.entries(credentials)) {
      if (value === '') {
        return false;
      }
    }
    return true;
  };

  const handleClick = (button_type) => {
    if (!validateCredentials()) {
      alert("Please enter both username and password.");
      return;
    }
    if (button_type === 'sign_in') {
      signInWithCustomEmailAndPassword(credentials);
    } else if (button_type === 'sign_up') {
      signUpWithEmailAndPassword(credentials);
    }
  };

  return (
    <div className="login-main">
      <div className="content-wrapper">
        <div className="right-wrapper">
          <div className="right-content-wrapper">
            <div className="logo-title">
              <h1>FlatMate 🏘️</h1>
            </div>
            <div className="login-form">
              <div className="user-email">
                <input
                  name="user_name"
                  value={credentials.user_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Username or email"
                  required
                />
                <label htmlFor="user_name">Username or email</label>
              </div>
              <div className="password">
                <input
                  name="user_pwd"
                  value={credentials.user_pwd}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  required
                />
                <label htmlFor="user_pwd">Password</label>
                
              </div>
              <a href="/forgot-password" id="forgot-password">forgot password</a>
              <div className="sign-in-button">
                {isLoginOn ? (
                  <button onClick={() => handleClick('sign_in')}>Sign in</button>
                ) : (
                  <button onClick={() => handleClick('sign_up')}>Sign up</button>
                )}
              </div>
              <div className="or">
                <span className="or-before"></span>
                <p>or</p>
                <span className="or-after"></span>
              </div>
              <div className="sign-in-with-google">
                <button onClick={signInWithGoogle}>
                  <img src="./images/google-icon.png" alt="Google Logo" /> Sign in with Google
                </button>
              </div>
            </div>
            <div className="create-account">
              {isLoginOn ? (
                <a onClick={() => setIsLoginOn(false)} href="#">
                  Are you new? Create an Account
                </a>
              ) : (
                <a onClick={() => setIsLoginOn(true)} href="#">
                  Already have an account? Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
