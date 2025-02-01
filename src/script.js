const fileInput = document.getElementById("file__input");
const startButton = document.getElementById("btn__start");
const chunkSizeInput = document.getElementById("chunk__size");

let chunkSize;
let originalFileName;

startButton.addEventListener("click", () => {
  if (!fileInput.files.length)
    return alert("Please choose a .srt file and try again!");

  if (!chunkSizeInput.value > 0) {
    return alert("Please specify the chunk size you want to divide by!");
  } else {
    chunkSize = chunkSizeInput.value;
  }

  const file = fileInput.files[0];
  originalFileName = file.name.split(".")[0]; // get name of file as it is uploaded

  // after file content is available start processing
  file.text().then(processSRT);
});

const processSRT = (srtText) => {
  const subtitles = parseSRT(srtText);
  const modifiedSRT = modifySubtitles(subtitles);

  enableDownload(modifiedSRT);
};

// dividing .srt file in blocks(id, time, text) by timestamps
const parseSRT = (srtText) => {
  return srtText
    .trim()
    .split("\n\n")
    .map((block) => {
      const lines = block.split("\n");
      return {
        id: lines[0],
        time: lines[1],
        text: lines.slice(2).join(" "),
      };
    });
};

// all subtitles processing
const modifySubtitles = (subtitles) => {
  return subtitles
    .map(({ id, time, text }) => {
      // spliting block chunk in words
      const words = text.split(" ");
      let chunks = [];
      let currrentChunk = [];
      let chunkStartIndex = 0;

      // parse timestamp into start and end time
      const [startTime, endTime] = time.split(" --> ");
      const start = parseTimestamp(startTime);
      const end = parseTimestamp(endTime);

      const duration = end - start;
      const durationPerWord = duration / words.length; // time per word

      words.forEach((word, index) => {
        currrentChunk.push(word);

        // if a words contains dot (.) finalize chunk
        if (word.includes(".") || currrentChunk.length >= 3) {
          const chunkWords = currrentChunk.join(" ");
          const chunkStart = new Date(
            start.getTime() + chunkStartIndex * durationPerWord
          );
          const chunk = new Date(
            start.getTime() + (index + 1) * durationPerWord
          );

          chunks.push({
            id: `${id}.${Math.floor(chunkStartIndex / 3 + 1)}`,
            time: `${formateTime(chunkStart)} --> ${formateTime(chunk)}`,
            text: chunkWords,
          });

          // reset the chunk and update start index
          currrentChunk = [];
          chunkStartIndex = index + 1;
        }
      });

      // Adding any remaining words at the last chunk
      if (currrentChunk.length > 0) {
        const chunkWords = currrentChunk.join(" ");
        const chunkStart = new Date(
          start.getTime() + chunkStartIndex * durationPerWord
        );
        const chunkEnd = new Date(end.getTime());

        chunks.push({
          id: `${id}.${Math.floor(chunkStartIndex / 3 + 1)}`,
          time: `${formateTime(chunkStart)} --> ${formateTime(chunkEnd)}`,
          text: chunkWords,
        });
      }

      // combining all chunks again in .srt format
      return chunks
        .map(({ id, time, text }) => {
          return `${id}\n${time}\n${text}\n`;
        })
        .join("\n");
    })
    .join("\n");
};

// transform timestamp in JS date
const parseTimestamp = (timestamp) => {
  const [time, milliseconds] = timestamp.split(",");
  const [hours, minutes, seconds] = time
    .split(":")
    .map((num) => parseInt(num, 10));
  return new Date(0, 0, 0, hours, minutes, seconds, milliseconds);
};

// transform from JS date in original .srt timestamp
const formateTime = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  return `${hours}:${minutes}:${seconds},${milliseconds}`;
};

// creating download button
const enableDownload = (modifiedSRT) => {
  const downloadButton = document.getElementById("btn__download");
  const blob = new Blob([modifiedSRT], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  downloadButton.style.display = "inline";

  downloadButton.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${originalFileName}_modified.srt`; // default file name
    a.click();
  });
};
