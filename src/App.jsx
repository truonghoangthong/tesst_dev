import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AppRoutes } from "./routes";
import useDataStore from "./services/data";
import useAuthStore from "../../Backend/src/store/authStore";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const { user } = useAuthStore();
  const { fetchHumidityStream, fetchTemperatureStream, startWeatherDataInterval, stopWeatherDataInterval } = useDataStore();

  useEffect(() => {
    fetchHumidityStream();
    fetchTemperatureStream();
    startWeatherDataInterval();

    return () => {
      stopWeatherDataInterval();
    };
  }, [fetchHumidityStream, fetchTemperatureStream, startWeatherDataInterval, stopWeatherDataInterval]);

  return (
    <Router>
      <ScrollToTop />
      <Header isAdmin={user?.isAdmin} />
      <AppRoutes user={user} />
      <Footer isAdmin={user?.isAdmin} />
    </Router>
  );
};

export default App;
