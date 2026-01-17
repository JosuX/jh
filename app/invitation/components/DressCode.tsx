"use client";

import Image from "next/image";

const colorPalette = [
    "#8A9A5B",
    "#7A8850",
    "#888F63",
    "#9EB089",
    "#8BB397",
    "#6B8A80",
    "#728C5A",
    "#898D74",
    "#869170",
    "#8DA58B",
];

const DressCode = () => {
    return (
        <section className="w-full bg-white py-[clamp(60px,15vw,140px)] px-[clamp(32px,8vw,288px)] sm:px-[clamp(32px,8vw,288px)]">
            <div className="flex flex-col items-center justify-center text-center">
                <h2 className="font-italianno text-[clamp(35px,8vw,80px)] text-[#7A8850] tracking-wider mb-4 sm:mb-8 md:mb-14">
                    Dress Code
                </h2>
                <div className="text-center text-[clamp(12px,2vw,26px)] text-[#2F2F2F] font-oswald tracking-wider font-light max-w-3xl px-4 sm:px-6 md:px-0">
                    <p className="mb-4">
                        We kindly ask our guests to wear formal or semi-formal
                        attire.
                    </p>
                    <p>
                        Kindly note that black and white attire is reserved
                        exclusively for those assigned official roles in the
                        wedding. We appreciate your understanding and cooperation.
                    </p>
                </div>
                <figure className="my-8 sm:my-10 md:my-14 w-full max-w-[250px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px]">
                    <Image
                        src="/Line 1 (2).svg"
                        alt="Decorative Line"
                        width={800}
                        height={1}
                        className="w-full h-auto"
                    />
                </figure>
                <h3 className="font-oswald text-[clamp(14px,8vw,50px)] text-[#2F2F2F] tracking-[0.25rem] mb-1 px-4 sm:px-0">
                    COLOR PALETTE
                </h3>
                <p className="font-italianno text-[#2F2F2F] tracking-wider text-[clamp(12px,8vw,35px)] mb-3 sm:mb-6 md:mb-10">
                    Sage Green & Tones
                </p>
                <ul className="flex flex-col items-center gap-[clamp(10px,2vw,28px)] w-full px-4 sm:px-0 list-none">
                    <li className="flex flex-row gap-[clamp(10px,2vw,28px)] justify-center flex-wrap sm:flex-nowrap">
                        {colorPalette.slice(0, 6).map((color, index) => (
                            <span
                                key={index}
                                className="w-[clamp(24px,6vw,80px)] h-[clamp(24px,6vw,80px)] rounded-full shrink-0"
                                style={{ backgroundColor: color }}
                                aria-label={`Color ${index + 1}: ${color}`}
                            />
                        ))}
                    </li>
                    <li className="flex flex-row gap-[clamp(10px,2vw,28px)] justify-center flex-wrap sm:flex-nowrap">
                        {colorPalette.slice(6, 10).map((color, index) => (
                            <span
                                key={index + 6}
                                className="w-[clamp(24px,6vw,80px)] h-[clamp(24px,6vw,80px)] rounded-full shrink-0"
                                style={{ backgroundColor: color }}
                                aria-label={`Color ${index + 7}: ${color}`}
                            />
                        ))}
                    </li>
                </ul>
                <p className="text-center text-[clamp(10px,2vw,26px)] text-[#2F2F2F] font-oswald tracking-wider font-light mt-6 sm:mt-8 md:mt-10 px-4 sm:px-6 md:px-0 mb-[clamp(42px,8vw,190px)]">
                    For those part of the Entourage,
                    <br />
                    the bride and groom will reach out to you separately.
                </p>
                <div className="flex items-end justify-center gap-4 lg:gap-6">
                    <figure className="hidden lg:flex items-end h-[140%] w-auto">
                        <Image
                            src="/Flower Design_1.png"
                            alt="Decorative flower left"
                            width={200}
                            height={300}
                            className="h-full w-auto object-contain"
                        />
                    </figure>
                    <div className="w-full max-w-[280px] sm:max-w-[380px] md:max-w-[480px] lg:max-w-[578px]">
                        <div className="bg-[#5B6946] rounded-t-full aspect-[2.5/1] flex items-end justify-center">
                            <figure className="w-[75%]">
                                <Image
                                    src="/Line Flower Design (2) 1.png"
                                    alt="Decorative flower design"
                                    width={400}
                                    height={155}
                                    className="w-full h-auto"
                                />
                            </figure>
                        </div>
                        <div className="flex flex-col items-center bg-[#5B6946] text-white px-6 sm:px-8 md:px-12 lg:px-16 pb-8 sm:pb-10 md:pb-12">
                            <h4 className="font-italianno text-[clamp(32px,5vw,64px)] tracking-wider whitespace-nowrap">
                                Schedule of Events
                            </h4>
                            <hr className="my-2.5 sm:my-3 md:my-4 w-full border-white/60" />
                            <p className="font-oswald text-[clamp(11px,1.8vw,22px)] font-light tracking-wider self-start">
                                4:00 PM | ARRIVAL OF THE GUESTS
                            </p>
                            <hr className="my-2.5 sm:my-3 md:my-4 w-full border-white/60" />
                            <p className="font-oswald text-[clamp(11px,1.8vw,22px)] font-light tracking-wider self-start">
                                4:30 PM | START OF THE CEREMONY
                            </p>
                            <hr className="my-2.5 sm:my-3 md:my-4 w-full border-white/60" />
                            <p className="font-oswald text-[clamp(11px,1.8vw,22px)] font-light tracking-wider self-start">
                                6:00 PM | PRE-RECEPTION GATHERING
                            </p>
                            <hr className="my-2.5 sm:my-3 md:my-4 w-full border-white/60" />
                            <p className="font-oswald text-[clamp(11px,1.8vw,22px)] font-light tracking-wider self-start">
                                7:00 PM | DINNER RECEPTION
                            </p>
                            <hr className="my-2.5 sm:my-3 md:my-4 w-full border-white/60" />
                            <p className="font-oswald text-[clamp(11px,1.8vw,22px)] font-light tracking-wider self-start">
                                7:30 PM | EVENING CELEBRATION
                            </p>
                            <hr className="mt-2.5 sm:mt-3 md:mt-4 w-full border-white/60" />
                        </div>
                    </div>
                    <figure className="hidden lg:flex items-end h-[140%] w-auto scale-x-100 rotate-[16deg]">
                        <Image
                            src="/Flower Design_2.png"
                            alt="Decorative flower right"
                            width={200}
                            height={300}
                            className="h-full w-auto object-contain"
                        />
                    </figure>
                </div>

            </div>
        </section>
    );


};

export default DressCode;
