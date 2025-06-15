import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET () {
    const {userId} = await auth();
    if(!userId){
        return new NextResponse('User not logged in', {status : 404});
    }
    const _chats =await db.select().from(chats).where(eq(chats.userId, userId));
    const isPro = await checkSubscription();
    if(isPro || _chats.length < 3){
        return NextResponse.json({isSubscribed : true}, {status : 200})
    }
    if(!isPro && _chats.length === 3){
        return NextResponse.json({isSubscibed : false}, {status : 200});
    }

    // return NextResponse.json({isSubsc})
}