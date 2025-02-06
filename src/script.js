import linkingWords from './linkingWords';

const fileInput = document.getElementById('file__input');
const startButton = document.getElementById('btn__start');
const chunkSizeInput = document.getElementById('chunk__size');
const chunkOutput = document.getElementById('chunk_value');
const languageInput = document.getElementById('language');

let chunkSize;
let originalFileName;
let selectedLinkingWords;

// update chunk size for user to see
chunkSizeInput.addEventListener('mousemove', (e) => {
  chunkOutput.textContent = e.target.value;
});

// When 'START PROCESSING' button is clicked
startButton.addEventListener('click', () => {
  if (!fileInput.files.length) return alert('Please choose a .srt file and try again!');

  if (!chunkSizeInput.value > 0) {
    return alert('Please specify the chunk size you want to divide by!');
  } else {
    chunkSize = chunkSizeInput.value;
  }

  const file = fileInput.files[0];
  originalFileName = file.name.split('.')[0]; // get name of file as it is uploaded

  // getting selected language for processing
  Object.entries(linkingWords).forEach((language) => {
    if (language[0] === languageInput.value) {
      selectedLinkingWords = language[1];
    }
  });

  // after file content is available start processing
  file.text().then(processSRT);
});

const processSRT = (srtText) => {
  const subtitles = parseSRT(srtText);
  const modifiedSRT = modifySubtitles(subtitles, chunkSize);

  // turn off start button
  startButton.disabled = 'disabled';

  // add download file button
  enableDownload(modifiedSRT);
};

// dividing .srt file in blocks(id, time, text) by timestamps
const parseSRT = (srtText) => {
  const allText = srtText
    .trim()
    .split('\n\n')
    .map((block) => {
      const lines = block.split('\n');

      return {
        id: lines[0],
        time: lines[1],
        text: lines.slice(2).join(' '),
      };
    });

  return allText;
};

const adjustChunksForNumbers = (srtText) => {
  for (let i = 1; i < srtText.length; i++) {
    const currentChunk = srtText[i];
    const previousChunk = srtText[i - 1];

    // check if chunks starts with number
    const numberMatch = currentChunk.text.match(/^\d+/);

    if (numberMatch) {
      // move number to ending of previous chunk
      previousChunk.text += ' ' + numberMatch[0];

      currentChunk.text = currentChunk.text.replace(/^\d+/, '').trim();
    }
  }

  return srtText;
};

