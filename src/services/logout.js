import { useEffect } from "react";
import useLogout from "../../../Backend/src/hooks/AuthenicationHooks/useLogout";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { handleLogout } = useLogout()
  const navigate = useNavigate()
}