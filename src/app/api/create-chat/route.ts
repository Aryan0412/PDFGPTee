// api/create-chat/

import { loadS3IntoPinecode } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        const pages = await loadS3IntoPinecode(file_key);
        
        return NextResponse.json({pages});
    } catch (error) {
        console.error("Error", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}