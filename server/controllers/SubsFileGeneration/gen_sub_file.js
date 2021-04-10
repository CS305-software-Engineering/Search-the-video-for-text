
//A Web VTT file is supposed to look like this :
// WEBVTT

// 00:01.000 --> 00:04.000
// - Never drink liquid nitrogen.

// 00:05.000 --> 00:09.000
// - It will perforate your stomach.
// - You could die.
//The timestamps are supposed to be in one of two formats:

// mm:ss.ttt
// hh:mm:ss.ttt
//we will use the latter one

function addZeroes(x){
    
    
    if(x<10 && x >0){
    x=`0${x}`;
    }
    else if( x===0){
        x='00';
    }
    //else do nothing the format is crct
	return x;
}

function SecToStdFormat(secs, isSRT = false){

	const x = Number(secs);
	const hour = Math.floor(x / 3600);
	const minute = Math.floor(x % 3600 / 60);
	const second = Math.floor(x % 3600 % 60);
    //add zeroes to match format
	const hours = addZeroes(hour);
	const minutes = addZeroes(minute);
	const seconds = addZeroes(second);
    // hh:mm:ss.ttt
	return `${hours}:${minutes}:${seconds}${isSRT ? ',' : '.'}000`;

};



module.exports = function(transcripts, isSRT = false){
    //if webvtt file then header contains WEBVTTT else empty
	let sub = isSRT ? '' : 'WEBVTT\n\n';
    
	transcripts.forEach( (trans, i) => {
		const subContent = (i + 1) + "\n" + SecToStdFormat(trans.timeOffsets.start, isSRT) + " --> " + SecToStdFormat(trans.timeOffsets.end, isSRT) + "\n" + trans.transcription + "\n\n";
		sub += subContent;
	});
	console.log("inside sub gen")
	console.log(sub);

	

	return Promise.resolve(sub);

};