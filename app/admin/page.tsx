"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode";
import { Toaster, toast } from "sonner";

const SCAN_COOLDOWN_MS = 3000;

// Wedding day: March 6, 2026 4PM PHT (UTC+8)
const WEDDING_DATE = new Date('2026-03-06T16:00:00+08:00');

function isWeddingDay(): boolean {
  return new Date() >= WEDDING_DATE;
}

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
type SortColumn = "name" | "code" | "status" | "updatedAt";
type SortDirection = "asc" | "desc";

const ADMIN_PASSWORD = "JH123";

const AdminScanPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
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

  // Check for existing authentication on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  // Fetch guests when switching to dashboard tab
  useEffect(() => {
    if (activeTab === "dashboard" && isAuthenticated) {
      fetchGuests();
    }
  }, [activeTab, fetchGuests, isAuthenticated]);

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
          if (data.isSimulation) {
            toast.warning(data.message, {
              description: `Guest Code: ${data.guest?.code || decodedText} (Status not saved)`,
              duration: 4000,
            });
          } else {
            toast.success(data.message, {
              description: `Guest Code: ${data.guest?.code || decodedText}`,
              duration: 4000,
            });
          }
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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getGuestSortValue = (guest: Guest, column: SortColumn): string | number => {
    switch (column) {
      case "name":
        return guest.name.toLowerCase();
      case "code":
        return guest.code.toLowerCase();
      case "status":
        if (guest.status === "in_venue") return 0;
        if (guest.rsvpConfirmed) return 1;
        return 2;
      case "updatedAt":
        return new Date(guest.updatedAt).getTime();
      default:
        return guest.name.toLowerCase();
    }
  };

  const filteredGuests = guests
    .filter(guest => 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = getGuestSortValue(a, sortColumn);
      const bValue = getGuestSortValue(b, sortColumn);
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const getStatusBadge = (guest: Guest) => {
    if (guest.status === "in_venue") {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">In Venue</span>;
    }
    if (guest.rsvpConfirmed) {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">RSVP&apos;d</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Pending</span>;
  };

  const handleResetStatus = async (guestId: string, guestName: string) => {
    if (!confirm(`Reset venue status for ${guestName}? They will be able to scan in again.`)) {
      return;
    }

    try {
      const response = await fetch("/api/admin/guests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Status reset successfully", {
          description: `${guestName} can now scan in again`,
          duration: 3000,
        });
        // Update local state
        setGuests(guests.map(g => 
          g.id === guestId ? { ...g, status: null } : g
        ));
        // Update stats
        if (stats) {
          setStats({
            ...stats,
            inVenue: stats.inVenue - 1,
          });
        }
      } else {
        toast.error("Failed to reset status", {
          description: data.message,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error resetting status:", error);
      toast.error("Network Error", {
        description: "Failed to connect to server",
        duration: 3000,
      });
    }
  };

  const handleRemoveSession = async (guestId: string, guestName: string) => {
    if (!confirm(`Remove session for ${guestName}? They will need to re-enter their guest code.`)) {
      return;
    }

    try {
      const response = await fetch("/api/admin/guests", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guestId }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.deletedCount > 0) {
          toast.success("Session removed", {
            description: `${guestName} will need to re-enter their code`,
            duration: 3000,
          });
        } else {
          toast.info("No active session", {
            description: `${guestName} doesn't have an active session`,
            duration: 3000,
          });
        }
      } else {
        toast.error("Failed to remove session", {
          description: data.message,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error removing session:", error);
      toast.error("Network Error", {
        description: "Failed to connect to server",
        duration: 3000,
      });
    }
  };

  // Login Screen
  if (!isAuthenticated) {
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
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Login Form */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-[15px] shadow-2xl p-8 w-full max-w-[360px]">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/Logo Initial - Colored BG 1.png"
                alt="J&H Wedding Logo"
                width={80}
                height={80}
                className="w-[80px] h-auto"
                priority
              />
            </div>

            <div className="text-center mb-6">
              <h1 className="text-[1.25rem] md:text-[1.5rem] font-bold uppercase tracking-[0.15em] mb-1">
                Admin Access
              </h1>
              <div className="h-px w-12 bg-[#7A8850] mx-auto mb-2"></div>
              <p className="text-[0.75rem] font-medium opacity-70 uppercase tracking-widest">
                Enter password to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 border-2 rounded-lg text-center text-sm tracking-wider focus:outline-none transition-colors ${
                    passwordError 
                      ? "border-red-400 bg-red-50 focus:border-red-500" 
                      : "border-gray-200 focus:border-[#7A8850]"
                  }`}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-500 text-xs text-center mt-2 font-medium">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#7A8850] text-white rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[#6b7746] transition-colors"
              >
                Enter
              </button>
            </form>

            <button
              onClick={() => window.history.back()}
              className="mt-6 w-full text-center text-[0.75rem] font-medium uppercase tracking-widest text-gray-500 hover:text-[#7A8850] transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Simulation Mode Banner */}
            {!isWeddingDay() && (
              <div className="w-full mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="text-amber-600 text-lg">⚠️</span>
                <div>
                  <p className="text-amber-800 font-bold text-xs uppercase tracking-wider">Simulation Mode</p>
                  <p className="text-amber-600 text-[0.65rem]">Scans won&apos;t update status until March 6, 2026 4PM</p>
                </div>
              </div>
            )}
            
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
              <div className={`flex items-center gap-2 ${isWeddingDay() ? "text-[#7A8850]" : "text-amber-600"}`}>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isWeddingDay() ? "bg-[#7A8850]" : "bg-amber-500"} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isWeddingDay() ? "bg-[#7A8850]" : "bg-amber-500"}`}></span>
                </span>
                <p className="text-[0.8rem] font-bold tracking-wide">
                  {isWeddingDay() ? "Ready to Scan" : "Simulation Mode"}
                </p>
              </div>
              <p className="text-center text-[0.7rem] opacity-70 italic max-w-[220px]">
                {isWeddingDay() 
                  ? "Align the QR code within the frame to check in."
                  : "Scans will validate guests but won't update status."
                }
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
                    <th 
                      onClick={() => handleSort("name")}
                      className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    >
                      <span className="flex items-center gap-1">
                        Name
                        <span className={`transition-opacity ${sortColumn === "name" ? "opacity-100" : "opacity-0"}`}>
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      </span>
                    </th>
                    <th 
                      onClick={() => handleSort("code")}
                      className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    >
                      <span className="flex items-center gap-1">
                        Code
                        <span className={`transition-opacity ${sortColumn === "code" ? "opacity-100" : "opacity-0"}`}>
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      </span>
                    </th>
                    <th 
                      onClick={() => handleSort("status")}
                      className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    >
                      <span className="flex items-center gap-1">
                        Status
                        <span className={`transition-opacity ${sortColumn === "status" ? "opacity-100" : "opacity-0"}`}>
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      </span>
                    </th>
                    <th 
                      onClick={() => handleSort("updatedAt")}
                      className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors select-none hidden md:table-cell"
                    >
                      <span className="flex items-center gap-1">
                        Updated
                        <span className={`transition-opacity ${sortColumn === "updatedAt" ? "opacity-100" : "opacity-0"}`}>
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-bold uppercase tracking-wider text-xs text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Loading guests...
                      </td>
                    </tr>
                  ) : filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
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
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {guest.status === "in_venue" && (
                              <button
                                onClick={() => handleResetStatus(guest.id, guest.name)}
                                className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                                title="Reset venue check-in status"
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveSession(guest.id, guest.name)}
                              className="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition-colors"
                              title="Remove session (guest must re-enter code)"
                            >
                              Logout
                            </button>
                          </div>
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
