const fs = require('fs');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const tmpPath = process.env.TMP_PATH || '../../tmp';

function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    let output = '';
    var ffmpeg_path = require.resolve('ffmpeg-static') + '\\..\\ffmpeg.exe';
    const process = spawn(ffmpeg_path, args);
    process.on('close', (code) => {
			if(code === 1){
				reject();
			} else if(code === 0){
				resolve(output);
			}
		});
  });
}

function getListOfSplitFiles(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if(err) {
        reject(err);
      } else {
        resolve(files.map(f => { return `${directory}/${f}`; }))
      }
    })
  })
}

function splitFileAtSpecificIntervals(sourceFilePath, jobID, duration=3) {
  // sourceFilePath: Path to Input Audio File
  // jobID: ID of the Job
  // duration: Slicing the Audio into clips of duration, duration
  return new Promise((resolve, reject) => {
    const splitFilesDestination = `${tmpPath}/_${jobID}`;
    fs.mkdir(splitFilesDestination, function(err){
      if(err){
        reject(err);
      } else {
        const args = ['-i', sourceFilePath, '-f', 'segment', '-segment_time',	duration, '-c', 'copy', `${splitFilesDestination}/out%03d.wav`];
        runFFmpeg(args)
          .then(function(){
            getListOfSplitFiles(splitFilesDestination)
              .then(files => resolve(files));
          })
          .catch(
            err => reject(err);
          );
      }
    });
  });
}

module.exports = {
  atIntervals = splitFileAtSpecificIntervals
};
