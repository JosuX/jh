"use client";

import HeroSection from "./components/HeroSection";
import InvitationMessage from "./components/InvitationMessage";
import AboutTheWedding from "./components/AboutTheWedding";
import DressCode from "./components/DressCode";
import EventReminders from "./components/EventReminders";
import RSVP from "./components/RSVP";

const InvitationContent = () => {

    return (
        <main className="flex flex-col items-center justify-center">
            <HeroSection />
            <InvitationMessage />
            <AboutTheWedding />
            <DressCode />
            <EventReminders />
            <RSVP />
        </main>
    );
};

export default InvitationContent;
