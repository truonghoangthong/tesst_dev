import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
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
import BookingCalendar from "./components/clientpage/sauna";
import LoginPage from "./components/loginPage";

const App = () => {
  const { startFetching } = useDataStore();
  const [privilege, setPrivilege] = useState("admin");  
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth <= 767);  

  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth <= 767);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    startFetching(); 
  }, [startFetching]);

  return (
    <Router>
      <AppContent privilege={privilege} isMobileSize={isMobileSize} />
    </Router>
  );
};

const AppContent = ({ privilege, isMobileSize }) => {
  const location = useLocation();  
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {!isLoginPage && <Header privilege={privilege} />} 
      {!isLoginPage && <Sidebar privilege={privilege} />} 

      <div 
        className={`content ${isMobileSize || isLoginPage ? 'no-left-padding' : ''}`}  
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/rooms" element={<Rooms />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/info" element={<Info />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/complaints" element={<Complaints />} />
          <Route path="/client/sauna" element={<BookingCalendar />} />
          <Route path="/client/laundry" element={<span>Laundry</span>} />
          <Route path="/client/info" element={<span>Client Info</span>} />
          <Route path="/client/complaint" element={<span>Client Complaints</span>} />
        </Routes>
      </div>

      {!isLoginPage && <Footer />}
    </div>
  );
};

export default App;
