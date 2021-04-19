#!/usr/bin/env node

const { spawn } = require('child_process');
var os = require('os');
process.env.FFPROBE_PATH = require('ffprobe-static').path;

module.exports = function(pathToAudioFiles) {
    const promise = new Promise(
        (resolve, reject) => {
            let timeElapsed = 0;
            Promise.all(pathToAudioFiles.map((filePath) => {
                return new Promise(
                    (resolve, reject) => {
                        const probeProcess = spawn(process.env.FFPROBE_PATH, [filePath]);
                        let output = '';
                        probeProcess.on('close', (code) => {
                            if(code===1) reject();
                            else if(code===0) {
                                const res = output.split(os.EOL).filter(line => {
                                    const indexDuration = line.indexOf('Duration:');
                                    return indexDuration>=0;
                                }).map(line => {
                                    return line.substring(0, line.indexOf(', bitrate'));
                                }).map(line => {
                                    return line.substring(line.indexOf('Duration:')+10);
                                }).map(hms => {
                                    var parts = hms.split(':');
                                    var seconds = (+parts[0]) * 60 * 60 + (+parts[1]) * 60 + (+parts[2]); 
                                    return seconds;
                                });
                                resolve(res[0]);
                            }
                        });
                        probeProcess.stderr.on('data', data => {
                            output += data + '\n';
                        });
                    }
                );
            }))
            .then(duration => {
                const indexes = duration.map(d => {
                    timeElapsed = timeElapsed + d;
                    return {
                        start: timeElapsed - d,
                        end: timeElapsed,
                        duration: d
                    };
                });
                resolve(indexes);
            })
            .catch(error => {reject(error)});
        }
    );
    return promise;
}