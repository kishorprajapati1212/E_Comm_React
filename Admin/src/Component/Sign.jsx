import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Sign = () => {
    const Backend_url =  import.meta.env.VITE_REACT_BACKEND_URL 
    
    const [formvalue, setformvalue] = useState({fname:'',email:'',pass:''});
    const navigate = useNavigate();
    console.log("this is the signin of the admin ")

    const handelinput = (e) =>{
        setformvalue({ ...formvalue, [e.target.name]:   e.target.value});
    }

    const handlesubmit = (e) =>{
      e.preventDefault();
      axios.post(`${Backend_url}/signin`,formvalue)
      .then(result => {console.log(result)
          navigate('/login')
      })
      .catch(error => console.log(error))
    }

    
  return (
    <>
      <form onSubmit={handlesubmit}>
        <label htmlFor="firstname">First name: </label>
        <input type="text" name="fname" value={formvalue.fname} onChange={handelinput}   />
        <br />
        <label htmlFor="email">Email: </label>
        <input type="email" name="email" value={formvalue.email} onChange={handelinput}   />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password" name="pass" value={formvalue.pass} onChange={handelinput}  />
        <br />
        <input type="submit" value="SignUp!" />
        
      </form>
      <button><Link to="/login"> Login </Link></button>
    </>
  );
};
