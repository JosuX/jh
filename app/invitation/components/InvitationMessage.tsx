"use client";

import React from "react";
import Image from "next/image";

const InvitationMessage = () => {
    return (
        <section className="w-screen flex flex-col items-center justify-center bg-white py-28 md:py-28 px-[clamp(32px,15vw,288px)]">
            <figure>
                <Image
                    src="/Drawing - Ribbon wRings.png"
                    alt="Ribbon with Rings"
                    width={180}
                    height={180}
                    className="w-[100px] md:w-[180px] h-auto"
                />
            </figure>
            <h2 className="font-italianno text-[clamp(35px,8vw,80px)] text-[#7A8850] tracking-wider">
                You are Invited!
            </h2>
            <div className="text-center text-[clamp(12px,2vw,26px)] text-[#2F2F2F] font-oswald tracking-wider font-light">
                <p className="mb-4">
                    With thankful hearts, Jofer and Hope invite you to celebrate
                    a day made possible by Jehovah's guidance and love.
                </p>
                <p className="mb-4">
                    Our story began with friendship and has grown into a
                    commitment built on faith, trust, and devotion. As we join
                    our lives in marriage, it would mean so much to have you
                    with us as we celebrate this special day.
                </p>
                <p>
                    We look forward to sharing this day with you!
                </p>
            </div>
        </section>
    );
};

export default InvitationMessage;
