const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'us-east-2'
});

const BUCKET_NAME = process.env.BUCKET_NAME


function uploadObjectToS3Bucket(file_name , data, bucket_name = BUCKET_NAME){
    const promise =  new Promise((resolve, reject) => {
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
    });
    console.log(promise);
    return promise;
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

function getSignedUrlOfObject(file_name, bucket_name = BUCKET_NAME){
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject',{
            Bucket : bucket_name,
            Key: file_name,
            Expires: (60*60*24)*7
        }, (err,url) => {
            if(err){
                reject(err)
            }else{
                resolve(url)
            }
        })
    })
}

module.exports = {
    uploadObject : uploadObjectToS3Bucket,
    downloadObject : downloadObjectFromS3Bucket,
    checkObject : checkObjectFromInBucket,
    deleteObject : deleteObjectFromBucket,
    getSignedURL : getSignedUrlOfObject
}