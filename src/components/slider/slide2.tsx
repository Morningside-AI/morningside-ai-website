"use client";

import { useEffect, useRef } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

type Slide2Props = {
    isActive: boolean;
};

const Slide2 = ({ isActive }: Slide2Props) => {
    const { rive, RiveComponent: LearnRive } = useRive({
        src: "/rive/animation1.riv",
        autoplay: false,
        layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
    });

    useEffect(() => {
        if (isActive && rive) {
            rive.play();
        } else if (!isActive && rive) {
            rive.reset();
        }
    }, [isActive, rive]);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center text-white">
            <div className="w-full flex justify-center">
                <div className="w-[100vw] h-[250px] lg:w-[700px] lg:h-[300px]">
                    <LearnRive />
                </div>
            </div>

            <div className="flex flex-col gap-6 items-center justify-center mt-6">
                <p className="lg:text-9xl md:text-8xl text-6xl font-light text-center capitalize">
                    Learn AI
                </p>
                <p className="lg:text-xl md:text-lg text-base font-light text-center max-w-[700px] mx-auto text-[#A0A4A1]">
                    Our experts equip your team with the tools, frameworks, and strategic
                    know-how to adopt AI confidently across all organizational levels.
                </p>
            </div>
        </div>
    );
};

export default Slide2;
