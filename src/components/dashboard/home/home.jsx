import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import './home.css';
import '../../variables.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import MyCalendar from "../home/calendar";
import { useNavigate } from "react-router-dom";
import useDataStore from "../../../services/data";

const Home = () => {
  const navigate = useNavigate();
  const { humid, temp } = useDataStore((state) => state.data);

  const latesthumid = humid.length > 0 ? humid[0].humidity : "--";
  const latesttemp = temp.length > 0 ? temp[0].temperature : "--";
  return (
    <div className="home">
      <div className="dir">
        <span>Dashboard</span>
        <Icon icon="material-symbols:chevron-right-rounded" width="24" height="24" />
      </div>
      <div className="db-box-list">
        <div className="db-box db-box-info">
          <span>Guests: 20</span>
          <span>Booking offers: 10</span>
          <div 
            className="db-box-report"
            onClick={() => navigate('./reports')}
          >
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
              <span>{latesthumid !== null ? `${latesthumid}%` : "--"}</span>
              <Icon icon="material-symbols:thermometer" className="db-box-icon" />
              <span>{latesttemp !== null ? `${latesttemp}°C` : "--"}</span>
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
              <span>{latesthumid !== null ? `${latesthumid}%` : "--"}</span>
              <Icon icon="material-symbols:thermometer" className="db-box-icon" />
              <span>{latesttemp !== null ? `${latesttemp}°C` : "--"}</span>
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
              <span>{latesthumid !== null ? `${latesthumid}%` : "--"}</span>
              <Icon icon="material-symbols:thermometer" className="db-box-icon" />
              <span>{latesttemp !== null ? `${latesttemp}°C` : "--"}</span>
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
              <span>{latesthumid !== null ? `${latesthumid}%` : "--"}</span>
              <Icon icon="material-symbols:thermometer" className="db-box-icon" />
              <span>{latesttemp !== null ? `${latesttemp}°C` : "--"}</span>
            </div>
            <span>Guest: --</span>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <MyCalendar />
      </div>
    </div>
  );
}

export default Home;
