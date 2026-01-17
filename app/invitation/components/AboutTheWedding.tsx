"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const AboutTheWedding = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const targetDate = new Date("2026-03-07T16:00:00+08:00").getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    ),
                    minutes: Math.floor(
                        (difference % (1000 * 60 * 60)) / (1000 * 60)
                    ),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check on mount
        checkMobile();

        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Desktop Version
    if (!isMobile) {
        return (
            <section className="w-full bg-[#1B251E] text-white">
                <div className="flex flex-row items-stretch">
                    <div className="w-1/2 flex flex-col items-center justify-center py-20">
                        <div className="flex flex-col items-center">
                            <figure>
                                <Image
                                    src="/Date Design 2.png"
                                    alt="Wedding Date"
                                    width={500}
                                    height={113}
                                    className="w-[500px] h-auto"
                                    priority
                                />
                            </figure>
                            <h2 className="font-italianno text-[clamp(35px,4.16vw,80px)] tracking-widest px-[clamp(20px,8vw,160px)] text-center mb-16">
                                About The Wedding
                            </h2>
                            <div className="justify-center text-center font-oswald text-2xl font-light text-white tracking-[0.2rem]">
                                <h3>Date & Time</h3>
                                <time dateTime="2026-03-07T16:00:00+08:00">
                                    March 7, 2026 - SATURDAY | 4:00 PM
                                </time>
                            </div>
                            <figure className="mt-8 w-full max-w-[603px]">
                                <Image
                                    src="/Line 1.svg"
                                    alt="Decorative Line"
                                    width={603}
                                    height={3}
                                    className="w-full h-auto"
                                />
                            </figure>
                            <p className="my-8 justify-center text-center font-italianno text-3xl text-white tracking-[0.05rem]">
                                Counting down to a day blessed by Jehovah!
                            </p>
                            <div className="w-full max-w-[350px]">
                                <div className="grid grid-cols-7 text-center font-big-shoulders-inline text-white" role="timer" aria-live="polite">
                                    {/* Time Line */}
                                    <span className="text-4xl tracking-widest" aria-label={`${timeLeft.days} days`}>
                                        {timeLeft.days}
                                    </span>
                                    <span className="text-4xl tracking-widest" aria-hidden="true">:</span>
                                    <span className="text-4xl tracking-widest" aria-label={`${timeLeft.hours} hours`}>
                                        {timeLeft.hours
                                            .toString()
                                            .padStart(2, "0")}
                                    </span>
                                    <span className="text-4xl tracking-widest" aria-hidden="true">:</span>
                                    <span className="text-4xl tracking-widest" aria-label={`${timeLeft.minutes} minutes`}>
                                        {timeLeft.minutes
                                            .toString()
                                            .padStart(2, "0")}
                                    </span>
                                    <span className="text-4xl tracking-widest" aria-hidden="true">:</span>
                                    <span className="text-4xl tracking-widest" aria-label={`${timeLeft.seconds} seconds`}>
                                        {timeLeft.seconds
                                            .toString()
                                            .padStart(2, "0")}
                                    </span>

                                    {/* Labels Line */}
                                    <span className="text-sm tracking-widest uppercase">Days</span>
                                    <span aria-hidden="true"></span>
                                    <span className="text-sm tracking-widest uppercase">Hrs</span>
                                    <span aria-hidden="true"></span>
                                    <span className="text-sm tracking-widest uppercase">Mins</span>
                                    <span aria-hidden="true"></span>
                                    <span className="text-sm tracking-widest uppercase">Sec</span>
                                </div>
                            </div>
                            <figure className="my-8 w-full max-w-[603px]">
                                <Image
                                    src="/Line 1.svg"
                                    alt="Decorative Line"
                                    width={603}
                                    height={3}
                                    className="w-full h-auto"
                                />
                            </figure>
                            <address className="mb-8 justify-center text-center font-oswald text-2xl font-light text-white tracking-[0.2rem] not-italic">
                                Zion Events Place, Holiday Hills,
                                <br />
                                Brgy. San Antonio, San Pedro Laguna
                            </address>
                            <a
                                href="https://maps.app.goo.gl/VVccHo1wBkdRZ9Bn6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-transparent border border-[#7A8850] text-white text-sm rounded-sm px-8 py-2 font-oswald transition-all duration-200 hover:bg-[#7A8850] hover:text-white hover:-translate-y-px active:translate-y-0"
                            >
                                VIEW MAP
                            </a>
                        </div>
                    </div>

                    <figure className="w-1/2 relative overflow-hidden">
                        <Image
                            src="/Zions_Place 1.png"
                            alt="Zions Place"
                            fill
                            className="object-cover"
                        />
                    </figure>
                </div>
            </section>
        );
    }

    // Mobile Version
    return (
        <>
        <figure className="w-full relative aspect-4/3">
            <Image
                src="/Zions_Place 1.png"
                alt="Zions Place"
                fill
                className="object-cover"
            />
        </figure>
        <section className="w-full bg-[#1B251E] text-white px-7 sm:px-12 py-14 sm:py-20">
            <div className="flex flex-col items-center text-center">
                <figure>
                    <Image
                        src="/Date Design 2.png"
                        alt="Wedding Date"
                        width={219}
                        height={47}
                        className="w-[219px] sm:w-[320px] h-auto"
                        priority
                    />
                </figure>
                <h2 className="font-italianno text-[clamp(35px,10vw,50px)] tracking-wider text-center mb-7">
                    About The Wedding
                </h2>
                <div className="font-oswald text-sm md:text-lg font-light text-white tracking-wider">
                    <h3>Date & Time</h3>
                    <time dateTime="2026-03-07T16:00:00+08:00">
                        March 7, 2026 - SATURDAY | 4:00 PM
                    </time>
                </div>
                <figure className="my-7 w-full max-w-[250px] sm:max-w-[400px]">
                    <Image
                        src="/Line 1.svg"
                        alt="Decorative Line"
                        width={250}
                        height={3}
                        className="w-full h-auto"
                    />
                </figure>
                <p className="justify-center text-center font-italianno text-xl sm:text-2xl text-white tracking-[0.05rem]">
                    Counting down to a day blessed by Jehovah!
                </p>
                <div className="w-full max-w-[280px] sm:max-w-[450px]">
                    <div className="grid grid-cols-7 text-center font-big-shoulders-inline text-white" role="timer" aria-live="polite">
                        {/* Time Line */}
                        <span className="text-3xl sm:text-5xl tracking-widest" aria-label={`${timeLeft.days} days`}>
                            {timeLeft.days}
                        </span>
                        <span className="text-3xl sm:text-5xl tracking-widest" aria-hidden="true">:</span>
                        <span className="text-3xl sm:text-5xl tracking-widest" aria-label={`${timeLeft.hours} hours`}>
                            {timeLeft.hours.toString().padStart(2, "0")}
                        </span>
                        <span className="text-3xl sm:text-5xl tracking-widest" aria-hidden="true">:</span>
                        <span className="text-3xl sm:text-5xl tracking-widest" aria-label={`${timeLeft.minutes} minutes`}>
                            {timeLeft.minutes.toString().padStart(2, "0")}
                        </span>
                        <span className="text-3xl sm:text-5xl tracking-widest" aria-hidden="true">:</span>
                        <span className="text-3xl sm:text-5xl tracking-widest" aria-label={`${timeLeft.seconds} seconds`}>
                            {timeLeft.seconds.toString().padStart(2, "0")}
                        </span>

                        {/* Labels Line */}
                        <span className="text-[10px] sm:text-sm tracking-widest uppercase">Days</span>
                        <span aria-hidden="true"></span>
                        <span className="text-[10px] sm:text-sm tracking-widest uppercase">Hrs</span>
                        <span aria-hidden="true"></span>
                        <span className="text-[10px] sm:text-sm tracking-widest uppercase">Mins</span>
                        <span aria-hidden="true"></span>
                        <span className="text-[10px] sm:text-sm tracking-widest uppercase">Sec</span>
                    </div>
                </div>
                <figure className="my-7 w-full max-w-[250px] sm:max-w-[400px]">
                    <Image
                        src="/Line 1.svg"
                        alt="Decorative Line"
                        width={250}
                        height={3}
                        className="w-full h-auto"
                    />
                </figure>
                <address className="font-oswald text-sm sm:text-lg font-light text-white tracking-wider mb-6 not-italic">
                    Zion Events Place, Holiday Hills, Brgy. San Antonio,
                    <br />
                    San Pedro Laguna
                </address>
                <a
                    href="https://maps.app.goo.gl/VVccHo1wBkdRZ9Bn6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-transparent border border-[#7A8850] text-white text-xs sm:text-sm rounded-sm px-4 sm:px-8 py-2 font-oswald transition-all duration-200 hover:bg-[#7A8850] hover:text-white hover:-translate-y-px active:translate-y-0"
                >
                    VIEW MAP
                </a>
            </div>
        </section>
        </>
    );
};

export default AboutTheWedding;
