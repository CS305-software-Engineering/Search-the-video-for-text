const fs = require('fs');
const rimraf = require('rimraf');
const S3_Service = require("../Storage Service/s3_bucket_operations.js")

const tmpPath = process.env.TMP_PATH || 'server/tmp';


module.exports = function(jobID){

	return new Promise( (resolve, reject) => {

		rimraf(`${tmpPath}/${jobID}`, function(){
			rimraf(`${tmpPath}/${jobID}.wav`, function(){
				rimraf(`${tmpPath}/_${jobID}`, function(){
					rimraf(`${tmpPath}/__${jobID}`, resolve);
				});
			});
		});

		S3_Service.deleteObject(`${tmpPath}/${jobID}`)
			.catch(err => {
				console.log(err);
			})
		;

	})

}