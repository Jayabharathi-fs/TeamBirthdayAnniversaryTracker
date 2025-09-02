import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Container,
  Typography,
  Box,
  Paper,
  Link,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "warning",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "warning",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "https://teambirthdayanniversarytracker.onrender.com/login",
        formData
      );
      setSnackbar({
        open: true,
        message: res.data.message,
        severity: "success",
      });
      setFormData({ username: "", password: "" });
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Login failed",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
            }}
          >
            Welcome to Kinship Calendar
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Please login to continue
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                borderRadius: 3,
                py: 1.2,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                "&:hover": {
                  background: "linear-gradient(90deg, #125699, #1976d2)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "text.secondary" }}
          >
            Don’t have an account?{" "}
            <Link
              component="button"
              variant="body2"
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/signup")}
            >
              Signup
            </Link>
          </Typography>
        </Paper>

        {/* Snackbar for feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Login;
