export function formatSecondsToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

export const formatBytes = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};
export function formatDateTimeReadable(dateTime: Date | string) {
  if (typeof dateTime === "string") {
    dateTime = new Date(dateTime + "Z");
  }

  if (dateTime === null || dateTime === undefined) {
    return "N/A";
  }

  const year = dateTime.getFullYear();
  const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  const date = dateTime.getDate().toString().padStart(2, "0");
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour = (hours % 12 || 12).toString().padStart(2, "0");

  return `${year}-${month}-${date} ${hour}:${minutes} ${ampm}`;
}

export const convertRawStringToDisplay = (rawString: string) => {
  const lines = rawString.split("\n");
  return lines.map((line, index) => {
    // Convert links in the string to clickable links
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = line.split(linkRegex);

    return (
      <span key={index}>
        {parts.map((part, partIndex) => {
          // Check if the part is a link
          if (linkRegex.test(part)) {
            return (
              <a
                key={partIndex}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
              >
                {part}
              </a>
            );
          }
          return <span key={partIndex}>{part}</span>;
        })}
        <br />
      </span>
    );
  });
};
