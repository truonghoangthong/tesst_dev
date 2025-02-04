import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import './home.css';
//import { getHumidTemp } from "../../services/humid";

const Home = () => {
  const [humid, setHumid] = useState(null);
  const [temp, setTemp] = useState(null);
  //useEffect(() => {
  //  const fetchData = async () => {
  //    const {humid, temp} = await getHumidTemp();
  //    setHumid(humid);
  //    setTemp(temp);
  //  };
  //  fetchData();
  //  const interval = setInterval(fetchData, 10000) //10s
  //  return () => clearInterval(intervalId); //cleanup
  //}, []);
  return (
    <div className="home">
      <span>Dashboard</span>
      <div className="db-box-list">
        <div className="db-box db-box-info">
          <span>Guests: 20</span>
          <span>Booking offers: 10</span>
          <div className="db-box-report">
            <span>Reports</span>
            <Icon icon="material-symbols:content-paste-go" className="db-box-icon" />
          </div>
        </div>

        <div className="db-box">
          <div className="db-box-left">
            <span>A</span>
          </div>
          <div className="db-box-right">
            <div className="db-box-row">
              <span>Status:</span>
              <span className="status-available">Available</span>
            </div>
            <div className="db-box-row">
              <Icon icon="material-symbols:humidity-percentage-rounded" className="db-box-icon" />
              <span>80%</span>
              <Icon icon="material-symbols:thermometer" className="db-box-icon" />
              <span>23°C</span>
            </div>
            <span>Guest: --</span>
          </div>
        </div>

        <div className="db-box">
          <div className="db-box-left">
            <span>A</span>
          </div>
          <div className="db-box-right">
            <div className="db-box-row">
              <span>Status:</span>
              <span className="status-occupied">Occupied</span>
            </div>
            <div className="db-box-row">
              <Icon icon="material-symbols:humidity-percentage-rounded" className="db-box-icon" />
              <span>80%</span>
              <Icon icon="material-symbols:thermometer" className="db-box-icon" />
              <span>23°C</span>
            </div>
            <span>Guest: --</span>
          </div>
        </div>

        <div className="db-box">
          <div className="db-box-left">
            <span>A</span>
          </div>
          <div className="db-box-right">
            <div className="db-box-row">
              <span>Status:</span>
              <span className="status-cleaning">Cleaning</span>
            </div>
            <div className="db-box-row">
              <Icon icon="material-symbols:humidity-percentage-rounded" className="db-box-icon" />
              <span>80%</span>
              <Icon icon="material-symbols:thermometer" className="db-box-icon" />
              <span>23°C</span>
            </div>
            <span>Guest: --</span>
          </div>
        </div>

        <div className="db-box">
          <div className="db-box-left">
            <span>A</span>
          </div>
          <div className="db-box-right">
            <div className="db-box-row">
              <span>Status:</span>
              <span className="status-booked">Booked</span>
            </div>
            <div className="db-box-row">
              <Icon icon="material-symbols:humidity-percentage-rounded" className="db-box-icon" />
              <span>80%</span>
              <Icon icon="material-symbols:thermometer" className="db-box-icon" />
              <span>23°C</span>
            </div>
            <span>Guest: --</span>
          </div>
        </div>
      </div>
      
    </div>
  )
}
export default Home;