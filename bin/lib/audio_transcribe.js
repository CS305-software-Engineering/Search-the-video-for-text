const debug = require('debug')('bin:lib:transcribe-audio');
const fs = require('fs');

const wait = require('./wait');

const projectId = process.env.GCLOUD_PROJECT;

const gcloud = require('google-cloud')({
	projectId: projectId,
	credentials: JSON.parse(process.env.GCLOUD_CREDS)
});

const Speech = gcloud.speech;

const speech = new Speech({
	projectId,
	credentials: JSON.parse(process.env.GCLOUD_CREDS)
});




//transcibe using function transcribAudio function and returns trnscriptions
module.exports = function(audioFiles, phrase, language = 'en-GB'){

	debug("audioFiles", audioFiles);

	if(audioFiles.constructor !== Array){
		audioFiles = [audioFiles];
	}
	console.time('transcribe');
	return Promise.all( audioFiles.map(file => { return transcribeAudio(file, phrase, language) } ) )
		.then(transcriptions => {
			console.time('transcribe');
			return transcriptions;
		})
		.catch(err => {
			debug('Transcription error:', err);
			throw Error('An error occurred in the transcription process');
		})
	;

};