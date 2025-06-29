'use client'
import React, { useState } from 'react'
import { Button } from './button';
import axios from 'axios';

type Props = { isPro: boolean }

const SubscriptionButton = ({ isPro }: Props) => {
    const [loading, setLoading] = useState(false);
    const handleSubscription = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe");
            window.location.href = response?.data?.url;
        } catch (error) {
            console.error("Error : ", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button disabled={loading} onClick={
            handleSubscription} variant={'outline'}>
            {
                isPro ? "Manage Subscriptions" : "Get Pro"
            }
        </Button>
    )
}

export default SubscriptionButton