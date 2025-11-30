import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

    const updateDeviceType = () => {
      if (mobileQuery.matches) {
        setDeviceType('mobile');
      } else if (tabletQuery.matches) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();

    mobileQuery.addEventListener('change', updateDeviceType);
    tabletQuery.addEventListener('change', updateDeviceType);

    return () => {
      mobileQuery.removeEventListener('change', updateDeviceType);
      tabletQuery.removeEventListener('change', updateDeviceType);
    };
  }, []);

  return deviceType;
};