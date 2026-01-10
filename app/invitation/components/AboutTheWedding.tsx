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
                            <div>
                                <Image
                                    src="/Date Design 2.png"
                                    alt="Wedding Date"
                                    width={500}
                                    height={113}
                                    className="w-[500px] h-auto"
                                    priority
                                />
                            </div>
                            <div className="font-italianno text-[clamp(35px,4.16vw,80px)] tracking-widest px-[clamp(20px,8vw,160px)] text-center mb-16">
                                About The Wedding
                            </div>
                            <div className="justify-center text-center font-oswald text-2xl font-light text-white tracking-[0.2rem]">
                                Date & Time
                                <br />
                                March 7, 2026 - SATURDAY | 4:00 PM
                            </div>
                            <div className="mt-8 w-full max-w-[603px]">
                                <Image
                                    src="/Line 1.svg"
                                    alt="Decorative Line"
                                    width={603}
                                    height={3}
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="my-8 justify-center text-center font-italianno text-3xl text-white tracking-[0.05rem]">
                                Counting down to a day blessed by Jehovah!
                            </div>
                            <div className="w-full max-w-[350px]">
                                <div className="grid grid-cols-7 text-center font-big-shoulders-inline text-white">
                                    {/* Time Line */}
                                    <div className="text-4xl tracking-widest">
                                        {timeLeft.days}
                                    </div>
                                    <div className="text-4xl tracking-widest">
                                        :
                                    </div>
                                    <div className="text-4xl tracking-widest">
                                        {timeLeft.hours
                                            .toString()
                                            .padStart(2, "0")}
                                    </div>
                                    <div className="text-4xl tracking-widest">
                                        :
                                    </div>
                                    <div className="text-4xl tracking-widest">
                                        {timeLeft.minutes
                                            .toString()
                                            .padStart(2, "0")}
                                    </div>
                                    <div className="text-4xl tracking-widest">
                                        :
                                    </div>
                                    <div className="text-4xl tracking-widest">
                                        {timeLeft.seconds
                                            .toString()
                                            .padStart(2, "0")}
                                    </div>

                                    {/* Labels Line */}
                                    <div className="text-sm tracking-widest uppercase">
                                        Days
                                    </div>
                                    <div></div>
                                    <div className="text-sm tracking-widest uppercase">
                                        Hrs
                                    </div>
                                    <div></div>
                                    <div className="text-sm tracking-widest uppercase">
                                        Mins
                                    </div>
                                    <div></div>
                                    <div className="text-sm tracking-widest uppercase">
                                        Sec
                                    </div>
                                </div>
                            </div>
                            <div className="my-8 w-full max-w-[603px]">
                                <Image
                                    src="/Line 1.svg"
                                    alt="Decorative Line"
                                    width={603}
                                    height={3}
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="mb-8 justify-center text-center font-oswald text-2xl font-light text-white tracking-[0.2rem]">
                                Zion Events Place, Holiday Hills,
                                <br />
                                Brgy. San Antonio, San Pedro Laguna
                            </div>
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

                    <div className="w-1/2 relative overflow-hidden">
                        <Image
                            src="/Zions_Place 1.png"
                            alt="Zions Place"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
        );
    }

    // Mobile Version
    return (
        <section className="w-full bg-[#1B251E] text-white px-7 sm:px-12 py-14 sm:py-20">
            <div className="flex flex-col items-center text-center">
                <div>
                    <Image
                        src="/Date Design 2.png"
                        alt="Wedding Date"
                        width={219}
                        height={47}
                        className="w-[219px] sm:w-[320px] h-auto"
                        priority
                    />
                </div>
                <div className="font-italianno text-[clamp(35px,10vw,50px)] tracking-wider text-center mb-7">
                    About The Wedding
                </div>
                <div className="font-oswald text-sm md:text-lg font-light text-white tracking-wider">
                    Date & Time
                    <br />
                    March 7, 2026 - SATURDAY | 4:00 PM
                </div>
                <div className="my-7 w-full max-w-[250px] sm:max-w-[400px]">
                    <Image
                        src="/Line 1.svg"
                        alt="Decorative Line"
                        width={250}
                        height={3}
                        className="w-full h-auto"
                    />
                </div>
                <div className="justify-center text-center font-italianno text-xl sm:text-2xl text-white tracking-[0.05rem]">
                    Counting down to a day blessed by Jehovah!
                </div>
                <div className="w-full max-w-[280px] sm:max-w-[450px] mb-14">
                    <div className="grid grid-cols-7 text-center font-big-shoulders-inline text-white">
                        {/* Time Line */}
                        <div className="text-3xl sm:text-5xl tracking-widest">
                            {timeLeft.days}
                        </div>
                        <div className="text-3xl sm:text-5xl tracking-widest">:</div>
                        <div className="text-3xl sm:text-5xl tracking-widest">
                            {timeLeft.hours.toString().padStart(2, "0")}
                        </div>
                        <div className="text-3xl sm:text-5xl tracking-widest">:</div>
                        <div className="text-3xl sm:text-5xl tracking-widest">
                            {timeLeft.minutes.toString().padStart(2, "0")}
                        </div>
                        <div className="text-3xl sm:text-5xl tracking-widest">:</div>
                        <div className="text-3xl sm:text-5xl tracking-widest">
                            {timeLeft.seconds.toString().padStart(2, "0")}
                        </div>

                        {/* Labels Line */}
                        <div className="text-[10px] sm:text-sm tracking-widest uppercase">
                            Days
                        </div>
                        <div></div>
                        <div className="text-[10px] sm:text-sm tracking-widest uppercase">
                            Hrs
                        </div>
                        <div></div>
                        <div className="text-[10px] sm:text-sm tracking-widest uppercase">
                            Mins
                        </div>
                        <div></div>
                        <div className="text-[10px] sm:text-sm tracking-widest uppercase">
                            Sec
                        </div>
                    </div>
                </div>
                <div className="font-italianno text-[clamp(35px,10vw,50px)] tracking-wider text-center mb-6">
                    Ceremony & Reception
                </div>
                <div className="mb-6">
                    <Image
                        src="/Zions_Place 1.png"
                        alt="Zion Events Place"
                        width={217}
                        height={145}
                        className="w-full max-w-[217px] sm:max-w-[350px] h-auto rounded-[10px] shadow-[0px_1px_4px_2px_rgba(223,223,223,0.25)]"
                    />
                </div>
                <div className="font-oswald text-sm sm:text-lg font-light text-white tracking-wider mb-6">
                    Zion Events Place, Holiday Hills, Brgy. San Antonio,
                    <br />
                    San Pedro Laguna
                </div>
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
    );
};

export default AboutTheWedding;
