const Job = require('./job.js');
const S3_Service = require("../Storage Service/s3_bucket_operations.js")
var fs = require('fs');

const maximumConcurrentJobs = process.env.MAX_JOBS_RUNNING || 5;
const tempPath = "server/tmp";
const jobsQueue = [];
const jobsInProgress = [];
const activeJobs = {};


function _createJob(ID, language = 'en-GB') {
    const job = new Job(ID, language);
    activeJobs[ID] = job;
    jobsQueue.push(job);
}

function createJob(file, language = 'en-GB') {
    const jobID = new Date().valueOf();
    if(jobsQueue.length < maximumConcurrentJobs) {
        return new Promise((resolve, reject) => {
            const filePath = `${tempPath}/${jobID}`;
            fs.writeFile(filePath, file, (err) => {
				if(err){
					reject(err);
				} else {
                    _createJob(jobID, language);
					resolve(jobID);
				}
			});
        });
    } else {
        console.log('Uploading to Bucket');
        const filePath = `${tempPath}/${jobID}`;
        const promise = S3_Service.uploadObject(filePath, file).then(() => {
            console.log("Success");
            _createJob(jobID);
            return jobID;
        })
        .catch(error => {
            console.log("Error");
            console.log(error);
        });
        return promise;
    }
}

function getJob(ID) {
    if(activeJobs[ID]==undefined) return false;
    return activeJobs[ID];
}

function checkJob(ID) {
    const job = getJob(ID);
    if(!job) throw `No Job with ID ${ID} exists`;
    return job.finished;
}

function numberOfJobsInProgress(){
    return jobsInProgress.length;
}

function maxJob() {
    return maximumConcurrentJobs;
}

module.exports = {
	create : createJob,
    get: getJob,
    check: checkJob,
    number: numberOfJobsInProgress,
    max: maxJob
};