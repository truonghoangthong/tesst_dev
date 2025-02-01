import { useAuthStore } from "../../store/authStore";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const [signOut, loading, error] = useSignOut(auth);

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      return {
        Title: "Success",
        Message: "Logout successfully",
        Status: "success",
      };
    } catch (error) {
      return { Title: "Error", Message: error.message, Status: "error" };
    }
  };
  return { handleLogout, loading, error };
};

export default useLogout;
