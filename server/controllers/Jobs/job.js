const fs = require('fs');
const S3_Service = require("../Storage Service/s3_bucket_operations.js")
const prepareAudio = require("../AudioProcessing/prepare-audio.js");
const audio_transcribe = require("../AudioTranscription/audio_transcribe");
const getTimeIndexes = require("../AudioProcessing/media_info");

const tempPath = process.env.TMP_PATH || './server/tmp';

class Job{
    
    constructor(id, lng) {
        this.id = id;
        this.lng = lng;
        this.isCompleted = false;
        this.inProgress = false;
        this.transcription = undefined;
    }

    start() {
        console.log(`Starting the Job with ID ${this.id}`);
        const destination = `${tempPath}/${this.id}`;
        new Promise((resolve, reject) => {
            fs.access(destination, (error) => {
                if(error) {
                    console.log(error);
                    console.log('File Not Present on the Server, Fetch from Amazon Bucket');
                    S3_Service.downloadObject(`tmp/${this.id}`)
                    .then(data => {
                        console.log('Data Arrived From the Server');
                        fs.writeFile(destination, data, (err) => {
                            if(err) reject(err);
                            else resolve(destination);
                        })
                    })
                    .catch(err => {
                        console.log('Could Not Fecth File From Amazon Bucket');
                        this.failed = true;
                        reject(err);
                    });
                } else {
                    console.log('File Already Present on the Server');
                    resolve(destination);
                }
            });
        })
        .then(fileDestination => {
            prepareAudio(fileDestination, this.id, process.env.AUDIO_MAX_DURATION_TIME || 55)
            .then(audio => audio_transcribe.transcriber(audio, undefined, this.language))
            .then(transcriptions => {
                if(transcriptions.length > 1) {
                    transcriptions = transcriptions.join(' ');
                } else {
                    transcriptions = transcriptions[0];
                }
                return prepareAudio(fileDestination, this.id) 
                .then(files => {
                    return getTimeIndexes(files)
                    .then(durations => {
                        return {
                            files, 
                            durations
                        };
                    });
                })
                .then(data => {
                    return audio_transcribe.transcriber(data.files, transcriptions, this.language)
                    .then(transcriptions => {
                        return transcriptions.map( (transcript, index) => {
                            return {
                                transcription: transcript,
                                timeOffsets: data.durations[index]
                            };
                        } );
                    })
                    .then(transcribedChunks => {
                        return {
                            whole: transcriptions,
                            transcribedChunks
                        }
                    });
                })
            })
            .then(transcriptions => {

                this.transcription = transcriptions;
                this.finished = true;
                // TODO: Clean Up this.id

            });
        })
        .catch(error => {
            console.log(error);
            this.failed = true;
            // TODO: Clean Up this.id 
        });
    }

}

module.exports = Job;