const fs = require('fs');
var os = require('os');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const tmpPath = process.env.TMP_PATH || '../../tmp';

function getListOfSplitFiles(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if(err) reject(err);
      else {
        const filePaths = files.map(f => `${directory}/${f}`);
        resolve(filePaths);
      }
    })
  })
}

function splitAtInterval(audioFilePath, jobID, sliceLength=3) {
  // audioFilePath: Path to the Audio File to be Splitted
  // jobID: ID with which the audio file is associated
  // sliceLength: Interval At Which the File has to be splitted
  const promise = new Promise(
    (resolve, reject) => {
      const slicesDestination = `${tmpPath}/_${jobID}`;
      fs.mkdir(slicesDestination, (error) => {
        if(error) reject(error);
        else {
          const segmentPromise = new Promise((resolve, reject) => {
            const args = ['-i', audioFilePath, 'f', 'segment', '-segment_time', sliceLength, '-c', 'copy', `${slicesDestination}/out%03d.wav`];
            let ffmpeg_exec_path = path.dirname(require.resolve("ffmpeg-static/package.json"));
            ffmpeg_exec_path = path.join(ffmpeg_exec_path, 'ffmpeg.exe');
            const process = spawn(ffmpeg_exec_path, args);
            process.on('close', (code) => {
              if(code===1) reject();
              else if(code===0) resolve(output);
            });
          });
          segmentPromise
            .then(() => {
              getListOfSplitFiles(slicesDestination)
                .then(files => resolve(files))
                .catch(error => reject(error));
            })
            .catch( error => {
              reject(error);
            });
        }
      });
    }
  );
  return promise;
}

function startProcessSilenceDetect(audioFilePath) {
  const silenceDetectPromise = new Promise( (resolve, reject) => {
    let output = '';
    const args = ['-i', audioFilePath, '-af', 'silencedetect=n=-40dB:d=0.2', '-f', 'null', '-'];
    let ffmpeg_exec_path = path.dirname(require.resolve("ffmpeg-static/package.json"));
    ffmpeg_exec_path = path.join(ffmpeg_exec_path, 'ffmpeg.exe');
    const process = spawn(ffmpeg_exec_path, args);
    process.on('close', (code) => {
      if(code===1) reject('FFMPEG ERROR');
      else if(code===0) resolve(output);
    });
    process.stderr.on('data', data => {
      output += data + '\n';
    });
  });

  return silenceDetectPromise;
}

function identifySilence(audioFilePath) {
  startProcessSilenceDetect(audioFilePath)
    .then( data => {
      const silencePart = data.split(os.EOL)
      .filter( line => {
        const indexOfSilenceDetect = line.indexOf('[silencedetect @');
        const indexOfSilenceEnd = line.indexOf('silence_end');
        const indexOfSilenceDuration = line.indexOf('silence_duration');
        return (indexOfSilenceDetect >= 0) && (indexOfSilenceEnd >= 0) && (indexOfSilenceDuration>=0);
      })
      .map( l => l.slice(l.indexOf('silence_end')))
      .map( l => {
        const parts = l.split(' | ').map( part => { return Number( part.replace( /[^0-9.]/g , '') ) } );
        return {
          start: parts[0] - parts[1],
          duration: parts[1],
          end: parts[0],
          middle: parts[0] - ( (parts[0] - parts[1]) / 2 )
        };
      });
      return silencePart;
    })
    .catch(error => { console.log(error); });
}

function getClipsOnSilence(parts, totalDuration) {
  const clips = [];
  let previousPause = 0;
  parts.forEach( (part, index) => {
    clips.push({
      start:previousPause,
      duration:part.end-previousPause
    });
    previousPause = part.end;
  });
  clips.push({
    start:previousPause,
    duration:totalDuration-previousPause
  });
  return clips;
}

function splitOnSilence(audioFilePath, jobID) {
  const promise = new Promise(
    (resolve, reject) => {
      const slicesDestination = `${tmpPath}/_${jobID}`;
      fs.mkdir(slicesDestination, (error) => {
        if(error) reject(error);
        else {

        }
      });
    }
  );
}

module.exports = {
  atIntervals = splitAtInterval
};
