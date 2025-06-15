import { auth } from "@clerk/nextjs/server"
import { db } from "./db";
import { userSubscription } from "./db/schema";
import { eq } from "drizzle-orm";

const DAY_IN_MILISECONDS = 1000 * 60 * 60 * 24;

export const checkSubscription = async () => {
    const { userId } = await auth();
    if (!userId) {
        return false;
    }

    const _userSubscriptions = await db.select().from(userSubscription).where(eq(userSubscription.userId, userId));
    if (!_userSubscriptions[0]) {
        return false;
    }

    const userSubscribed = _userSubscriptions[0];
    // const isValid = userSubscribed.stripePriceId && userSubscribed.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MILISECONDS > Date.now();
    const isValid = userSubscribed.stripePriceId;
    if(isValid){
        return true;
    }

    return false;
}