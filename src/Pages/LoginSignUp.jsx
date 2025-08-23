import React from 'react'
import './CSS/LoginSignup.css'

const LoginSignUp = () => {
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>Sign Up</h1>
        <div className="loginsignup-fields">
          <input type='text' placeholder='Enter Your Name'/>
          <input type='email' placeholder='Enter Your Email' />
          <input type='password' placeholder='Enter Your Password' /> 
          <button>Continue</button>
          <p className="loginsignup-login">Already Have an Account? <span>Login Here</span></p>
        </div>
        <div className="loginsignup-agree">
          <input type='checkbox' name='' id='' />
          <p>By continuing,I agree to the Terms & Conditions and Privacy Policy </p>
        </div>
      </div>

    </div>
  );
}
export default LoginSignUp;