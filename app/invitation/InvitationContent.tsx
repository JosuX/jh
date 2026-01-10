"use client";

import React from "react";
import HeroSection from "./components/HeroSection";
import InvitationMessage from "./components/InvitationMessage";
import AboutTheWedding from "./components/AboutTheWedding";

interface InvitationContentProps {
    guestName: string;
}

const InvitationContent = ({ guestName }: InvitationContentProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <HeroSection />
            <InvitationMessage />
            <AboutTheWedding />
        </div>
    );
};

export default InvitationContent;
