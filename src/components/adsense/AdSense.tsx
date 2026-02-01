"use client";

import Script from "next/script";

type AdSenseProps = {
  publisherId: string;
};

const AdSense: React.FC<AdSenseProps> = ({ publisherId }) => {
  if (!publisherId) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export default AdSense;
