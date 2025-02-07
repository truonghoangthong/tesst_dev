import React from "react";
import { Icon } from "@iconify/react";
import './info.css';
import { Label } from "recharts";

const Info = () =>  {
  return (
    <div className="info">
      <div className="gradient-box"></div>
      <div className="info-details">
        <div className="name-box">
          <Icon icon="mdi:person-circle-outline" width="125" height="125" />
          <div className="info-column">
            <span className="info-name">Thong Truong</span>
            <span className="info-email">thongtruong@mail.com</span>
          </div>
        </div>
        <button>Save</button>
        <form className="info-form">
          <div className="info-column">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" value="Thong" />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" value="Truong" />
            </div>
          </div>
          <div className="info-column">
            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <input type="text" id="phoneNumber" value="0455789903h" />
            </div>
            <div class="form-group">
              <label for="emailAddress">Email Address</label>
              <input type="email" id="emailAddress" value="thongtruong@mail.com" />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Info;