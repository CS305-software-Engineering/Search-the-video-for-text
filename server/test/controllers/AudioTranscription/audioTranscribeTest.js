const assert = require('chai').assert;
const audio_transcribe = require('../../../controllers/AudioTranscription/audio_transcribe');
const { expect } = require('chai');
describe('audio_transcribe', function () {
    it('transcriber should return string  (phrase missing)', function () {
        audio_transcribe.transcriber('test/assets/sample_audio.wav', undefined, "en-us")
            .then(transcriptions => {
                //console.log(transcriptions)
                assert.typeOf(transcriptions[0], 'string')
                
            }).catch(error => {
                console.log("Error");
                console.log(error);
            });
        //let result = audio_transcribe.transcriber('test/assets/sample_audio.wav');

    });
    it('transcriber should return string (phrase available)', function () {
        audio_transcribe.transcriber('test/assets/sample_audio.wav', "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquet lectus proin nibh nisl condimentum id venenatis. Mauris rhoncus aenean vel elit scelerisque mauris. Tellus id interdum velit laoreet id donec. Eu sem integer vitae justo eget magna fermentum iaculis. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Adipiscing vitae proin sagittis nisl rhoncus. A diam sollicitudin tempor id eu nisl nunc. Mattis rhoncus urna neque viverra justo nec ultrices. Dui sapien eget mi proin sed libero. Eget nunc lobortis mattis aliquam faucibus. Libero volutpat sed cras ornare arcu. Rhoncus est pellentesque elit ullamcorper.Faucibus nisl tincidunt eget nullam non nisi est sit.Dolor sit amet consectetur adipiscing elit ut aliquam purus sit.Turpis cursus in hac habitasse platea dictumst.Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant.Nisl rhoncus mattis rhoncus urna neque viverra justo.Condimentum lacinia quis vel eros.Sit amet nisl purus in mollis nunc sed.Magnis dis parturient montes nascetur ridiculus mus mauris vitae.Consectetur libero id faucibus nisl tincidunt.At erat pellentesque adipiscing commodo elit at imperdiet.Amet porttitor eget dolor morbi non.Lobortis feugiat vivamus at augue eget.Porttitor rhoncus dolor purus non.At imperdiet dui accumsan sit amet nulla facilisi.Semper auctor neque vitae tempus quam pellentesque nec.Ac ut consequat semper viverra nam libero justo laoreet.", "en-us")
            .then(transcriptions => {
                //console.log(transcriptions)
                assert.typeOf(transcriptions[0], 'string')

            }).catch(error => {
                console.log("Error");
                console.log(error);
            });
        //let result = audio_transcribe.transcriber('test/assets/sample_audio.wav');

    });
    it('transcriber should return error if file not found', async function () {
        var transcriptions = await audio_transcribe.transcriber('test/assets/sample_audio_invalid.wav', undefined, "en-us")
        //console.log(transcriptions)
        expect(transcriptions).to.be.equal(-1)

    });




});