// all subtitles processing
const modifySubtitles = (subtitles, maxCharacters) => {
  return subtitles
    .map(({ id, time, text }, subtitleIndex) => {
      let chunks = [];
      let currentChunk = '';

      // parse timestamp into start and end time
      const [startTime, endTime] = time.split(' --> ');
      // always start first chunk of .srt with 0 time
      const start = subtitleIndex === 0 ? new Date(0, 0, 0) : parseTimestamp(startTime);
      const end = parseTimestamp(endTime);
      let currentStart = start;

      // start first chunk from all .srt with 00:00 time
      if (id === 1) {
        currentStart = new Date(0, 0, 0);
      } else {
        currentStart = start;
      }

      const duration = end - start;
      const durationPerCharacter = duration / text.length; // time per character

      text.split(' ').forEach((word, index, words) => {
        // adjust time for numbers (numbers take more time to pronounce)
        let extraTime = 0;
        // if (/\d/.test(word)) {
        if (/\d+/.test(word)) {
          // multiply duration for chunks containing numbers
          extraTime = durationPerCharacter * word.length * 4; // add more x4 time for numbers
        }

        // minimum chunk duration
        const minDuration = 500;
        const chunkTime = Math.max(currentChunk.length * durationPerCharacter + extraTime || 0, minDuration);
        // checking for last iteration
        const lastIteration = index === words.length - 1;
        // on last iteration, chunk should end in next chunk start time
        const chunkEnd = lastIteration ? new Date(end.getTime()) : new Date(currentStart.getTime() + chunkTime);

        // check if word is an abreviation (e.g., "Mr.", "Dr.")
        const isAbreviation = /^[A-Z][a-z]?\.$/.test(word);

        // check if is only the ending of sentence with these symbols
        const isEndOfSentence = /[.?!]/.test(word) && index < words.length - 1 && /^[A-Z]/.test(words[index + 1]);

        // if a word have these punctuation marks, force chunk split
        if ((!isAbreviation && isEndOfSentence) || /\d+/.test(word)) {
          // divide chunk if it is long enough
          currentChunk += (currentChunk ? ' ' : '') + word;

          chunks.push({
            id: `${id}.${chunks.length + 1}`,
            time: `${formateTime(currentStart)} --> ${formateTime(chunkEnd)}`,
            text: currentChunk.trim(),
          });

          // reset values
          currentStart = chunkEnd;
          currentChunk = '';
          return; // skip further processing for this word
        }

        // if a word have comma mark and is longer enough, force chunk split
        if (/,/.test(word) && currentChunk.length >= maxCharacters * 0.35) {
          // divide chunk if it is long enough

          currentChunk += (currentChunk ? ' ' : '') + word;

          chunks.push({
            id: `${id}.${chunks.length + 1}`,
            time: `${formateTime(currentStart)} --> ${formateTime(chunkEnd)}`,
            text: currentChunk.trim(),
          });

          // reset values
          currentStart = chunkEnd;
          currentChunk = '';
          return; // skip further processing for this word
        }

        // force chunk split, is there is linking word
        if (
          selectedLinkingWords.includes(word) &&
          (currentChunk.split(' ').length > 1 || currentChunk.length >= maxCharacters / 2)
        ) {
          chunks.push({
            id: `${id}.${chunks.length + 1}`,
            time: `${formateTime(currentStart)} --> ${formateTime(chunkEnd)}`,
            text: currentChunk.trim(),
          });

          // reset chunk
          currentStart = new Date(chunkEnd.getTime());
          currentChunk = '';
        }

        // If adding words exeeds max character, create a new chunk
        if ((currentChunk + ' ' + word).trim().length > maxCharacters) {
          chunks.push({
            id: `${id}.${chunks.length + 1}`,
            time: `${formateTime(currentStart)} --> ${formateTime(chunkEnd)}`,
            text: currentChunk.trim(),
          });

          // reset chunk
          currentStart = new Date(chunkEnd.getTime());
          currentChunk = word;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + word;
        }
      });

      // handle any remainig chunk
      if (currentChunk.trim().length > 0) {
        chunks.push({
          id: `${id}.${chunks.length + 1}`,
          time: `${formateTime(currentStart)} --> ${formateTime(end)}`,
          text: currentChunk.trim(),
        });
      }

      // function that will remove chunks that starts with number, and move that number to previous chunk
      const adjustedChunks = adjustChunksForNumbers(chunks);

      return adjustedChunks
        .map(({ id, time, text }) => {
          return `${id}\n${time}\n${text}\n`;
        })
        .join('\n');
    })
    .join('\n');
};

// transform timestamp in JS date
const parseTimestamp = (timestamp) => {
  const [time, milliseconds] = timestamp.split(',');
  const [hours, minutes, seconds] = time.split(':').map((num) => parseInt(num, 10));
  return new Date(0, 0, 0, hours, minutes, seconds, milliseconds);
};

// transform from JS date in original .srt timestamp
const formateTime = (date) => {
  if (!(date instanceof Date)) {
    console.log(date);
    console.log('Invalid date passed to format:', date);
    return;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds},${milliseconds}`;
};

// creating download button
const enableDownload = (modifiedSRT) => {
  const downloadButton = document.getElementById('btn__download');
  const blob = new Blob([modifiedSRT], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  downloadButton.style.display = 'inline';

  downloadButton.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFileName}_modified.srt`; // default file name
    a.click();
  });
};
