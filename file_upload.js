const AWS = require('aws-sdk');

module.exports = (picture, id) => {
  
  let buf = new Buffer(picture.replace(/^data:image\/\w+;base64,/, ''),'base64');
  const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  const params = {
    ACL: 'public-read',
    Bucket: 'thoughtline', // pass your bucket name
    Key: `${id}.jpeg`, // file will be saved as the file name will be the user _id.jpeg
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    CacheControl: 'no-cache',
  };

  return new Promise ((resolve, reject) => {
    s3.upload(params, (err, data) => err ? reject(err) : resolve(data));
  });
  

};

