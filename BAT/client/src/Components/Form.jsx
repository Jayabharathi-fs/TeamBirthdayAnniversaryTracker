import React, { useState } from "react";
import axios from "axios";

//importing for material ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  MenuItem,
  Box,
  Button,
  Snackbar,
  Alert,
  //Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

//options for the Department field
const departments = [
  "Content Marketing",
  "Development",
  "HR",
  "QA-testing",
  "Sales",
  "Support",
];

export default function Form({ open, handleClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    dob: "",
    doj: "",
    photo: "https://example.com/default-photo.jpg",
  });

  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error dynamically as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) errors.name = true;
    if (!formData.email || !emailRegex.test(formData.email))
      errors.email = true;
    if (!formData.department) errors.department = true;
    if (!formData.dob || new Date(formData.dob) >= new Date())
      errors.dob = true;
    if (!formData.doj || new Date(formData.doj) >= new Date())
      errors.doj = true;

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields correctly",
        severity: "warning",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/employee`,
        formData
      );
      setSnackbar({
        open: true,
        message: res.data.message || "Employee added successfully!",
        severity: "success",
      });

      setTimeout(() => {
        handleClose();
        setFormData({
          name: "",
          email: "",
          department: "",
          dob: "",
          doj: "",
          photo: "https://example.com/default-photo.jpg",
        });
        setFormErrors({});
      }, 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Submission failed",
        severity: "error",
      });
    }
  };

  // Helper to generate red outline styles for errors
  const getFieldStyles = (fieldName) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": {
        borderColor: formErrors[fieldName] ? "red" : "#c4c4c4",
      },
      "&:hover fieldset": {
        borderColor: formErrors[fieldName] ? "red" : "#0072ff",
      },
      "&.Mui-focused fieldset": {
        borderColor: formErrors[fieldName] ? "red" : "#0072ff",
      },
    },
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Add Employee
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: "#f9fafc" }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              label="Name*"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!formErrors.name}
              sx={getFieldStyles("name")}
            />

            <TextField
              label="Email*"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!formErrors.email}
              sx={getFieldStyles("email")}
            />

            <TextField
              select
              label="Department*"
              name="department"
              value={formData.department}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!formErrors.department}
              sx={getFieldStyles("department")}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Date of Birth*"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              error={!!formErrors.dob}
              sx={getFieldStyles("dob")}
            />

            <TextField
              label="Date of Joining*"
              name="doj"
              type="date"
              value={formData.doj}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              error={!!formErrors.doj}
              sx={getFieldStyles("doj")}
            />

            <TextField
              label="Photo URL"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={getFieldStyles("photo")}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                alignSelf: "flex-end",
                mt: 2,
                borderRadius: "10px",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0072ff 0%, #0044cc 100%)",
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity || "warning"}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ zIndex: 9999, width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
