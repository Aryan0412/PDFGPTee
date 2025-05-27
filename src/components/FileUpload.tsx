'use client'
import { Inbox } from 'lucide-react';
import React from 'react'
import {useDropzone} from 'react-dropzone';
const FileUpload = () => {
    const {getRootProps, getInputProps} = useDropzone({
        accept : {'application/pdf' : ['.pdf']},
        maxFiles : 1,
        onDrop : (acceptedFiles) => {
            console.log(acceptedFiles);
        }
    });
  return (
    <div className='p-2 bg-white rounded-xl' >
        <div {...getRootProps({
            className : 'border-2 border-dashed rounded-xl p-8 cursor-pointer bg-gray-50 flex justify-center items-center flex-col'
        })}>
            <input {...getInputProps()}  />
            <>
                <Inbox className='w-10 h-10 text-blue-500' />
                <p className='mt-2 text-sm text-slate-400'>Drop PDF here or click to upload</p>
            </>
        </div>
    </div>
  )
}

export default FileUpload