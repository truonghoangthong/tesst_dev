import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase.js";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "@firebase/firestore";
import useAuthStore from "../store/authStore.js";

const useSignUpWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const loginUser = useAuthStore((state) => state.login);

  const signUp = async (inputs) => {
    const userRef = collection(firestore, "users");

    // Check if the email is already registered
    const q = query(userRef, where("email", "==", inputs.email));
    const querySnapShot = await getDocs(q);

    if (!querySnapShot.empty) {
      return {
        Title: "Error",
        Message: "Email has been registered",
        Status: "error",
      };
    }

    try {
      // Create a new user with email and password
      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );

      // Handle errors if user creation fails
      if (!newUser) {
        return {
          Title: "Error",
          Message: error.message,
          Status: "error",
        };
      }

      // Ensure newUser.user.uid is defined
      if (!newUser.user.uid) {
        throw new Error("User UID is undefined");
      }

      // Create a user document in Firestore
      const userDoc = {
        uid: newUser.user.uid,
        email: inputs.email,
        fullName: inputs.fullName,
        phoneNum: inputs.phoneNum,
        createdAt: new Date().toISOString(),
      };

      // Save the user document to Firestore
      await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);

      // Update the auth store with the new user
      loginUser(userDoc);

      return {
        Title: "Success",
        Message: "User created successfully",
        Status: "success",
      };
    } catch (error) {
      return {
        Title: "Error",
        Message: error.message,
        Status: "error",
      };
    }
  };

  return { signUp, user, loading, error };
};

export default useSignUpWithEmailAndPassword;
