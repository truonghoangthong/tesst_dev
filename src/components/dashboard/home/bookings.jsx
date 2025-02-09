import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import "./rooms.css";
import "../../variables.css";
import { roomStore } from "../../../state/booking-room.js";
import { userStore } from "../../../state/user.js";
import CardModel from "../../cardModel";