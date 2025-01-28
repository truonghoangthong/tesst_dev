/** 
 * Convert timestamp from miliseconds to date & time (timestamp with 13 digits)
 * @param timestamp - 13 Digits timestamp number in miliseconds Eg: 1696941296000 (number)
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


