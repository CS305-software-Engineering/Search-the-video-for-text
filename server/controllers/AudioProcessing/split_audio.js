const fs = require('fs');
var os = require('os');
var path = require('path');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const getDuration = require('./media_info');

const maxClipSize = process.env.MAX_CLIP_SIZE || 20;
const tmpPath = process.env.TMP_PATH || './server/tmp';

function filePaths(directory) {
  // Takes in the path of a directory
  // Returns the promise while resolves to path of files in the given directory
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if(err) reject(err);
      else {
        const filePaths = files.map(f => `${directory}/${f}`);
        resolve(filePaths);
      }
    })
  });
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
            const args = ['-i', audioFilePath, '-f', 'segment', '-segment_time', sliceLength, '-c', 'copy', `${slicesDestination}/out%03d.wav`];
            let ffmpeg_exec_path = path.dirname(require.resolve("ffmpeg-static/package.json"));
            ffmpeg_exec_path = path.join(ffmpeg_exec_path, 'ffmpeg.exe');
            const process = spawn(ffmpeg_exec_path, args);
            process.on('close', (code) => {
              if(code===1) reject();
              else if(code===0) resolve();
            });
          });
          segmentPromise
            .then(() => {
              filePaths(slicesDestination)
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
  // Takes in the Path to an Audio File
  // Returns a promise which gives the output of ffmpeg while running silence detect
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
  // Function to Identify Pauses in an Audio File
  return startProcessSilenceDetect(audioFilePath)
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

function reduceLargeClipSize(clips) {
  reducedClips = [{
    start: 0,
    duration: 0
  }];
  clips.forEach(clip => {
    if(clip.duration > maxClipSize) {
      const newClipSizes = 4;
      const numberOfClips = Math.ceil(clip.duration/newClipSizes);
      Array(numberOfClips).fill().forEach(
        (_, index) => {
          const previousClip = reducedClips[reducedClips.length - 1];
          if(index!=numberOfClips-1) {
            reducedClips.push({
              start: previousClip.start + previousClip.duration,
              duration: newClipSizes
            });
          } else {
            reducedClips.push({
              start: previousClip.start + previousClip.duration,
              duration: (clip.start + clip.duration - previousClip.start - previousClip.duration)
            });
          }
        }
      );
    } else {
      reducedClips.push(clip);
    }
  });
  return reducedClips;
}

function padding(num){
	if(num < 10) return `00${num}`;
  else if(num < 100) return `0${num}`;
	else return num;
}

function splitOnSilence(audioFilePath, jobID) {
  const promise = new Promise(
    (resolve, reject) => {
      const slicesDestination = `${tmpPath}/__${jobID}`;
      fs.mkdir(slicesDestination, (error) => {
        if(error) reject(error);
        else {
          getDuration([audioFilePath])
          .then(
            audioInformation => {
              return identifySilence(audioFilePath)
              .then(pauses => getClipsOnSilence(pauses))
              .then(clips => reduceLargeClipSize(clips))
              .then(clips => {
                return Promise.all(clips.map( (clip, index) => {
                  const ffmpegPromise = new Promise((resolve, reject) => {
                    const args = ['-ss', clip.start, '-t', clip.duration, '-i', audioFilePath, `${slicesDestination}/out${ padding(index) }.wav`];
                    let ffmpeg_exec_path = path.dirname(require.resolve("ffmpeg-static/package.json"));
                    ffmpeg_exec_path = path.join(ffmpeg_exec_path, 'ffmpeg.exe');
                    const process = spawn(ffmpeg_exec_path, args);
                    process.on('close', (code) => {
                      // if(code===1) {console.log("I am Rejecting"); reject();}
                      // else if(code===0) resolve();
                      resolve();
                    });
                  });
                  return ffmpegPromise;
                }));
              })
              .then(() => {
                filePaths(slicesDestination)
                .then(files => {resolve(files)});
              })
              .catch();
            }
          )
          .catch(error => {reject(error);});
        }
      });
    }
  );
  return promise;
}

module.exports = {
  atIntervals : splitAtInterval,
  onSilence : splitOnSilence
};
