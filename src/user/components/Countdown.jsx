// src/components/CountdownTimer.jsx
import React, { useEffect, useState } from 'react';

const Countdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(interval); // Clear the interval when component unmounts
    }, [targetDate]);

    function calculateTimeLeft(targetDate) {
        const total = Date.parse(targetDate) - Date.parse(new Date());
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((total % (1000 * 60)) / 1000);

        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }

    return (
        <div className="flex items-center gap-2">
            {timeLeft.total <= 0 ? (
                <span className="text-red-500 text-2xl">Event Ended</span>
            ) : (
                <>
                    <span className="text-black font-medium">Registration Closes In:</span>
                    <div className="flex gap-2">
                        <div className="bg-[#19105b] text-white px-4 py-2 rounded-lg text-lg font-semibold">
                            {timeLeft.days}d
                        </div>
                        <div className="bg-[#19105b] text-white px-4 py-2 rounded-lg text-lg font-semibold">
                            {timeLeft.hours}h
                        </div>
                        <div className="bg-[#19105b] text-white px-4 py-2 rounded-lg text-lg font-semibold">
                            {timeLeft.minutes}m
                        </div>
                        <div className="bg-[#19105b] text-white px-4 py-2 rounded-lg text-lg font-semibold">
                            {timeLeft.seconds}s
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Countdown;