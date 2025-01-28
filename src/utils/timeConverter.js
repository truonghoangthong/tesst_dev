/**
 * Convert date and time to timestamp in miliseconds (13 digits)
 * @param inputs - A object contains date and time attributes
 * @param inputs.date - YYYY-MM-DD Eg: 2025-01-28 (string)
 * @param inputs.time - HH:mm:ss Eg: 02:40:41 (string)
 * @return - A 13 digits timestamp Eg: 1738024841000 (number)
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
