const fs = require('fs');
const fileInfo = require('file-type');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const tmpPath = process.env.TMP_PATH || '../../tmp';

module.exports = function(sourceFilePath, jobID) {
  return new Promise((resolve, reject) => {
    fs.open(sourceFilePath, 'r', function(status, fd){
      if(status) {
        // Error Reading the source File
        // Executing the Reject Callback
        reject(status.message);
      } else {
        const buffer = Buffer.from(new Uint8Array(100));
        fs.read(fd, buffer, 0, 100, 0, function(err, num, buff){
          // Error Reading the source file
          // Executing the Reject Callback
          if(err) {
            reject(err);
          } else {
            const fileInformation = fileInfo.fromBuffer(buff);
            // If it is already an audio file resolve is called
            if(fileInformation!==null && fileInformation === 'wav') {
              resolve(sourceFilePath);
            } else {
              // Specifying the Output Destination
              const outputDestination = `${tmpPath}/${jobID}.wav`;

              const args = ['-i', sourceFilePath, '-ac', '1', '-ab', '6400', '-ar', '16000', outputDestination, '-y'];
              var ffmpeg_path = require.resolve('ffmpeg-static') + '\\..\\ffmpeg.exe';

              // Starting a Sub-Process to Convert Video to Audio
              const process = spawn(ffmpeg_path, args);

              process.on('close', (code)=>{
                console.log(`Code = ${code}`);
                if(code==1) {
                  reject();
                } else if(code==0) {
                  resolve(outputDestination);
                }
              });
            }
          }
        });
      }
    });
  });
}
