import React, {useState} from 'react';
import '../../styles/Login.css';
import { sendThePasswordResetEmail } from '../../services/googleAuthService';

const ForgotPassword = () => {
    const [credentials, setCredentials] = useState({
        user_email: ''
    })
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials, 
            [e.target.name]: e.target.value
        })
    };

    const validateCredentials = () => {
        for (const [key, value] of Object.entries(credentials)) {
            if (value === ''){
                return false;
            }
        }
        return true;
    }

    const handleClick = (button_type) => {
        if (!validateCredentials()){
            alert("Please enter email address");
            return;
        }
        if(button_type === 'submit'){
            sendThePasswordResetEmail(credentials);
            alert("Password reset email sent!");
            setSent(true);
        }
    }

  return (
    <div className="login-main">
        <div className="content-wrapper">
            <div className="left-wrapper">
                <div className="left-content-wrapper">
                    <div className="image-wrapper">
                        <img src="./images/login-working-guy.png" alt="Working Kid" />
                    </div>
                    <div className="image-below-text-wrapper">
                        <h2>Get It Done Club</h2>
                        <p>Unleash Your Academic and Professional Success with Get It Done Club's Productivity Excellence Platform</p>
                    </div>
                </div>
            </div>
            <div className="right-wrapper">
                <div className="right-content-wrapper">
                    <div className="logo-title">
                        <h2>Get It Done ✅</h2>
                    </div>
                    <div className="login-form">

                        {
                            sent &&
                            <div className="sent-message">
                                <p>Password reset email sent!</p>
                            </div>
                        }
                        <div className="user-email">
                            <label htmlFor="">Enter your email</label>
                            <input type="email" name="user_email" value={credentials.user_email} onChange={handleChange}  />
                        </div>
                        
                        <div className="sign-in-button">
                            <button onClick={()=>handleClick('submit')}>Submit</button> 
                        </div>

                        <div className="or">
                            <span class="or-before"></span>
                            <p>or</p>
                            <span class="or-after"></span>
                        </div>
                        
                    </div>
                    <div className="create-account">
                        <a href="/login">Back to Login</a> 
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ForgotPassword;