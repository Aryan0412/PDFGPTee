'use client'
import React from 'react'

type Props = {pdf_url : string}

const PdfViewer = ({pdf_url}: Props) => {
  return (
    <iframe src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`} className='w-full h-full' />
  )
}

export default PdfViewer