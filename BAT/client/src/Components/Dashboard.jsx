// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

import Form from "./Form.jsx";
import Table from "./Table.jsx";
import Birthday from "./Birthday.jsx";
import Anniversary from "./Anniversary.jsx";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openTable, setOpenTable] = useState(false);
  const [openBirthday, setOpenBirthday] = useState(false);
  const [openAnniversary, setOpenAnniversary] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const [todayEvents, setTodayEvents] = useState([]);
  const [monthEvents, setMonthEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://teambirthdayanniversarytracker.onrender.com/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage(res.data.message);
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Session expired. Please login again.",
          severity: "warning",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      }
    };
    fetchDashboard();
  }, [navigate]);

  const fetchMonthEvents = async (query = "") => {
    try {
      const res = await axios.get(
        "https://teambirthdayanniversarytracker.onrender.com/events/month",
        {
          params: { search: query },
        }
      );
      setMonthEvents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch month events", err);
    }
  };

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        const todayRes = await axios.get(
          "https://teambirthdayanniversarytracker.onrender.com/events/today"
        );
        setTodayEvents(todayRes.data || []);
      } catch (err) {
        console.error("Failed to fetch today’s events", err);
      }
    };

    fetchTodayEvents();
    fetchMonthEvents();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchMonthEvents(value);
  };

  const handleSidebarClick = (text) => {
    if (text === "Logout") {
      setOpenLogoutDialog(true);
    } else if (text === "Add Employee") {
      setOpenForm(true);
    } else if (text === "Employee Directory") {
      setOpenTable(true);
    } else if (text === "Birthdays") {
      setOpenBirthday(true);
    } else if (text === "Anniversaries") {
      setOpenAnniversary(true);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Topbar */}
      <header className="topbar">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <div className="topbar-content">
          <span className="user-icon">👤</span>
          <h2>{message}</h2>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => handleSidebarClick("Birthdays")}>🎂 Birthdays</li>
          <li onClick={() => handleSidebarClick("Anniversaries")}>
            ❤️ Anniversaries
          </li>
          <li onClick={() => handleSidebarClick("Employee Directory")}>
            👥 Employee Directory
          </li>
          <li onClick={() => handleSidebarClick("Add Employee")}>
            ➕ Add Employee
          </li>
          <li onClick={() => handleSidebarClick("Logout")}>↪ Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        <div>
      {todayEvents.length > 0 && (
        <div className="banner">
          {todayEvents.length} event(s) today!
        </div>
      )}

      {/* Render events list here */}
    </div>
        {/* Today’s Celebrations */}
        <section className="events-section">
          <h2>🎉 Today’s Celebrations</h2>
          {todayEvents.length > 0 ? (
            <div className="events-grid">
              {todayEvents.map((event) => (
                <div key={event._id} className="event-card today-card">
                  <div className="avatar">
                    {event.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="event-info">
                    <h3>
                      Happy{" "}
                      {new Date(event.dob).getDate() === new Date().getDate()
                        ? "Birthday"
                        : "Work Anniversary"}
                      , {event.name}! 🎊
                    </h3>
                    <p>{event.department}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-events">No celebrations today.</p>
          )}
        </section>

        {/* This Month’s Celebrations */}
        <section className="events-section">
          <h2>📅 This Month’s Celebrations</h2>

          {/* 🔹 Search Bar */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
          />

          {monthEvents.length > 0 ? (
            <div className="events-grid">
              {monthEvents.map((event) => (
                <div key={event._id} className="event-card month-card">
                  <div className="avatar small">
                    {event.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="event-info">
                    <h4>{event.name}</h4>
                    <p>{event.department || "N/A"}</p>
                    <p>
                      DOB:{" "}
                      {event.dob
                        ? new Date(event.dob).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      DOJ:{" "}
                      {event.doj
                        ? new Date(event.doj).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="event-type">
                      {new Date(event.dob).getMonth() === new Date().getMonth()
                        ? "🎂 Birthday"
                        : "❤️ Anniversary"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-events">No celebrations this month.</p>
          )}
        </section>
      </main>

      {/* Modals */}
      {openBirthday && (
        <Birthday
          open={openBirthday}
          handleClose={() => setOpenBirthday(false)}
        />
      )}
      {openAnniversary && (
        <Anniversary
          open={openAnniversary}
          handleClose={() => setOpenAnniversary(false)}
        />
      )}
      {openTable && (
        <Table open={openTable} handleClose={() => setOpenTable(false)} />
      )}
      {openForm && (
        <Form open={openForm} handleClose={() => setOpenForm(false)} />
      )}

      {/* Logout Dialog */}
      {openLogoutDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="dialog-actions">
              <button onClick={() => setOpenLogoutDialog(false)}>Cancel</button>
              <button className="danger" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`snackbar ${snackbar.severity}`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
