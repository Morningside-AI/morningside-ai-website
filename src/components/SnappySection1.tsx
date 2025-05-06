import Hero from "./hero/hero";

function SnappySection1() {
    return (
        <div className={`relative min-h-[100dvh] w-full flex`}>
            <div className="w-full h-full">
                <Hero />
            </div>
        </div>
    );
}

export default SnappySection1;