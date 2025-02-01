/**
 * Convert timestamp from miliseconds to date & time (timestamp with 13 digits)
 * @param {number} timestamp - 13 Digits timestamp number in miliseconds Eg: 1696941296000
 * @returns {string|Object} - If successful, returns a date and time (e.g., "10/10/2023" & "3:34:56 PM")
 *                            If the input is invalid, returns an error object with the following properties:
 *                            - {string} Title - Error title
 *                            - {string} Message - Error message
 *                            - {string} Status - Error status
 * 
 * @example
 * // Sucessful conversion
 * timestampConverter(1696941296000)
 * // Returns {date: "10/10/2023", time: "3:34:56 PM"}
 * 
 * @example 
 * // Invalid timestamp
 * timestampConverter("1696941296000")
 * // Returns { Title: "Error", Message: "Invalid timestamp", Status: "error" };
 * 
 * @example 
 * // Invalid timestamp
 * timestampConverter(16969412960000932903482389043)
 * // Returns { Title: "Error", Message: "Invalid timestamp", Status: "error" };
 */

export const timeStampToTime = (timestamp) => {
  if (typeof timestamp !== "number" || timestamp.toString().length !== 13) {
    return { Title: "Error", Message: "Invalid timestamp", Status: "error" };
  }

  try {
    const orgDateAndTime = new Date(timestamp);
    const date = orgDateAndTime.toLocaleDateString();
    const time = orgDateAndTime.toLocaleTimeString();
    return { date, time };
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};
