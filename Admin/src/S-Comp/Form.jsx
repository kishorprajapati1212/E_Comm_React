import { Box, Button, TextField, useTheme, Typography } from "@mui/material";
import Header from "./Header";
import { useState } from "react";
import { Theme } from "../Theme";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form1 = () => {
    const Backend_url =  import.meta.env.VITE_REACT_BACKEND_URL 

    const theme = useTheme();
    const colors = Theme(theme.palette.mode);
    const navigate = useNavigate();

    const [formvalues, setformvalues] = useState({
        fname: "",
        email: "",
        pass: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setformvalues({ ...formvalues, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(formvalues);

        axios.post(`${Backend_url}/signin`, formvalues)
            .then(result => {
                console.log(result);
                setformvalues({ fname: "", email: "", pass: "" });
                navigate('/admin/form');
            })
            .catch(error => console.log(error));
    };

    return (
        <Box m="20px">
            <Header title="CREATE USER" subtitle="Create a New User Profile" />

            <Box
                component="form"
                onSubmit={handleFormSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    mt: "20px",
                    p: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 40px 120px rgba(0, 0, 0, 0.1)",
                    maxWidth: "400px",
                    mx: "auto",
                    bgcolor: colors.primary[400]
                }}
            >
                <Typography variant="h5" color={colors.greenAccent[500]} textAlign="center">
                    User Information
                </Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    label="First Name"
                    name="fname"
                    value={formvalues.fname}
                    onChange={handleInputChange}
                />

                <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    name="email"
                    type="email"
                    value={formvalues.email}
                    onChange={handleInputChange}
                />

                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    name="pass"
                    type="password"
                    value={formvalues.pass}
                    onChange={handleInputChange}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ mt: "20px", py: "10px" }}
                >
                    Create New User
                </Button>
            </Box>
        </Box>
    );
};

export default Form1;
