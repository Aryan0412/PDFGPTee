// api/create-chat/

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecode } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const {userId} = await auth();
    if(!userId){
        return NextResponse.json({error : "unauthorized"}, {status : 401});
    }
    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        await loadS3IntoPinecode(file_key);

        // After loading all the vectors in pinecone db, we will move the chat to our database.
        const chatId = await db.insert(chats).values({
            pdfName : file_name,
            pdfUrl : getS3Url(file_key),
            userId : userId,
            fileKey : file_key
        }).returning({
            insertedId : chats.id
        });

        return NextResponse.json({
            chat_id : chatId[0].insertedId
        }, {status : 200});
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}