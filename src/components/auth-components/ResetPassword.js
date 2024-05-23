import React, {useState} from 'react';
import { useSearchParams } from "react-router-dom";
import '../../styles/Login.css';
import { confirmThePasswordReset } from '../../services/googleAuthService';

const ResetPassword = () => {
    const [credentials, setCredentials] = useState({
        password: '',
        confirmPassword: ''
    })
    const [reset, setReset] = useState(false);
    const searchParams = new URLSearchParams(window.location.search)
    let oobCode= searchParams.get('oobCode');

    const handleChange = (e) => {
        setCredentials({
            ...credentials, 
            [e.target.name]: e.target.value
        })
    };

    const validCredentials = () => {
        return (credentials.password === credentials.confirmPassword) && (oobCode);
    }

    const handleClick = (button_type) => {
        if (!validCredentials()){
            alert("Passwords did not match 🙃");
            return;
        }
        if(button_type === 'submit'){
            confirmThePasswordReset({oobCode, new_password: credentials.password});
            alert("Password reset successful!");
            setReset(true);
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
                            reset &&
                            <div className="reset-message">
                                <p>Password reset successful!</p>
                            </div>
                        }
                        <div className="password-1">
                            <label htmlFor="">Enter your new password</label>
                            <input type="password" name="password" value={credentials.password} onChange={handleChange}  />
                        </div>
                        <div className="password-2">
                            <label htmlFor="">Confirm your new password</label>
                            <input type="password" name="confirmPassword" value={credentials.confirmPassword} onChange={handleChange}  />
                        </div>
                        
                        <div className="reset-submit">
                            <button onClick={()=>handleClick('submit')}>Submit</button> 
                        </div>
                        
                    </div>
                    {/* <div className="create-account">
                        <a href="/login">Back to Login</a> 
                    </div> */}
                </div>
            </div>
        </div>
    </div>
  );
}

export default ResetPassword;