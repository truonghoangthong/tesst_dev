import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar"; 
import Header from "./components/header";
import Home from './Dashboard/Home/home';  
import Footer from "./components/footer";

const App = () => {
  return (
    <Router>
      <Header />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/rooms" element={<span>Rooms</span>} />
          <Route path="/admin/reports" element={<span>Reports</span>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
