// Login.js
import React, { useState } from 'react';
import { Grid, Box, TextField, Button, Typography } from '@mui/material';
// import { Close as CloseIcon } from '@mui/icons-material';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { loginuser } from '../Store/UserSlice';
import axios from 'axios';
import AlertPopup from '../Component/Aleart/Alertmess';
import Rive from '@rive-app/react-canvas';

const Login = () => {
  const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL

  const theme = useTheme();
  const colors = Theme(theme.palette.mode);
  const [login, setLogin] = useState({ email: '', password: '' });
  // const [user, setuser] = useState({ email: '', username: "" });
  // const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [alertmessage, setalertmessage] = useState({ message: "", severity: "", open: false })


  const handleLogin = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Backend_url}/logincheck`, login);

      if (response && response.error) {
        setalertmessage({ message: "Invalid credentials Try Again", severity: "error", open: true });
      } else {
        setalertmessage({ message: "Login Success", severity: "success", open: true });
      }
      const user = response.data;

      // Dispatch the user data to Redux store
      await dispatch(loginuser({ user: user }));

      if (response.data) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        // Set reload status to true for Navbar
        localStorage.setItem('reloadNavbar', 'true');

        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setalertmessage({ message: "Login failed. Please try again.", severity: "error", open: true });
    }
  };


  return (
    <Grid container spacing={0} direction="row" alignItems="center" justifyContent="center" sx={{ height: '80vh', gap: 0 }}>
      {/* Left side: Rive animation */}
      <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" alignItems="center" sx={{pr:1}}>
        <Box sx={{ width: '100%',maxWidth: '400px', height: '500px', mb:"10%",display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Rive src="/Rive/Login.riv" sx={{height:"100%", background: "rgba(40,40,50,0.3)"}}  stateMachines="Baller"/>
        </Box>
      </Grid>

      {/* Right side: Login form */}
      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pr: 1 }}>
        <Box sx={{ border: '1.5px solid black', padding: '20px', borderRadius: '8px', textAlign: 'center', background: `linear-gradient(to left, ${colors.primary[10]}, ${colors.grey[10]})`, boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)' }}>
          <h1>Login</h1>
          <TextField label="Email" variant="outlined" type="email" fullWidth margin="normal" onChange={handleLogin} name="email"
            value={login.email}
          />

          <TextField label="Password" variant="outlined" type="password" fullWidth margin="normal" onChange={handleLogin} name="password"
            value={login.password}
          />

          <Button variant="contained" style={{ backgroundColor: colors.blueAccent[600], color: '#fff' }}
            onClick={handlesubmit} sx={{ mt: 2, fontSize: '18px' }}
          >
            Login
          </Button>
          <Box>
            <Typography variant="h6">
              Did you Sign Up? -{' '}
              <Link to="/signin" style={{ color: colors.greenAccent[200] }}>
                SignIn Page
              </Link>
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">
              Do not remember your password? -{' '}
              <Link to="/forgot_password" style={{ color: colors.greenAccent[200] }}>
                Forgot Password
              </Link>
            </Typography>
          </Box>
          {/* Conditionally render AlertPopup */}
          {alertmessage.open && (
            <AlertPopup message={alertmessage.message} severity={alertmessage.severity} open={alertmessage.open} setOpen={setalertmessage} />
          )}
        </Box>
      </Grid>
    </Grid>

  );

};

export default Login;
