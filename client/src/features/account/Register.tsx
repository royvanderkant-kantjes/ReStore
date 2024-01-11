import { LockOutlined, Pattern } from "@mui/icons-material";
import { Container, Avatar, Typography, Box, TextField, Grid, Paper, Alert, AlertTitle, List, ListItem, ListItemText } from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../api/agent";
import { useState } from "react";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";

export default function Register() {
    const navigate = useNavigate();
    const {register, handleSubmit, setError, formState: {isSubmitting, errors, isValid}} = useForm({
        mode:"onTouched"
    });

    function handleApiErrors(errors: any) {
        if(errors){
            errors.forEach((error: string) => {
                console.log(error);
                if(error.includes("Password")){
                    setError("password",{message: error})
                } else if (error.includes("Email")) {
                    setError("email",{message: error})
                } else if (error.includes("Username")) {
                    setError("username",{message: error})
                }
            });
        }
        console.log(errors);
    }

    async function submitForm(data: FieldValues) {
       agent.Account.register(data)
       .then( ()=> {
            toast.success("Registration succesful - you can now login")
            navigate("/login");
       })
       .catch(error => handleApiErrors(error));
    }

    return (
        <Container component={Paper}
            maxWidth="sm"
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
                Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    autoFocus
                    {...register("username",{required: "Username is required"})}
                    error={!!errors.username}
                    helperText={errors?.username?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    {...register("email",{
                        required: "Email is required",
                        pattern:{
                            value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                            message: "Not a valid email address"
                        }
                    })}
                    error={!!errors.email}
                    helperText={errors?.email?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password",{
                        required: "Password is required",
                        pattern: {
                            value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                            message: "Password does not meet complexity requirement"
                        }
                    })}
                    error={!!errors.password}
                    helperText={errors?.password?.message as string}
                />
                <LoadingButton
                    loading={isSubmitting}
                    disabled={!isValid}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Register
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/login">
                            {"Already have an account? Sign In"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}