import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";

interface StatsBoxProps {
    number: number;
    numberText: string;
    text: string;
    link?: string;
    linkText?: string;
}

const StatsBox = ({ number, numberText, text, link, linkText }: StatsBoxProps) => {
    return (
        <div className="flex flex-col w-1/3 md:mb-0 mb-2 gap-4">
            <p className="lg:text-8xl md:text-7xl text-6xl">
                {number}{numberText}
            </p>
            <hr className="border-[#325E43] border-1 md:my-4 my-1" />
            <p className="text-lg text-white">
                {text}
            </p>
            {link && linkText && linkText !== "" && link !== "" && (
                <Link href={link} target="_blank" className="decoration-none flex flex-row items-center gap-1">
                    <p className="text-md green-text font-bold">
                    {linkText}
                    </p>
                    <GoArrowUpRight className="mt-1" strokeWidth={1} color="#325E43" size={18} />
                </Link>
            )}
        </div>
    )
}

export default StatsBox;
