import React, {useState} from 'react';
import '../../styles/Login.css';
import { signInWithGoogle, signUpWithEmailAndPassword, signInWithCustomEmailAndPassword } from '../../services/googleAuthService';

const Login = () => {
    // const 
    const [isLoginOn, setIsLoginOn] = useState(true);
    const [credentials, setCredentials] = useState({
        user_name: '',
        user_pwd: ''
    })

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
            alert("Please enter both username and password.");
            return;
        }
        if(button_type === 'sign_in'){
            signInWithCustomEmailAndPassword(credentials);
        }
        else if (button_type === 'sign_up'){
            signUpWithEmailAndPassword(credentials);
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
                        <div className="user-email">
                            <label htmlFor="">Username or email</label>
                            <input name="user_name" value={credentials.user_name} onChange={handleChange} type="text" />
                        </div>
                        <div className="password">
                            <label htmlFor="">Password</label>
                            <input name="user_pwd" value={credentials.user_pwd} onChange={handleChange} type="password"/>
                            <a href="/forgot-password" id="forgot-password">forgot password</a>
                        </div>
                        
                        <div className="sign-in-button">
                            {
                                isLoginOn?
                                <button onClick={()=>handleClick('sign_in')} >Sign in</button> 
                                :
                                <button onClick={()=>handleClick('sign_up')} >Sign up</button>
                            }
                            
                        </div>
                        <div className="or">
                            <span class="or-before"></span>
                            <p>or</p>
                            <span class="or-after"></span>
                        </div>
                        <div className="sign-in-with-google">
                            <button onClick={signInWithGoogle}><img src="./images/google-icon.png" alt="Google Logo"  /> {'    '} Sign in with Google</button>
                        </div>
                    </div>
                    <div className="create-account">
                        {
                            isLoginOn?
                            <a onClick={()=>setIsLoginOn(false)} href="#">Are you new? Create an Account</a> 
                            :
                            <a onClick={()=>setIsLoginOn(true)} href="#">Already have an account? Login</a>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Login;