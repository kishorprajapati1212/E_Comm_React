import React, { useState } from 'react';
import { Grid, Box, TextField, Button, Typography } from '@mui/material';
import { Theme } from '../Theme';
import { useTheme } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertPopup from '../Component/Aleart/Alertmess';
import Rive from '@rive-app/react-canvas';

const Signin = () => {
    const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL

    const theme = useTheme();
    const colors = Theme(theme.palette.mode);

    const [signin, setsignin] = useState({ username: '', email: '', password: '' });
    const [alertMessage, setAlertMessage] = useState({ message: "", severity: "", open: false });
    const navigate = useNavigate();

    const handleSign = (e) => {
        setsignin({ ...signin, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!signin.username || !signin.email || !signin.password) {
            setAlertMessage({ message: "All fields are required.", severity: "error", open: true });
            return;
        }

        const trimpassword = signin.password.trim();
        if (trimpassword.length <= 8) {
            setAlertMessage({ message: "Password must be 8 charcter.", severity: "error", open: true });
            return;
        }

        // Validate email
        if (!validateEmail(signin.email)) {
            setAlertMessage({ message: "Invalid email address.", severity: "error", open: true });
            return;
        }

        try {
            const response = await axios.post(`${Backend_url}/usersignin`, signin);
            console.log(response.data.error)

            if (response && response.data && response.data.status === 600) {
                setAlertMessage({ message: "Email is already registered.", severity: "error", open: true });
                return;
            } else if (response && response.data) {
                setAlertMessage({ message: "User registered successfully! Redirecting to login page...", severity: "success", open: true });

                // Redirect to login page after a delay
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setAlertMessage({ message: "Email is already registered.", severity: "error", open: true });
        }
    };

    return (
        <>
            <Grid container spacing={0} direction="row" alignItems="center" justifyContent="center" sx={{ height: '80vh' }}>
                <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" alignItems="center" sx={{ pr: 1 }}>
                    <Box sx={{ width: '100%', maxWidth: '400px', height: '500px', mb: "10%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Rive src="/Rive/Login.riv" sx={{ height: "100%", background: "rgba(40,40,50,0.3)" }} stateMachines="Baller" />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', pr: 1 }}>

                <Box sx={{
                    border: '1/5px solid black', padding: '20px', borderRadius: '8px', textAlign: 'center',
                    background: `linear-gradient(to left, ${colors.primary[10]}, ${colors.grey[10]})`,
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)', maxWidth: '700px'
                }}
                >
                        <h1>Sign in</h1>
                        <TextField label="Username" variant="outlined" fullWidth margin="normal" name="username"
                            value={signin.username} onChange={handleSign} required
                        />
                        <TextField label="Email" variant="outlined" type="email" fullWidth margin="normal" name="email"
                            value={signin.email} onChange={handleSign} required
                        />
                        <TextField label="Password" variant="outlined" type="password" fullWidth margin="normal" name="password"
                            value={signin.password} onChange={handleSign} required
                        />
                        <Button
                            variant="contained"
                            style={{ backgroundColor: colors.blueAccent[600], color: '#fff' }}
                            onClick={handleSubmit}
                            sx={{ mt: 2, fontSize: "18px" }}
                        >
                            Sign In
                        </Button>

                        {/* Conditionally render AlertPopup */}
                        {alertMessage.open && (
                            <AlertPopup message={alertMessage.message} severity={alertMessage.severity} open={alertMessage.open} setOpen={setAlertMessage} />
                        )}

                        <Box>
                            <Typography variant="small">
                                Did you Already login? - <Link to="/login" style={{ color: colors.greenAccent[200] }}>Login </Link>
                            </Typography>
                        </Box>
                </Box>
            </Grid >
        </Grid >
        </>
    );
};

export default Signin;
