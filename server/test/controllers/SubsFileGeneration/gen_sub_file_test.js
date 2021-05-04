const assert = require('chai').assert;
const gen_sub = require('../../../controllers/SubsFileGeneration/gen_sub_file');
const { expect } = require('chai');
describe('Generate Sub File', function () {
    it('Generate sub file should return a string', function () {
        gen_sub([
            {
                transcription: '',
                timeOffsets: { start: 0, end: 10.75, duration: 10.75 }
            },
            {
                transcription: 'as you can see this is a test',
                timeOffsets: { start: 10.75, end: 11.39, duration: 0.64 }
            },
            {
                transcription: 'and this is a sample transcript',
                timeOffsets: { start: 11.39, end: 14.350000000000001, duration: 2.96 }
            },
            {
                transcription: 'we are taking for test',
                timeOffsets: {
                    start: 14.350000000000001,
                    end: 16.060000000000002,
                    duration: 1.71
                }
            },
            {
                transcription: 'and here we have used mocha',
                timeOffsets: { start: 16.060000000000002, end: 17.3, duration: 1.24 }
            },
            {
                transcription: 'for testing',
                timeOffsets: {
                    start: 17.300000000000004,
                    end: 20.130000000000003,
                    duration: 2.83
                }
            }
        ])
            .then(subs => {
                //console.log(transcriptions)
                assert.typeOf(subs, 'string')

            }).catch(error => {
                console.log("Error");
                console.log(error);
            });
        //let result = audio_transcribe.transcriber('test/assets/sample_audio.wav');

    });
    it('Generate sub file should return error if input is not an array of dictionaries', function () {
        gen_sub("sample text", false)
            .then(subs => {
                //console.log(transcriptions)

                expect(true).to.be.false;
            }).catch(error => {
                const errorMessageValidation = err.message.includes("Input not acceptable");
                expect(errorMessageValidation).to.be.true;

            });
        //let result = audio_transcribe.transcriber('test/assets/sample_audio.wav');

    });





});

