import {Configuration, OpenAIApi} from 'openai-edge';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req : Request) {
    try{
        const {messages} = await req.json();
        const result = await streamText({
            model: openai('gpt-3.5-turbo'), // this openai method gets the api key by default from env
            messages,
          });
        return result.toDataStreamResponse();
    }catch(error){

    }
}