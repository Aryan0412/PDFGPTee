import toast from "react-hot-toast";
import AWS from 'aws-sdk';

export async function downloadFromS3(file_key : string) {
    try{
        const s3 = new AWS.S3({
            region: process.env.NEXT_PUBLIC_AWS_REGION as string,
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string
            }
        })
        const params = {
            Bucket : process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
            Key : file_key
        };
        const obj = await s3.getObject(params).promise();
        
    }catch(error){
        toast.error("Error in downloading file");
        return null;
    }
} 