
const videoFormatChecker = require('../../middleware/upload_middleware.js').videoFormatChecker

function receiveFile(req){
    
    return new Promise((resolve,reject)=>{
        let file_chunks = []
        let fileType = null

        req.on('data',function (data){

            console.log('GOT DATA')
            file_chunks.push(data)

        })

        req.on('error', function(err){
            reject(err)
        })

        req.on('end', function (){
            console.log('Chunks Lengths ',file_chunks.length)
            fileType = true //videoFormatChecker(Buffer.concat(file_chunks))
            if(fileType == false){
                reject({
                    message : 'File Type Invalid'
                });
            }else{
                resolve(Buffer.concat(file_chunks))
            }
            
        })

    })
}


module.exports = {
    receiveFile
}