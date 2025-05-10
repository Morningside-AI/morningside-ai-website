import Entrance from "./slider/entrance";
import { type RefObject } from "react";

type SnappySection4Props = {
    scrollContainerRef: RefObject<HTMLDivElement | null>
};

function SnappySection3({ scrollContainerRef }: SnappySection4Props) {
    return (
        <div className={`relative min-h-[100dvh] h-full w-full flex`}>
            <div className="w-full h-full">
                <Entrance scrollContainerRef={scrollContainerRef} />
            </div>
        </div>
    );
}

export default SnappySection3;