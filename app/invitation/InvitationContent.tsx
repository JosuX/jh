"use client";

import React from "react";
import HeroSection from "./components/HeroSection";
import InvitationMessage from "./components/InvitationMessage";
import AboutTheWedding from "./components/AboutTheWedding";
import DressCode from "./components/DressCode";

const InvitationContent = () => {
    return (
        <main className="flex flex-col items-center justify-center">
            <HeroSection />
            <InvitationMessage />
            <AboutTheWedding />
            <DressCode />
            <div className="w-full bg-[#282828] py-12 justify-center items-center text-center flex flex-col px-10">
                <div className="text-white font-italianno text-[clamp(35px,8vw,80px)] tracking-wider">
                    Event Reminders!
                </div>
                <div className="text-white font-oswald font-medium text-[clamp(14px,2vw,26px)] tracking-[0.25rem] my-5">
                    GUEST POLICY
                </div>
                <div className="text-white font-oswald font-light text-[clamp(12px,2vw,26px)] tracking-[0.1rem] mb-6">
                    <span className="underline">
                        No Plus Ones or Guest Substitutes
                    </span>
                    <br />
                    <br />
                    Our Wedding is a private and intimate gathering. Only those
                    who have received a FORMAL INVITATION will be able to
                    attend. Bringing an uninvited guest or sending someone in
                    your place may not be able to enter the venue.
                    <br />
                    <br />
                    If you’re unable to join us, please know that any
                    substitutions or additional guests can only be approved by
                    the BRIDE AND THE GROOM.
                    <br />
                    <br />
                    We appreciate your full understanding and cooperation.
                </div>
                <div className="text-white font-oswald font-light text-[clamp(12px,2vw,26px)] tracking-[0.1rem] mb-10">
                    <span className="underline">Request to Guests</span>
                    <br />
                    <br />
                    Please do not share any details about the wedding —such as
                    the date, time, venue or any information regarding the event
                    with anyone who is not officially invited. This is to
                    protect the privacy of our event and avoid unexpected
                    disruptions and additional fees.
                </div>
            </div>
        </main>
    );
};

export default InvitationContent;
