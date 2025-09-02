import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/Components/Home";
import Signup from "../src/Components/Signup";
import Login from "../src/Components/Login";
import Dashboard from "../src/Components/Dashboard";
import Form from "../src/Components/Form";
import Table from "../src/Components/Table";
import Notfound from "../src/Components/Notfound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form" element={<Form />} />
        <Route path="/table" element={<Table />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;
