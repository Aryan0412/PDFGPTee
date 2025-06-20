'use client'
import { uploadToS3 } from '@/lib/s3';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React, {useState } from 'react'
import { useDropzone } from 'react-dropzone';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
const FileUpload = () => {
    const router = useRouter();
    const [uploading, setUploading] = useState<boolean>(false);
    const { mutate, isPending } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }) => {
            const response = await axios.post(`/api/create-chat`, {
                file_key, file_name
            });
            return response.data;
        }
    });
    const {data} = useQuery({
        queryKey : ["check-subscription"],
        queryFn : async () => {
            const response = await axios.get('/api/free-trial');
            return response.data;
        }
        
    })
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            setUploading(true);
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size is too large");
                return;
            }
            try {
                const data = await uploadToS3(file);
                if (!data?.file_key || !data?.file_name) {
                    toast.error("Something went wrong");
                    return;
                }
                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        toast.success("Chat created successfully");
                        router.push(`/chat/${chat_id}`);
                    },
                    onError: (error) => {
                        toast.error("Error creating chat");
                        console.error(error)
                    }
                });
            } catch (error) {
                console.log("Error uploading to S3", error);
            }
            finally {
                setUploading(false);
            }
        }
    });
    return (
        <div className='p-2 bg-white rounded-xl' >
            <div {...getRootProps({
                className: 'border-2 border-dashed rounded-xl p-8 cursor-pointer bg-gray-50 flex justify-center items-center flex-col'
            })}>
                <input {...getInputProps()} disabled={!data?.isSubscribed} />
                {
                    uploading || isPending ? (<><Loader2 className='h-10 w-10 text-blue-500 animate-spin' /></>) : (<>
                        <Inbox className='w-10 h-10 text-blue-500' />
                        <p className='mt-2 text-sm text-slate-400'>{data?.isSubscribed ? "Drop PDF here or click to upload" : "Free trial is over"}</p>
                    </>)
                }

            </div>
        </div>
    )
}

export default FileUpload