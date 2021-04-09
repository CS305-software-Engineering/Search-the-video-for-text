const ffprb = require('node-ffprobe');
process.env.FFPROBE_PATH = require('ffprobe-static').path;

module.exports = function(audios){

	return new Promise( (resolve, reject) => {

		let total_duration = 0;
	
		Promise.all(audios.map(file => {
			
			return new Promise( (resolve, reject) => {
			    ffprb(file, function(err, data){
					if(!err){
                        resolve(data.streams[0].duration);
					} 
                    else {
                        reject(err);
					}
				})
			} );
		
		}))
		.then(durations => {
			const indices = durations.map(dur => {
				const info = {
					start : total_duration,
					end  : total_duration + dur,
					duration : dur
				};

				total_duration += dur;

				return info;

			})
			
			resolve(indices);
		})
		.catch(err => {
			console.log(err);
			reject(err);
		});

	});

};