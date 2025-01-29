import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { doc, getDoc } from "@firebase/firestore";
import { useAuthStore } from "../store/authStore";
import { auth, firestore } from "../firebase/firebase";

const useLogin = () => {
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const loginUser = useAuthStore((state) => state.login);

  const login = async (inputs) => {
    try {
      const userCred = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );

      if (userCred) {
        const docRef = doc(firestore, "users", userCred.user.uid);
        const docSnap = await getDoc(docRef);
        loginUser(docSnap.data());
        return {
          Title: "Success",
          Message: "Login successfully",
          Status: "success",
        };
      } else {
        return { Title: "Error", Message: "User not found", Status: "error" };
      }
    } catch (error) {
      return { Title: "Error", Message: error.message, Status: "error" };
    }
  };
  return { login, loading, error };
};

export default useLogin;
