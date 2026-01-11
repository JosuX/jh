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
            <DressCode/>
        </main>
    );
};

export default InvitationContent;
