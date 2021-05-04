const { expect } = require('chai');
const fs = require('fs');
const supressLogs = require('mocha-suppress-logs');

const jobHandler = require('../../../controllers/Jobs/jobs');
const cleanUp = require('../../../controllers/Jobs/clean-up');
const Job = require('../../../controllers/Jobs/job');

describe("Jobs", function(){
    supressLogs();
    describe("Job Handler", function(){

        it("Should Create Job Successfully and Save File in tmp", async function(){
            var dummyFile = Buffer.from('Hello World');
            const jobId = await jobHandler.create(dummyFile);
            // Should Return an Integer JobID
            expect(jobId).to.be.a('number').above(0).and.satisfy(Number.isInteger);
            
            const job = jobHandler.get(jobId);
            // Should Return a Valid Instance of Job Class
            expect(job).to.not.equal(undefined);
            expect(jobHandler.number()).to.equal(0);

            // Should Have Written the File Properly in the server
            try { fs.unlinkSync(`server/tmp/${jobId}`); }
            catch(e) {}
            fs.readdir(`server/tmp/`, function(err, list){
                if(err) throw err;
                expect(list.indexOf(`${jobId}`)).to.equal(-1);
            });
        });

        it("Should handle Missing Job ID", function(){
            var job = jobHandler.get(1);
            expect(job).to.equal(false);
        });

        it("Should always have Maximum Concurrent Jobs As Greater than Zero", function(){
            var countConcurrentJobs = jobHandler.max();
            expect(countConcurrentJobs>0).to.be.true;
        });

        it("Should Not Remove Job From Queue if Unfinished", async function(){
            var dummyFile = Buffer.from("Hello World");
            const jobId = await jobHandler.create(dummyFile);
            expect(jobHandler.check(jobId)).to.equal(undefined);
            jobHandler.checkJobs();
            expect(jobHandler.check(jobId)).to.equal(undefined);
            // Should Have Written the File Properly in the server
            try { fs.unlinkSync(`server/tmp/${jobId}`); }
            catch(e) {}
            fs.readdir(`server/tmp/`, function(err, list){
                if(err) throw err;
                expect(list.indexOf(`${jobId}`)).to.equal(-1);
            });
        });

        it("Should Clean Up Files From the Server", async function(){
            var dummyFile = Buffer.from('Hello World');
            const jobId = await jobHandler.create(dummyFile);
            await cleanUp(jobId);
            fs.readdir(`server/tmp/`, function(err, list){
                if(err) throw err;
                console.log(list);
                expect(list.indexOf(`${jobId}`)).to.equal(-1);
            });
        });

    });

    describe("Job Class", function() {
        it("Should be able to create an Instance of Job Class", function() {
            var dummyJobId = 1;
            var dummyLanguage = 'en-GB';
            try {
                var dummyJob = new Job(dummyJobId, dummyLanguage);
                expect(dummyJob.id).to.be.equal(dummyJobId);
                expect(dummyJob.lng).to.be.equal(dummyLanguage);
                expect(dummyJob.isCompleted).to.be.false;
                expect(dummyJob.inProgress).to.be.false;
                expect(dummyJob.transcription).to.be.equal(undefined);
            } catch (err) {
                expect(false).to.be.true;
            }
        });
        it("Should Not Start the Process if the video file is not present either on server or AWS Bucket", async function() {
            var dummyJobId = 1;
            var dummyLanguage = 'en-GB';
            var dummyJob = new Job(dummyJobId, dummyLanguage);
            try {
                await dummyJob.start();
                expect(false).to.be.true;
            } catch (err) {
                expect(false).to.be.false;
            }
        })
    });
});
