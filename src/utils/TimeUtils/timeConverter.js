/**
 * Converts a date and time string into a 13-digit timestamp in milliseconds
 *
 * @param {Object} inputs - An object containing date and time attributes
 * @param {string} inputs.date - The date in `YYYY-MM-DD` format (e.g., "2025-01-28")
 * @param {string} inputs.time - The time in `HH:mm:ss` format (e.g., "02:40:41")
 * @returns {number|Object} - If successful, returns a 13-digit timestamp (e.g., 1738024841000)
 *                            If the input is invalid, returns an error object with the following properties:
 *                            - {string} Title - Error title 
 *                            - {string} Message - Error message describing the issue
 *                            - {string} Status - Error status
 *
 * @example
 * // Successful conversion
 * timeConverter({ date: "2025-01-28", time: "02:40:41" });
 * // Returns: 1738024841000
 *
 * @example
 * // Invalid date format
 * timeConverter({ date: "2025/01/28", time: "02:40:41" });
 * // Returns: { Title: "Error", Message: "Invalid date format", Status: "error" }
 *
 * @example
 * // Invalid time format
 * timeConverter({ date: "2025-01-28", time: "02:40" });
 * // Returns: { Title: "Error", Message: "Invalid time format", Status: "error" }
 *
 * @example
 * // Invalid date or time values
 * timeConverter({ date: "2025-02-30", time: "02:40:41" });
 * // Returns: { Title: "Error", Message: "Invalid date or time values", Status: "error" }
 */

export const timeConverter = (inputs) => {
  var date = inputs.date;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  var time = inputs.time;
  const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

  if (!dateRegex.test(date)) {
    return { Title: "Error", Message: "Invalid date format", Status: "error" };
  }

  if (!timeRegex.test(time)) {
    return { Title: "Error", Message: "Invalid time format", Status: "error" };
  }
  try {
    var dateAndTime = `${date}T${time}`;
    const timestamp = new Date(dateAndTime).getTime();
    if (isNaN(timestamp)) {
      return {
        Title: "Error",
        Message: "Invalid date or time values",
        Status: "error",
      };
    }
    return timestamp;
  } catch (error) {
    return { Title: "Error", Message: error.message, Status: "error" };
  }
};
