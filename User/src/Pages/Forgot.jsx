import React, {  useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Forgot = () => {
  const Backend_url = import.meta.env.VITE_REACT_BACKEND_URL

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter code, Step 3: Enter new password
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setError(''); 
        setLoading(true); // Start loading

        try {
            const response = await axios.post(`${Backend_url}/getuser`, { email });
            // console.log(response.data);

            if (response.data.mtype !== "success") {
                const responseError = response.data.message;
                setError(responseError);
                setStep(1);
            } else {
                const randomCode = Math.floor(100000 + Math.random() * 900000);
                // console.log(randomCode);

                const emailResponse = await axios.post(`${Backend_url}/sendmail`, { randomCode, email });

                if (emailResponse.data.mtype === "success") {
                    setStep(2);
                } else {
                    setError(emailResponse.data.message);
                    setStep(1);
                }
            }
        } catch (error) {
            setError("Internal error");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Start loading

        try {
            const response = await axios.post(`${Backend_url}/codecheck`, { code, email });
            // console.log(response.data);

            const responseData = response.data;
            // console.log(responseData.status);
            // console.log(responseData.message);

            if (responseData.mtype === "success") {
                setStep(3);
            } else if (responseData.mtype === "warning") {
                setError(responseData.message);
            } else {
                setError("Internal error occurred");
            }
        } catch (error) {
            // console.error(error);
            setError("Invalid code try again");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSubmitNewPassword = async(e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Start loading

        try {
            const response = await axios.post(`${Backend_url}/updatepass`, {newPassword, email})
            // console.log(response.data)
            if(response.data.mtype !== "success"){
                setError(response.data.message);
            } else {
                navigate("/login");
            }
        } catch (error) {
            setError("Internal Error");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="75vh" sx={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)' }}>
            <Box p={3} border="1px solid black" sx={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)' }}>
                {step === 1 && (
                    <form onSubmit={handleSubmitEmail} >
                        <Typography variant="h5" gutterBottom textAlign={"center"}>
                            Forgot Password
                        </Typography>
                        {error && (
                            <Typography variant="h5" gutterBottom color="red">
                                {error}
                            </Typography>
                        )}

                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Next"}
                        </Button>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleSubmitCode} >
                        <Typography variant="h5" gutterBottom textAlign={"center"}>
                            Enter Verification Code
                        </Typography>
                        {error && (
                            <Typography variant="h5" gutterBottom color="red">
                                {error}
                            </Typography>
                        )}

                        <TextField
                            label="Verification Code"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Verify"}
                        </Button>
                    </form>
                )}
                {step === 3 && (
                    <form onSubmit={handleSubmitNewPassword}>
                        <Typography variant="h5" gutterBottom textAlign={"center"}>
                            Set New Password
                        </Typography>
                        {error && (
                            <Typography variant="h5" gutterBottom color="red">
                                {error}
                            </Typography>
                        )}
                        <TextField
                            label="New Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Update Password"}
                        </Button>
                    </form>
                )}
            </Box>
        </Box>
    );
};

export default Forgot;