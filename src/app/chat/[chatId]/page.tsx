import ChatSideBar from '@/components/ui/ChatSideBar';
import PdfViewer from '@/components/ui/PdfViewer';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: {
    chatId: string;
  }
}

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/sign-in');
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId)); // making query to database that, get the list of chats from db table chats where chats.userId is equal to userId;
  if (!_chats) {
    return redirect('/');
  }
  if(!_chats.find(chat=>chat.id === parseInt(chatId))){
    return redirect('/');
  }

  const currentChat = _chats.find(chat=>chat?.id === parseInt(chatId));
  return (
    <div className='flex max-h-screen overflow-scroll'>
      <div className='flex w-full max-h-screen overflow-scroll'>
        <div className='flex-[1] max-w-xs '>
          <ChatSideBar chatId={parseInt(chatId)} chats={_chats} />
        </div>
        <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
          <PdfViewer pdf_url={currentChat?.pdfUrl || ''} />
        </div>
        <div className='flex-[3] border-l-4 border-l-slate-200'>
          {/* <ChatComponent /> */}
        </div>
      </div>
    </div>
  )
}

export default ChatPage;