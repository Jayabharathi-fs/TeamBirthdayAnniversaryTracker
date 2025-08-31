import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const BASE_URL = "https://teambirthdayanniversarytracker.onrender.com"; // adjust if different

const TodayCards = ({ todayEvents }) => {
  const [open, setOpen] = useState(null);

  const handleExpandClick = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <Box
      sx={{
        backgroundColor: "green", // page background green
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Grid container spacing={3} justifyContent="flex-end">
        {todayEvents.map((event, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                "&:hover": { boxShadow: 8 },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 56,
                    height: 56,
                    mr: 2,
                    fontSize: "1.2rem",
                  }}
                >
                  {event.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.occasion}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleExpandClick(index)}>
                  <ExpandMoreIcon />
                </IconButton>
              </CardContent>
              <Collapse in={open === index}>
                <CardContent>
                  <Typography variant="body2">
                    Department: {event.department}
                  </Typography>
                  <Typography variant="body2">Email: {event.email}</Typography>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TodayCards;
