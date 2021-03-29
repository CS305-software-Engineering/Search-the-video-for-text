const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const BUCKET_NAME = process.env.BUCKET_NAME


function uploadObjectToS3Bucket(file_name , data, bucket_name = BUCKET_NAME){
    return new Promise((resolve, reject) => {
        s3.putObject({
            Bucket : bucket_name,
            Key: file_name,
            Body : data
        }, err => {
            if(err){
                reject(err)
            }else{
                resolve()
            }
        })
    })
}

function downloadObjectFromS3Bucket(file_name, bucket_name = BUCKET_NAME){
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket : bucket_name,
            Key: file_name,
        }, (err, data) => {
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
}

function checkObjectFromInBucket(file_name, bucket_name = BUCKET_NAME){
    return new Promise((resolve, reject) => {
        s3.headObject({
            Bucket : bucket_name,
            Key: file_name,
        }, (err, data) => {
            if(err){
                if(err.code == 'NotFound'){
                    resolve(false)
                }else{
                    reject(err)
                }
            }else{
                resolve(data)
            }
        })
    })
}


function deleteObjectFromBucket(file_name, bucket_name = BUCKET_NAME){
    return new Promise((resolve, reject) => {
        s3.deleteBucket({
            Bucket : bucket_name,
            Key: file_name,
        }, err => {
            if(err){
                reject(err)
            }else{
                resolve(true)
            }
        })
    })
}

module.exports = {
    uploadObject : uploadObjectToS3Bucket,
    downloadObject : downloadObjectFromS3Bucket,
    checkObject : checkObjectFromInBucket,
    deleteObject : deleteObjectFromBucket
}