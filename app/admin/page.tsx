"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode";
import { Toaster, toast } from "sonner";

const SCAN_COOLDOWN_MS = 3000;

interface Guest {
  id: string;
  name: string;
  code: string;
  status: string | null;
  rsvpConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  rsvpConfirmed: number;
  inVenue: number;
  pending: number;
}

type Tab = "scan" | "dashboard";

const AdminScanPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("scan");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const isProcessingRef = useRef(false);
  const lastScannedRef = useRef<{ code: string; timestamp: number } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const fetchGuests = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/guests");
      const data = await response.json();
      if (data.success) {
        setGuests(data.guests);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast.error("Failed to fetch guests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch guests when switching to dashboard tab
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchGuests();
    }
  }, [activeTab, fetchGuests]);

  useEffect(() => {
    if (activeTab !== "scan") return;

    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const onScanSuccess = async (decodedText: string, decodedResult: Html5QrcodeResult) => {
      const now = Date.now();
      
      if (isProcessingRef.current) {
        return;
      }

      if (
        lastScannedRef.current &&
        lastScannedRef.current.code === decodedText &&
        now - lastScannedRef.current.timestamp < SCAN_COOLDOWN_MS
      ) {
        return;
      }

      isProcessingRef.current = true;
      lastScannedRef.current = { code: decodedText, timestamp: now };

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
        
        if (data.success) {
          toast.success(data.message, {
            description: `Guest Code: ${data.guest?.code || decodedText}`,
            duration: 4000,
          });
        } else {
          toast.error(data.message || "Guest not found", {
            description: `Scanned: ${decodedText}`,
            duration: 4000,
          });
        }
      } catch (error) {
        console.error("Error sending scan to backend:", error);
        toast.error("Network Error", {
          description: "Failed to connect to server",
          duration: 4000,
        });
      } finally {
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 500);
      }
    };

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
      },
      onScanSuccess,
      () => {}
    ).catch((err) => {
      console.error("Error starting QR scanner:", err);
    });

    return () => {
      html5QrCode.stop().catch((error) => {
        console.error("Failed to stop html5QrCode:", error);
      });
    };
  }, [activeTab]);

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (guest: Guest) => {
    if (guest.status === "in_venue") {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">In Venue</span>;
    }
    if (guest.rsvpConfirmed) {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">RSVP&apos;d</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Pending</span>;
  };

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden font-eb-garamond text-[#4a4a4a]">
      <Toaster 
        position="top-center" 
        richColors 
        toastOptions={{
          style: {
            fontFamily: 'var(--font-eb-garamond)',
          },
        }}
      />
      
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
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-4 overflow-y-auto">
        {/* Logo Container (Mobile) */}
        <div className="w-[60px] md:hidden mb-4 mt-4 drop-shadow-lg">
          <Image
            src="/Logo Initial - Colored BG 1.png"
            alt="J&H Wedding Logo"
            width={60}
            height={60}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg p-1 flex gap-1 mb-4">
          <button
            onClick={() => setActiveTab("scan")}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === "scan"
                ? "bg-[#7A8850] text-white"
                : "text-[#4a4a4a] hover:bg-gray-100"
            }`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === "dashboard"
                ? "bg-[#7A8850] text-white"
                : "text-[#4a4a4a] hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Scan Tab Content */}
        {activeTab === "scan" && (
          <div className="bg-white/95 backdrop-blur-sm rounded-[15px] shadow-2xl p-5 md:p-8 w-full max-w-[400px] flex flex-col items-center">
            <div className="text-center mb-4">
              <h1 className="text-[1.25rem] md:text-[1.5rem] font-bold uppercase tracking-[0.15em] mb-1">
                Scan Guest&apos;s QR
              </h1>
              <div className="h-px w-12 bg-[#7A8850] mx-auto mb-2"></div>
              <p className="text-[0.7rem] md:text-[0.8rem] font-medium opacity-80 uppercase tracking-widest">
                Admin Verification
              </p>
            </div>
            
            <div className="w-full max-w-[280px] aspect-square relative">
              <div 
                id="reader" 
                className="w-full h-full overflow-hidden rounded-xl border-2 border-[#7A8850]/30"
              ></div>
            </div>
            
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
          </div>
        )}

        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" && (
          <div className="bg-white/95 backdrop-blur-sm rounded-[15px] shadow-2xl p-5 md:p-8 w-full max-w-[900px] flex flex-col">
            <div className="text-center mb-6">
              <h1 className="text-[1.25rem] md:text-[1.5rem] font-bold uppercase tracking-[0.15em] mb-1">
                Guest Dashboard
              </h1>
              <div className="h-px w-12 bg-[#7A8850] mx-auto mb-2"></div>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-[#4a4a4a]">{stats.total}</p>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Total Guests</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.rsvpConfirmed}</p>
                  <p className="text-xs uppercase tracking-wider text-blue-500">RSVP&apos;d</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.inVenue}</p>
                  <p className="text-xs uppercase tracking-wider text-green-500">In Venue</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                  <p className="text-xs uppercase tracking-wider text-orange-500">Pending</p>
                </div>
              </div>
            )}

            {/* Search and Refresh */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A8850]/50 text-sm"
              />
              <button
                onClick={fetchGuests}
                disabled={isLoading}
                className="px-4 py-2 bg-[#7A8850] text-white rounded-lg text-sm font-medium hover:bg-[#6b7746] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {/* Guests Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600">Code</th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600 hidden md:table-cell">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Loading guests...
                      </td>
                    </tr>
                  ) : filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        {searchQuery ? "No guests found matching your search" : "No guests yet"}
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{guest.name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{guest.code}</td>
                        <td className="px-4 py-3">{getStatusBadge(guest)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                          {new Date(guest.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Guest Count */}
            <p className="text-xs text-gray-500 mt-3 text-center">
              Showing {filteredGuests.length} of {guests.length} guests
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-5 group flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-widest text-white hover:text-[#7A8850] transition-colors"
        >
          <span className="text-base group-hover:-translate-x-1 transition-transform">←</span>
          Go Back
        </button>
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
