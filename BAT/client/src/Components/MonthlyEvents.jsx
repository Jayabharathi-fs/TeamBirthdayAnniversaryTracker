import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";

const MonthlyEvents = () => {
  const [monthEvents, setMonthEvents] = useState([]);

  useEffect(() => {
    const fetchMonthEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/events/month");
        setMonthEvents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch this month's events", err);
      }
    };
    fetchMonthEvents();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 4, mt: 2, width: "100%" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 4, textAlign: "center", color: "primary.main" }}
      >
        🎉 This Month’s Celebrations
      </Typography>

      {monthEvents.length > 0 ? (
        <Grid container spacing={4} justifyContent="center">
          {monthEvents.map((emp, idx) => {
            const dob = emp.dob ? new Date(emp.dob) : null;
            const doj = emp.doj ? new Date(emp.doj) : null;

            return (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                    transition: "0.3s",
                    textAlign: "center",
                    p: 3,
                    "&:hover": { transform: "translateY(-6px)", boxShadow: 8 },
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    src={emp.photo || ""}
                    sx={{
                      bgcolor: "#1976d2",
                      width: 80,
                      height: 80,
                      fontSize: "2rem",
                      margin: "0 auto",
                      mb: 2,
                    }}
                  >
                    {!emp.photo && emp.name ? emp.name.charAt(0) : ""}
                  </Avatar>

                  {/* Name & Department */}
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "text.primary" }}
                  >
                    {emp.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 2 }}
                  >
                    {emp.department}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Details */}
                  {dob && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      🎂 Birthday:{" "}
                      {dob.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  )}
                  {doj && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      ❤️ Anniversary:{" "}
                      {doj.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontStyle: "italic", color: "text.secondary" }}
                  >
                    ✉️ {emp.email}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No events"
            width={200}
            style={{ opacity: 0.8 }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            No events this month ✨
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MonthlyEvents;
