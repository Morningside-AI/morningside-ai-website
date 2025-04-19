import "@/styles/fonts.css";

const Hero = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-center text-white tracking-[-0.04em] leading-[90%] pt-8">
            <div>
                <p className="text-9xl white-silver-animated-text">We are not an AI</p>
                <p className="text-9xl green-text" style={{ fontFamily: "DM-Mono-Italic" }}>Education</p>
                <p className="text-9xl white-silver-animated-text">Company</p>
            </div>
            <p className="text-4xl mt-12 tracking-normal white-silver-animated-text">We are all of the above.</p>
        </div>
    )
}

export default Hero;
