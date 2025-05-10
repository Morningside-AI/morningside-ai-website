import Stats from "./stats/stats";
import { type RefObject } from "react";

type SnappySection4Props = {
    scrollContainerRef: RefObject<HTMLDivElement | null>
};

function SnappySection4({ scrollContainerRef }: SnappySection4Props) {
    return (
        <div className={`relative h-[100dvh] min-h-[100dvh] w-full flex`}>
            <div className="w-full h-full">
                <Stats scrollContainerRef={scrollContainerRef} />
            </div>
        </div>
    );
}

export default SnappySection4;