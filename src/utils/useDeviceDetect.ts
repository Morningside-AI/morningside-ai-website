import { useState, useEffect } from 'react';

export default function useDeviceDetect() {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
  
    useEffect(() => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    }, []);
  
    return { isMobile, isTablet };
  }