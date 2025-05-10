import HoverVideo from "./video/hoverVideo";
import ms from "@/assets/images/backgrounds/ms.webp"
import msmobile from '@/assets/images/backgrounds/ms2mob.webp'

function SnappySection6() {
    return (
        <div className={`relative h-[100dvh] min-h-[100dvh] w-full flex bg-cover bg-center herovideobg`}>
            <div className="w-full h-full">
                <HoverVideo />
            </div>
        </div>
    );
}

export default SnappySection6;