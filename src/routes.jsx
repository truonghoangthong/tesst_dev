import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/dashboard/home/home";
import Rooms from "./components/dashboard/rooms/rooms";
import Reports from "./components/dashboard/reports/reports";
import Bookings from "./components/dashboard/bookings";
import Info from "./components/dashboard/info/info";
import Complaints from "./components/dashboard/complaints";
import BookingCalendar from "./components/clientpage/sauna";
import ClientComplaint from "./components/clientpage/clientcomplaint/clientcomplaint";
import TvView from "./components/TV/tv";
import LoginPage from "./components/loginpage/loginPage";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Sidebar from "./components/sidebar/sidebar";

const PublicRoute = ({ element, user }) => {
  return user ? <Navigate to="/admin" /> : element;
};

const ProtectedLayout = ({ user, children }) => {
  const isAdmin = user?.isAdmin;

  return (
    <div className={`layout-container ${isAdmin ? "admin" : "client"}`}>
      <Header isAdmin={isAdmin} />
      {isAdmin && <Sidebar isAdmin={isAdmin} />}
      <div className={`content ${!isAdmin ? "no-left-padding" : ""}`}>
        {children}
      </div>
      <Footer isAdmin={isAdmin} />
    </div>
  );
};

export const ProtectedRoutes = ({ user }) => {
  const isAdmin = user?.isAdmin;

  return (
    <ProtectedLayout user={user}>
      <Routes>
        {isAdmin ? (
          <>
            <Route path="/admin" element={<Home />} />
            <Route path="/admin/rooms" element={<Rooms />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/bookings" element={<Bookings />} />
            <Route path="/admin/info" element={<Info />} />
            <Route path="/admin/complaints" element={<Complaints />} />
          </>
        ) : (
          <>
            <Route path="/client/sauna" element={<BookingCalendar />} />
            <Route path="/client/laundry" element={<span>Laundry</span>} />
            <Route path="/client/info" element={<Info />} />
            <Route path="/client/complaint" element={<ClientComplaint />} />
          </>
        )}
      </Routes>
    </ProtectedLayout>
  );
};

export const AppRoutes = ({ user }) => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute user={user} element={<LoginPage />} />} />
      <Route path="/tv" element={<TvView />} />
      <Route path="/*" element={user ? <ProtectedRoutes user={user} /> : <Navigate to="/login" replace />} />
    </Routes>
  );
};
