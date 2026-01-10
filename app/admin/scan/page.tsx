"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode";

const AdminScanPage = () => {
  useEffect(() => {
    // Initialize the scanner with direct camera control
    const html5QrCode = new Html5Qrcode("reader");

    const onScanSuccess = async (decodedText: string, decodedResult: Html5QrcodeResult) => {
      // Console log the content as requested
      console.log("QR Code Scanned:", decodedText);
      console.log("Full Result:", decodedResult);
      
      try {
        const response = await fetch("/api/admin/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ decodedText }),
        });

        const data = await response.json();
        console.log("Backend Response:", data);
        
        // Provide visual feedback (optional)
        if (data.success) {
          alert(`Success: ${data.message}`);
        } else {
          alert(`Error: ${data.message || "Guest not found"}`);
        }
      } catch (error) {
        console.error("Error sending scan to backend:", error);
      }
    };

    // Start scanning with back camera (environment facing mode)
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
      },
      onScanSuccess,
      () => {
        // Ignore scan failures
      }
    ).catch((err) => {
      console.error("Error starting QR scanner:", err);
    });

    // Cleanup on unmount
    return () => {
      html5QrCode.stop().catch((error) => {
        console.error("Failed to stop html5QrCode:", error);
      });
    };
  }, []);


  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden font-eb-garamond text-[#4a4a4a]">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/Wedding Video Banner.mp4" type="video/mp4" />
        </video>
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {/* Logo Container (Mobile) */}
        <div className="w-[60px] md:hidden mb-4 drop-shadow-lg">
          <Image
            src="/Logo Initial - Colored BG 1.png"
            alt="J&H Wedding Logo"
            width={60}
            height={60}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Main Card Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-[15px] shadow-2xl p-5 md:p-8 w-full max-w-[400px] flex flex-col items-center">
          {/* Header Section */}
          <div className="text-center mb-4">
            <h1 className="text-[1.25rem] md:text-[1.5rem] font-bold uppercase tracking-[0.15em] mb-1">
              Scan Guest&apos;s QR
            </h1>
            <div className="h-px w-12 bg-[#7A8850] mx-auto mb-2"></div>
            <p className="text-[0.7rem] md:text-[0.8rem] font-medium opacity-80 uppercase tracking-widest">
              Admin Verification
            </p>
          </div>
          
          {/* Scanner Region */}
          <div className="w-full max-w-[280px] aspect-square relative">
            <div 
              id="reader" 
              className="w-full h-full overflow-hidden rounded-xl border-2 border-[#7A8850]/30"
            ></div>
          </div>
          
          {/* Instructions */}
          <div className="mt-4 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-[#7A8850]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A8850] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7A8850]"></span>
              </span>
              <p className="text-[0.8rem] font-bold tracking-wide">Ready to Scan</p>
            </div>
            <p className="text-center text-[0.7rem] opacity-70 italic max-w-[220px]">
              Align the QR code within the frame to check in.
            </p>
          </div>

          {/* Navigation */}
          <button
            onClick={() => window.history.back()}
            className="mt-5 group flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-widest hover:text-[#7A8850] transition-colors"
          >
            <span className="text-base group-hover:-translate-x-1 transition-transform">←</span>
            Go Back
          </button>
        </div>
      </div>

      {/* Desktop Logo Overlay */}
      <div className="hidden md:block absolute bottom-8 right-8 z-20">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
          <Image
            src="/JH WEDDING LOGO - WHITE.png"
            alt="J&H Wedding Logo"
            width={120}
            height={120}
            className="w-[120px] h-auto drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      <style jsx global>{`
        #reader {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          background: #f8f8f8 !important;
        }
        #reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  );
};

export default AdminScanPage;
