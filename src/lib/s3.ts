import AWS from 'aws-sdk';
export async function uploadToS3 (file : File){
    try{
        const s3 = new AWS.S3({
            region: process.env.NEXT_PUBLIC_AWS_REGION as string,
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string
            }
        })

        const file_key = 'upload/'+Date.now().toString()+file.name.replace(' ','-');
        const params = {
            Bucket : process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
            Key : file_key, // It will be unique
            Body : file,
        }
        const upload = s3.upload(params).on('httpUploadProgress', (e)=>{
            console.log("Uploading to S3", ((e.loaded/e.total)*100).toString());
        }).promise();
        upload.then(()=>{
            console.log("Successfully Uploaded to S3 ", file_key);
        })

        return {
            file_key,
            file_name : file.name
        }
    }catch(error){
        console.log("Error uploading to S3", error);
    }
}

export function getS3Url (file_key : string) {
    const url = `https://#{process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file_key}`;
    return url;
}