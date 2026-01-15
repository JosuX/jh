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
                <div className="text-white font-oswald font-medium text-[clamp(14px,2vw,26px)] tracking-[0.25rem] mb-5">
                    PHONE, SOCIAL MEDIA & PHOTOGRAPHY GUIDELINES
                </div>
                <div className="text-white font-oswald font-light text-[clamp(12px,2vw,26px)] tracking-[0.1rem] mb-5">
                    <span className="underline">
                        Keep Phones on Silent Mode
                    </span>
                    <br />
                    <br />
                    To maintain the solemnity of our ceremony and avoid
                    unnecessary distractions, we kindly ask guests to keep their
                    PHONES ON SILENT or VIBRATE MODE throughout the event.
                </div>
                <div className="text-white font-oswald font-light text-[clamp(12px,2vw,26px)] tracking-[0.1rem] mb-5">
                    <span className="underline">
                        No Posting or Uploading Before & During the Event
                    </span>
                    <br />
                    <br />
                    While we welcome personal photos, we kindly request that no
                    photos, videos, or event details be posted on social media
                    (Stories, Notes & Timeline Posting) before or during the
                    event. Help us keep the day private and focused on real,
                    in-the-moment memories.
                </div>
                <div className="text-white font-oswald font-light text-[clamp(12px,2vw,26px)] tracking-[0.1rem] mb-10">
                    <span className="underline">
                        Let the Professionals Capture the Moment
                    </span>
                    <br />
                    <br />
                    We&apos;ve hired a team of professional photographers and
                    videographers to document our special day. To help them do
                    their best work, please AVOID STEPPING into AISLES, USING
                    FLASH, or OBSTRUCTING THEIR VIEW during the ceremony or key
                    moments.
                    <br />
                    <br />
                    Feel free to take personal photos at appropriate times, but
                    we kindly ask that you wait until after the day of the
                    wedding to post anything online.
                </div>
                <div className="text-white font-oswald font-medium text-[clamp(14px,2vw,26px)] tracking-[0.25rem] mb-5">
                    VENUE RULES
                </div>
                <div className="text-white font-oswald font-light text-[clamp(12px,2vw,26px)] tracking-[0.1rem] mb-10">
                    <span className="underline">No Outside Food</span>
                    <br />
                    <br />
                    As per the venue&apos;s policy, bringing your own food or snack
                    is strictly prohibited during the event. Please respect this
                    rule to help us maintain smooth coordination with the venue
                    staff.
                </div>
            </div>
        </main>
    );
};

export default InvitationContent;
