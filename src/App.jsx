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
  const [privilege, setPrivilege] = useState("admin");  // Mặc định là admin

  useEffect(() => {
    startFetching(); 
  }, [startFetching]);

  return (
    <Router>
      <AppContent privilege={privilege} setPrivilege={setPrivilege} />
    </Router>
  );
};

const AppContent = ({ privilege, setPrivilege }) => {
  const location = useLocation();  
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (isLoginPage) {
      setPrivilege("unknown");
    } else if (privilege === "unknown") {
      // Khôi phục quyền admin sau khi login thành công
      setPrivilege("admin");
    }
  }, [isLoginPage, privilege, setPrivilege]);

  return (
    <div>
      {/* Hiển thị Header cho mọi quyền, nhưng nếu là trang Login, dùng quyền admin */}
      <Header privilege={isLoginPage ? "admin" : privilege} />

      {/* Nếu không phải trang Login và quyền không phải "unknown", hiển thị Sidebar */}
      {!isLoginPage && privilege !== "unknown" && <Sidebar privilege={privilege} />} 

      {/* Điều chỉnh layout dựa trên việc có Sidebar hay không */}
      <div className={`content ${isLoginPage || privilege === "unknown" ? 'no-left-padding' : ''}`}>
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

      {/* Ẩn Footer cho trang Login */}
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default App;
