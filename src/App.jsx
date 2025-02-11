import React , { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar"; 
import Header from "./components/header";
import Home from './components/dashboard/home/home';  
import Rooms from "./components/dashboard/rooms/rooms";
import Reports from "./components/dashboard/home/reports";
import Bookings from "./components/dashboard/bookings";
import Info from "./components/dashboard/info/info";
import useDataStore from "./services/data";
import Footer from "./components/footer";
import Complaints from "./components/dashboard/complaints";

const App = () => {
  const { data, startFetching } = useDataStore();
  useEffect(() => {
    startFetching();
  }, [startFetching]);
  return (
    <Router>
      <Header />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/rooms" element={<Rooms />} />
          <Route path="/admin/reports" element={<Reports/>} />
          <Route path="/admin/info" element={<Info />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/complaints" element={<Complaints />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
