"use client";

import React from "react";
import Image from "next/image";

const InvitationMessage = () => {
    return (
        <div className="w-screen flex flex-col items-center justify-center bg-white py-16 md:py-28 px-[clamp(32px,15vw,288px)]">
            <div>
                <Image
                    src="/Drawing - Ribbon wRings.png"
                    alt="Ribbon with Rings"
                    width={180}
                    height={180}
                    className="w-[100px] md:w-[180px] h-auto"
                />
            </div>
            <div className="font-italianno text-[clamp(35px,8vw,80px)] text-[#7A8850] tracking-wider">
                You are Invited!
            </div>
            <div className="text-center text-[clamp(12px,2vw,26px)] text-[#2F2F2F] font-oswald tracking-wider font-light ">
                With thankful hearts, Jofer and Hope invite you to celebrate
                a day made possible by Jehovah’s guidance and love.
                <br />
                <br />
                Our story began with friendship and has grown into a
                commitment built on faith, trust, and devotion. As we join
                our lives in marriage, it would mean so much to have you
                with us as we celebrate this special day.
                <br />
                <br />
                We look forward to sharing this day with you!
            </div>
        </div>
    );
};

export default InvitationMessage;
