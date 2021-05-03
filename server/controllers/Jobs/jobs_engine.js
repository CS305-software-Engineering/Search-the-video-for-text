const { work, check, create, get, number, max, checkJobs } = require('./jobs');

setInterval(checkJobs, 1000);
setInterval(work, 5000);

module.exports = {
	create : create,
    get: get,
    check: check,
    number: number,
    max: max,
};