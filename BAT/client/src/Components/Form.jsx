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

  // Snackbar included
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation for email and past dates
  const validateForm = () => {
    const { name, email, department, dob, doj } = formData;

    if (!name || !email || !department || !dob || !doj) {
      return "All fields are required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address.";
    }

    const today = new Date();

    if (new Date(dob) >= today) {
      return "Date of Birth must be in the past.";
    }

    if (new Date(doj) >= today) {
      return "Date of Joining must be in the past.";
    }

    return null;
  };

  /*
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setSnackbar({ open: true, message: error });
      return;
    }

    console.log("Form submitted:", formData);
    handleClose();
  };
  */

  //Added for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setSnackbar({ open: true, message: error, severity: "warning" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/employee", formData);
      setSnackbar({
        open: true,
        message: res.data.message,
        severity: "success",
      });
      handleClose(); // closing the dialog
      setFormData({
        // reset form
        name: "",
        email: "",
        department: "",
        dob: "",
        doj: "",
        photo: "https://example.com/default-photo.jpg",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Submission failed",
        severity: "error",
      });
    }
  };

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

        <DialogContent
          dividers
          sx={{
            backgroundColor: "#f9fafc",
          }}
        >
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
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&:hover fieldset": {
                    borderColor: "#0072ff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0072ff",
                  },
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "&:hover fieldset": {
                    borderColor: "#0072ff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#0072ff",
                  },
                },
              }}
            />
            <TextField
              select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
            <TextField
              label="Date of Joining"
              name="doj"
              type="date"
              value={formData.doj}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />
            <TextField
              label="Photo URL"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
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

      {/* Snackbar for validation errors 
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity || "warning"} // <-- dynamic severity
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
