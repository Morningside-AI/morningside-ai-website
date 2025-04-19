import "@/styles/fonts.css";
import RotatingText from "./rotatingText";
const Hero = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] pt-10">
            <div>
                <p className="text-9xl white-silver-animated-text">We are not an AI</p>
                <div className="h-32">
                    <RotatingText />
                </div>
                <p className="text-9xl white-silver-animated-text">Company</p>
            </div>
            <p className="text-4xl mt-12 tracking-normal white-silver-animated-text">We are all of the above.</p>
        </div>
    )
}

export default Hero;
