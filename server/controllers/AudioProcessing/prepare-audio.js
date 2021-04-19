#!/usr/bin/env node

const extractAudio = require('./extract_audio');
const splitAudio = require('./split_audio');

module.exports = function(filePath, jobID, duration) {
  return extractAudio(filePath, jobID)
    .then(file => {
      if(duration) {
        return splitAudio.atIntervals(file, jobID, duration);
      } else {
        return splitAudio.onSilence(file, jobID);
      }
    })
    ;
}


