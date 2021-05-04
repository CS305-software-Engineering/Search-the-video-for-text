const { expect } = require('chai');
const fs = require('fs');
const supressLogs = require('mocha-suppress-logs');
const path = require('path');

const audioExtraction = require('../../../controllers/AudioProcessing/extract_audio');
const splitAudio = require('../../../controllers/AudioProcessing/split_audio');
const prepareAudio = require('../../../controllers/AudioProcessing/prepare-audio');

const rmDir = function (dirPath, removeSelf) {
    if (removeSelf === undefined)
      removeSelf = true;
    try {
      var files = fs.readdirSync(dirPath);
    } catch (e) {
      // throw e
      return;
    }
    if (files.length > 0)
      for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dirPath, files[i]);
        if (fs.statSync(filePath).isFile())
          fs.unlinkSync(filePath);
        else
          rmDir(filePath);
      }
    if (removeSelf)
      fs.rmdirSync(dirPath);
};

describe("Audio Processing", function(){
    supressLogs();
    describe("Audio Extraction", function(){
        it("Should Throw An Error When Given Wrong File Path", async function() {
            var videoFilePath = "server/tmp/invalidfile.mp4";
            try {
                await audioExtraction(videoFilePath, 1);
                expect(true).to.be.false;
            } catch (err) {
                const errorMessageValidation = err.message.includes("no such file or directory");
                expect(errorMessageValidation).to.be.true;
            }
        });
        it("Should Extract Audio From Given Video File", async function() {
            var videoFilePath = "server/test/controllers/AudioProcessing/assets/vid.mp4";
            var dummyJobId = 1;
            try {
                var audioFilePath = await audioExtraction(videoFilePath, dummyJobId);
                expect(audioFilePath).to.include(`${dummyJobId}.wav`);
                try { fs.unlinkSync(`server/tmp/${dummyJobId}.wav`); }
                catch(e) {}
                fs.readdir(`server/tmp/`, function(err, list){
                    if(err) throw err;
                    expect(list.indexOf(`${dummyJobId}.wav`)).to.equal(-1);
                });
            } catch(err) {
                expect(true).to.be.false;
            }
        }).timeout(10000);
    });
    describe("Split Audio", function(){
        it("Should Split Audio Based on Interval", async function() {
            var audioFilePath = 'server/test/controllers/AudioProcessing/assets/aud.wav';
            var dummyJobId = 1;
            try {
                var filePath = await splitAudio.atIntervals(audioFilePath, dummyJobId);
                fs.readdir(`server/tmp/`, function(err, list) {
                    if(err) throw err;
                    expect(list.indexOf(`_${dummyJobId}`)).to.not.equal(-1);
                });
            } catch(err) {
                expect(false).to.be.true;
            }
        });
        it("Should Split Audio Based on Silence", async function() {
            var audioFilePath = 'server/test/controllers/AudioProcessing/assets/aud.wav';
            var dummyJobId = 1;
            try {
                var filePath = await splitAudio.onSilence(audioFilePath, dummyJobId);
                expect(filePath.length).to.not.equal(0);
                fs.readdir('server/tmp/', function(err, list) {
                    if(err) throw err;
                    expect(list.indexOf(`__${dummyJobId}`)).to.not.equal(-1);
                });
            } catch(err) {
                expect(false).to.be.true;
            }
        }).timeout(10000);
    });
    describe("Prepare Audio", function() {
        it("Should throw an error when given wrong file path (w/o Duration)", async function() {
            var videoFilePath = "server/test/controllers/AudioProcessing/assets/invalid.mp4";
            var dummyJobId = 1;
            try {
                await prepareAudio(videoFilePath, dummyJobId);
                expect(true).to.be.false;
            } catch (err) {
                expect(true).to.be.true;
            }
        });
        it("Should throw an error when given wrong file path (w/ Duration)", async function() {
            var videoFilePath = "server/test/controllers/AudioProcessing/assets/invalid.mp4";
            var dummyJobId = 1;
            try {
                await prepareAudio(videoFilePath, dummyJobId, 3);
                expect(true).to.be.false;
            } catch (err) {
                expect(true).to.be.true;
            }
        });
    });
});