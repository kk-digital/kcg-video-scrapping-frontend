export function formatSecondsToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

export function formatBytes(bytes: number): string {
  const MB = 1024 * 1024;
  const GB = MB * 1024;

  if (bytes >= GB) {
    return `${(bytes / GB).toFixed(2)} GB`;
  }

  if (bytes >= MB) {
    return `${(bytes / MB).toFixed(2)} MB`;
  }

  return `${bytes} B`;
}

export function formatDateTimeReadable(dateTime: Date | string) {
  if (typeof dateTime === "string") {
    dateTime = new Date(dateTime);
  }

  if (dateTime === null || dateTime === undefined) {
    return "N/A";
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const year = dateTime.getFullYear();
  const month = months[dateTime.getMonth()];
  const day = days[dateTime.getDay()];
  const date = dateTime.getDate();

  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${day}, ${month} ${date}, ${year}, at ${hour}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
}
