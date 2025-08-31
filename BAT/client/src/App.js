import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/Components/Home";
import Signup from "../src/Components/Signup";
import Login from "../src/Components/Login";
import Dashboard from "../src/Components/Dashboard";
import Form from "../src/Components/Form";
import Table from "../src/Components/Table";
//import Card from "../src/Components/Card";
//import Calendar from "../src/Components/Calendar";
import Todaycards from "../src/Components/TodayCards";
import Monthlyevents from "../src/Components/MonthlyEvents";
import Notfound from "../src/Components/Notfound";
import { Container } from "@mui/material";

function App() {
  return (
    <Router>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form" element={<Form />} />
          <Route path="/table" element={<Table />} />
          {/*<Route path="/card" element={<Card />} />
          <Route path="/calendar" element={<Calendar />} /> */}
          <Route path="/todaycards" element={<Todaycards />} />
          <Route path="/monthlyevents" element={<Monthlyevents />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
