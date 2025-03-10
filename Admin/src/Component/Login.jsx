import React, { useState } from 'react';
import axios from 'axios';
import "../Login.css"
import { useNavigate } from 'react-router-dom';

export const Login = ({ setisadminlogin }) => {
  const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL

  const [checkvalue, setcheckvalue] = useState({ email: '', pass: '' });
  const navigate = useNavigate();

  const handelinput = (e) => {
    setcheckvalue({ ...checkvalue, [e.target.name]: e.target.value });
  }

  const handlesubmit = (e) => {
    e.preventDefault();
    axios.post(`${Backend_url}/login`, checkvalue)
      .then(result => {
        if (result.data.message === "Success") {
          console.log(result.data.adminName)
          localStorage.setItem('isadminlogin', 'true');
          localStorage.setItem('adminName', result.data.adminName); // Save the admin's name
          setisadminlogin(true);
          navigate('/admin/dashboard');
        }
      })
      .catch(error => console.log(error));
  };
  

  return (
    <div>

      <div className='back'>
        <div className="login-page container1 ">
          <div className="form">
            <form onSubmit={handlesubmit} className="login-form">
              <input type="email" name="email" placeholder="Email" value={checkvalue.email} onChange={handelinput} />
              <input type="password" name="pass" placeholder="Password" value={checkvalue.pass} onChange={handelinput} />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>

    </div>
  );
};
