import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";

/**
 * // Change user's password hook
 *
 * @param {string} newPassword - Updated password
 * @param {string} email - User email
 * @param {string} currentPassword - The current password user wants to change
 * @return {Object} -  Response object, if successful, it returns the object with the
 *                     following properties:
 *                     - {string} Title - Success title
 *                     - {string} Message - Message indicates change password successfully
 *                     - {string} Status - Success status
 *                      
 *                     if user is not authenicated or other errors occur, it returns the object with the
 *                     following properties:
 *                     - {string} Title - Error title
 *                     - {string} Message - Error message describes the issue
 *                     - {string} Status - Error status
 */

const useChangePassword = async (newPassword, email, currentPassword) => {
  const user = auth.currentUser;
  if (!user) {
    return { Title: "Error", Message: "User needs to log in", Status: "error" };
  }

  try {
    const cred = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, cred);

    await updatePassword(user, newPassword);
    return {
      Title: "Success",
      Message: "Change password successfully",
      Status: "success",
    };
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};

export default useChangePassword;
