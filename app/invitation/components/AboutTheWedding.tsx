"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const AboutTheWedding = () => {
    const [isMobile, setIsMobile] = useState(false);

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
                <div className="flex flex-row items-center">
                    <div className="w-1/2 flex justify-center">
                        <div className="font-italianno text-[clamp(40px,4.16vw,80px)] tracking-widest px-[clamp(20px,8vw,160px)] text-center">
                            About The Wedding
                        </div>
                    </div>

                    <div className="w-1/2 relative aspect-4/5 overflow-hidden">
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
        <section className="w-full bg-[#fdfcfb] py-16 px-6">
            <div className="flex flex-col items-center text-center">
                <div className="w-full flex justify-center mb-8">
                    <div className="relative w-full aspect-4/5 overflow-hidden rounded-sm shadow-xl">
                        <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
                            <Image
                                src="/Line Flower Design (2).png"
                                alt="Decorative Floral Design"
                                fill
                                className="object-contain p-8"
                            />
                        </div>
                    </div>
                </div>

                <h2 className="font-italianno text-[55px] text-[#7A8850] mb-4 leading-none">
                    Our Story
                </h2>
                <div className="font-oswald font-light text-[16px] text-[#4a4a4a] leading-relaxed space-y-4">
                    <p>
                        It all began with a simple conversation that blossomed into 
                        something truly beautiful.
                    </p>
                    <p>
                        Guided by our faith, we are so excited to begin this new chapter 
                        together as husband and wife.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutTheWedding;
