const fs = require('fs');
const fileInfo = require('file-type');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const path = require('path');

const tmpPath = process.env.TMP_PATH || './server/tmp';

module.exports =  function(videoFile, jobID) {
  return new Promise((resolve, reject) => {
    fs.readFile(videoFile, (error, data) => {
      if(error) {
        reject(error);
      } else {
        data = data.slice(0, 100);
        const fileType = fileInfo.fromBuffer(data);
        if(fileType!==null && fileType==='wav') {
          resolve(videoFile);
        } else {
          const audioFile = `${tmpPath}/${jobID}.wav`;
          const args = ['-i', videoFile, '-ac', '1', '-ab', '6400', '-ar', '16000', audioFile, '-y'];
          // let ffmpeg_exec_path = path.dirname(require.resolve("ffmpeg-static/package.json"));
          // ffmpeg_exec_path = path.join(ffmpeg_exec_path, 'ffmpeg.exe');
          
          // Added Line
          let ffmpeg_exec_path = "server/controllers/AudioProcessing/ffmpeg.exe"
          
          const process = spawn(ffmpeg_exec_path, args);
          
          // Setting Up Process Callbacks

          process.stdout.on('data', (data) => {
            if(process.env.VERBOSE_FFMPEG){
              console.log(`stdout: ${data}`);
            }
          });

          process.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
          });
          
          process.on('close', (code)=>{
            if(code==1) {
              reject();
            } else if(code==0) {
              resolve(audioFile);
            }
          });

        }
      }
    });
  });
}
