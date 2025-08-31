import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Paper,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const columns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "dob", headerName: "Date of Birth", flex: 1 },
  { field: "daysLeft", headerName: "Days Left", flex: 1 },
];

const paginationModel = { page: 0, pageSize: 5 };

const Birthday = ({ open, handleClose }) => {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBirthdays = async (query = "") => {
    try {
      const res = await axios.get("http://localhost:5000/employee/birthdays", {
        params: { search: query },
      });

      const formattedRows = res.data.map((emp) => ({
        id: emp._id,
        name: emp.name,
        email: emp.email,
        dob: new Date(emp.dob).toLocaleDateString(),
        daysLeft: emp.daysLeft,
      }));
      setRows(formattedRows);
    } catch (err) {
      console.error("Error fetching birthdays:", err);
    }
  };

  useEffect(() => {
    if (open) fetchBirthdays(searchQuery);
  }, [open, searchQuery]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
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
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Upcoming Birthdays 🎂
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, backgroundColor: "#f9fafc" }}>
          {/* Search bar */}
          <TextField
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              mb: 2,
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Paper
            sx={{
              height: 400,
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              "& .MuiDataGrid-cell": { py: 1 },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f1f5fb",
                fontWeight: "bold",
                fontSize: "0.95rem",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f0f8ff",
                transform: "scale(1.01)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              sx={{
                border: 0,
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "#f9fafc",
                },
              }}
            />
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Birthday;
