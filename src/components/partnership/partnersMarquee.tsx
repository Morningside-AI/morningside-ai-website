import Marquee from "react-fast-marquee";

import Partner1 from '@/assets/images/partners/1.webp'
import Partner2 from '@/assets/images/partners/2.webp'
import Partner3 from '@/assets/images/partners/3.webp'
import Partner4 from '@/assets/images/partners/4.webp'
import Partner5 from '@/assets/images/partners/5.webp'
import Partner6 from '@/assets/images/partners/6.webp'
import Partner7 from '@/assets/images/partners/7.webp'
import Partner8 from '@/assets/images/partners/8.webp'
import Partner9 from '@/assets/images/partners/9.webp'
import Partner10 from '@/assets/images/partners/10.webp'
import Image from "next/image";
const PartnershipMarquee = () => {
    return (
        <div>
            <Marquee speed={80} direction="right" style={{
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
            }}>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner1} alt="Partner 1" width={200} height={200} className="md:mr-6 mr-0 w-20 md:w-32 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner2} alt="Partner 2" width={200} height={200} className="md:mr-6 mr-0 w-28 md:w-44 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner3} alt="Partner 3" width={200} height={200} className="md:mr-6 mr-0 w-20 md:w-32 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner4} alt="Partner 4" width={200} height={200} className="md:mr-6 mr-0 w-20 md:w-32 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner5} alt="Partner 5" width={200} height={200} className="md:mr-6 mr-0 w-20 md:w-32 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner6} alt="Partner 6" width={200} height={200} className="md:mr-6 mr-0 w-14 md:w-24 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner7} alt="Partner 7" width={200} height={200} className="md:mr-6 mr-0 w-20 md:w-32 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner8} alt="Partner 8" width={200} height={200} className="md:mr-6 mr-0 w-20 md:w-32 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner9} alt="Partner 9" width={200} height={200} className="md:mr-6 mr-0 w-20 md:w-32 mx-4 mb-3 object-contain" />
                </div>
                <div className="flex flex-row items-center justify-center gap-4 h-36 mx-4" >
                    <Image src={Partner10} alt="Partner 10" width={200} height={200} className="md:mr-6 mr-0 w-20 md:w-32 mx-4 mb-3 object-contain" />
                </div>
                
            </Marquee>
        </div>
    )
}

export default PartnershipMarquee;
