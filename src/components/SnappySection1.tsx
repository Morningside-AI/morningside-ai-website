import Hero from "./hero/hero";

function SnappySection1() {
    return (
        <div className={`relative min-h-screen w-full flex`}>
            <div className="w-full mx-auto flex justify-center items-center text-4xl">
                <div className="w-full h-full">
                    <Hero />
                </div>
            </div>
        </div>
    );
}

export default SnappySection1;