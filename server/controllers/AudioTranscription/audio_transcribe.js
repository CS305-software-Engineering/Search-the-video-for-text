const debug = require('debug')('bin:lib:transcribe-audio');


const fs = require('fs');

require('dotenv').config();
//const wait = require('./wait');
const _lodash = require('lodash');
const google_cloud = require('@google-cloud/speech');

//split phrase into word clusters with max limit 90
function splitPhrases(phrase = "", clusterSize = 90) {

	const words = phrase.split(' ');

	const Wclusters = [];

	let currentCluster = '';

	words.forEach(word => {

		if (`${currentCluster} `.length + word.length >= clusterSize) {
			Wclusters.push(currentCluster);
			currentCluster = ` ${word}`;
		} else {

			currentCluster = `${currentCluster} ${word}`;
		}

	});

	return Wclusters;

}

//use google speech to transcribe 

async function transcribeAudio(audioPath, contextPhrase = '', language) {
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
		languageCode: language || 'en-US',
		speechContext: { ContextPhrases }
	};
	const request = {
		audio,
		config,
	};
	var data

	try { data = await speechClient.recognize(request); }
	catch (e) {
		console.error(e);
	} finally {
		const results = _lodash.get(data[0], 'results', []);
		const transcription = results
			.map(result => result.alternatives[0].transcript)
			.join('\n');
		//console.log(`Transcription: ${transcription}`);
		return transcription
	}




}

//transcibe using function transcribAudio function and returns trnscriptions
module.exports =



{

	//exports.transcriber = 
	transcriber: async function (audioPaths, phrase, language = 'en-GB') {


		if (audioPaths.constructor !== Array) {
			audioPaths = [audioPaths];
		}
		var wrong_file_flag = false
		audioPaths.forEach(function (value) {
			try { fs.readFileSync(value) }
			catch (err) {
				//console.log("file not found")

				wrong_file_flag = true;
			}

		});
		if (wrong_file_flag === true) {
			return -1;
		}
		//console.log("printing ayadf")
		//console.time('transcribe');

		var result
		var result_array = [];
		//creating tasks from audiofiles to be executed
		const tasks = audioPaths.map(audioPath => transcribeAudio(audioPath, phrase, language))
		//call a promise on all and wait untill all calls are completed

		var results
		try {
			results = await Promise.all(tasks)
			//console.log("transcription results in audio_transcribe=>")
			//console.log(results)
		} catch {
			console.error(e);
		}
		finally {
			return results
		}


	}



}