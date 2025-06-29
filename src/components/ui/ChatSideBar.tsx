'use client'
import { drizzleChat } from '@/lib/db/schema'
import Link from 'next/link';
import React from 'react'
import { Button } from './button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import SubscriptionButton from './SubscriptionButton';

type Props = {
    chats: drizzleChat[];
    chatId: number;
    isPro : boolean;
}

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {

    return (
        <div className='w-full h-screen p-4 text-gray-200 bg-gray-900 '>
            <Link href={'/'}>
                <Button className='w-full border-dashed border-white border cursor-pointer'>
                    <PlusCircle className='mr-2 w-4 h-4' />
                    Create New Chat
                </Button>
            </Link>
            <div className='flex flex-col gap-2 mt-4'>
                {
                    chats.map(chat => <Link key={chat?.id} href={`/chat/${chat.id}`}>
                        <div className={
                            cn('rounded-lg p-3 text-slate-300 flex item-center', {
                                'bg-blue-600 text-white': chat.id === chatId,
                                'hover:text-white': chat.id !== chatId
                            })
                        }>
                            <MessageCircle className='mr-2' />
                            <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{chat?.pdfName}</p>
                        </div>
                    </Link>)
                }
            </div>
            <div className='absolute bottom-4 left-4'>
                <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap'>
                    <Link href={'/'} >
                        Home
                    </Link>
                    <Link href={'/'}>
                        Source
                    </Link>
                </div>
                <SubscriptionButton isPro={isPro} />
            </div>
        </div>
    )
}

export default ChatSideBar