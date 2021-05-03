const { expect } = require('chai');
var fs = require('fs');
const supressLogs = require('mocha-suppress-logs');

var jobHandler = require('../../../controllers/Jobs/jobs');
var cleanUp = require('../../../controllers/Jobs/clean-up');

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
});
