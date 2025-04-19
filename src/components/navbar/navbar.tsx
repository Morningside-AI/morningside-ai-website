import "@/styles/fonts.css";
import Logo from "@/assets/images/morningside-assets/logo-FullWhite.svg";
import { GoArrowUpRight } from "react-icons/go";

const Navbar = () => {
    return (
        <div className="w-full h-fit flex flex-row justify-between items-center pt-4">
            <Logo className="w-36 h-10" />
            <div className="flex items-center">
                <button className="flex border-[1.6px] cursor-pointer border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-full">
                    <div className="w-full h-full flex flex-row text-white items-center gap-1 bg-black hover:filter hover:invert-[1] transition-all duration-300 px-2 py-1 rounded-full">
                        Get In Touch
                        <GoArrowUpRight color="white" size={18} strokeWidth={1} className="mt-1" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Navbar;
