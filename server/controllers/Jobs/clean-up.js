const fs = require('fs');
const rimraf = require('rimraf');
const S3_Service = require("../Storage Service/s3_bucket_operations.js")

const tmpPath = process.env.TMP_PATH || '../../tmp';


module.exports = function(jobID){

	return new Promise( (resolve) => {

		rimraf(`${tmpPath}/${jobID}`, function(){
			rimraf(`${tmpPath}/_${jobID}`, function(){
				rimraf(`${tmpPath}/__${jobID}`, resolve);
			});
		});

		S3_Service.deleteObject(`${tempPath}/${jobID}`)
			.catch(err => {
				debug(err);
			})
		;

	})
	.catch(err => debug(err));

}