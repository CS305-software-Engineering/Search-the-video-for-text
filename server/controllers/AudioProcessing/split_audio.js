const fs = require('fs');
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

module.exports = {
  atIntervals = splitAtInterval
};
