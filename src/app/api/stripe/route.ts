import { db } from "@/lib/db";
import { userSubscription } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import {  } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { url } from "inspector";
import { NextResponse } from "next/server";

const return_url = process.env.NEXT_BASE_URL + '/';
export async function GET() {
    try {
        const {userId} = await auth();
        const user = await currentUser();

        if(!userId){
            return new NextResponse('unauthorized', {status : 401});
        }

        const _userSubscription = await db.select().from(userSubscription).where(eq(userSubscription.userId , userId));
        if(_userSubscription[0] && _userSubscription[0].stripeCustomerId){

            //trying to cancel at the billing portal
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer : _userSubscription[0].stripeCustomerId,
                return_url :return_url
            });

            return NextResponse.json({url : stripeSession?.url});

        }
        //user first time trying to subscribe
        const stripeSession = await stripe.checkout.sessions.create({
            success_url : return_url,
            cancel_url : return_url,
            payment_method_types : ['card'],
            mode : 'subscription',
            billing_address_collection : 'auto',
            customer_email : user?.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data : {
                        currency : 'INR',
                        product_data : {
                            name : 'pdfgptee pro',
                            description : 'Unlimited PDF sessions!'
                        },
                        unit_amount : 30000,
                        recurring : {
                            interval : 'month'
                        }
                    },
                    quantity : 1
                }
            ],
            metadata : {
                userId
            }
        })
        return NextResponse.json({url : stripeSession.url});

    }catch(error){
        console.error("Stripe Error : ", error);
        return new NextResponse('Internal server error', {status : 500});
    }
}