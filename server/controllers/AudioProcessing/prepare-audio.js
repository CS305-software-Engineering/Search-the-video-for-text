const extractAudio = require('./extract_audio');
const splitAudio = require('./split_audio');

module.export = function(filePath, jobID, duration) {
  return extractAudio(filePath, jobID)
    .then(file => {
      if(duration) {
        return splitAudio.atIntervals(file, jobID, duration);
      } else {
        splitAudio.onSilence(file, jobID);
      }
    })
    ;
}


