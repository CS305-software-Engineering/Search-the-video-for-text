const debug = require('debug')('bin:lib:transcribe-audio');
const fs = require('fs');
require('dotenv').config();
//const wait = require('./wait');
const _lodash = require('lodash');
const google_cloud = require('@google-cloud/speech');

//split phrase into word clusters with max limit 90
function splitPhrases(phrase = "", clusterSize = 90){

	const words = phrase.split(' ');

	const Wclusters = [];

	let currentCluster = '';

	words.forEach(word => {

		if(`${currentCluster} `.length + word.length >= clusterSize){
			Wclusters.push(currentCluster);
			currentCluster =` ${word}`;
		} else {

			currentCluster = `${currentCluster} ${word}`;
		}

	});

	return Wclusters;

}

//use google speech to transcribe for upto 4 attempts then throw error

function transcribeAudio(audioPath, contextPhrase = '', language){
	console.log("transcribeAudio");
	console.log(audioPath);
	console.log(contextPhrase);
	const speech = require('@google-cloud/speech');	
	// Creates a client
	const speechClient = new speech.SpeechClient();
	//below commented code for testing with sample audio
	// const filePath = 'sample_audio.wav';

	// // Reads a local audio file and converts it to base64
	const file = fs.readFileSync(audioPath);
	const audioBytes = file.toString('base64');
	const audio = {
	  content: audioBytes,
	};
	
	const ContextPhrases = splitPhrases(contextPhrase);
		
	  const config = {
        encoding: 'LINEAR16',
		audioChannelCount: 1,
        languageCode:language|| 'en-US',
		speechContext:{ContextPhrases}
      };
		const request = {
			audio,
			config,
		  };

		speechClient.recognize(request).then((data) => {
			const results = _lodash.get(data[0], 'results', []);
			const transcription = results
			  .map(result => result.alternatives[0].transcript)
			  .join('\n');
			console.log(`Transcription: ${transcription}`);
			return transcription
		  })
		  .catch(err => {
			console.error('SPEECH CLIENT ERROR:', err);
		  });
	

}

//transcibe using function transcribAudio function and returns trnscriptions
module.exports =

{transcriber(audioPaths, phrase, language = 'en-GB'){


	console.log("Transcriber");
	console.log(audioPaths);

	if(audioPaths.constructor !== Array){
		audioPaths = [audioPaths];
	}
	console.time('transcribe');

	return Promise.all( audioPaths.map(audioPath => { return transcribeAudio(audioPath, phrase, language) } ) )
		.then(transcriptions => {
			console.time('transcribe');
			console.log('Transcription Hero => ', transcriptions);
			return transcriptions;
		})
		.catch(err => {
			console.log('Transcription error:', err);
			throw Error('An error occurred in the transcription process');
		})
	;

}


}