'use client'
import React, { useEffect } from 'react';
import { Input } from './input';
import { Message, useChat } from '@ai-sdk/react';
import { Button } from './button';
import { Send } from 'lucide-react';
import MessageList from './MessageList';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


type Props = {chatId : number}

const ChatComponent = ({chatId}: Props) => {
    const {data, isLoading} = useQuery({
        queryKey : ["chat", chatId],
        queryFn : async () => {
            const response = await axios.post<Message[]>('/api/get-messages', {chatId});
            return response.data;
        }
        
    })

    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api : '/api/chat',
        body : {
            chatId
        },
        initialMessages :data || []
    });

    useEffect(()=>{
        const messageContainer = document.getElementById('message-container');
        if(messageContainer){
            messageContainer.scrollTo({
                top : messageContainer.scrollHeight,
                behavior : 'smooth'
            })
        }
    }, [messages])
    return (
        <div className='relative max-h-screen overflow-scroll' id='message-container' >
            <div className='sticky top-0 insert-x-0 p-2 bg-white h-fit'>
                <h3 className='text-xl font-bold'>Chat</h3>
            </div>
            <MessageList messages={messages} isLoading={isLoading} />
            <form onSubmit={handleSubmit} className='flex sticky bottom-0 insert-x-0 px-2 py-4 bg-white'>
                <Input value={input} onChange={handleInputChange} placeholder='Ask any question...' className='w-full' />
                <Button className='bg-blue-600 ml-2' >
                    <Send className='h-4 w-4' />
                </Button>
            </form>
        </div>
    )
}

export default ChatComponent