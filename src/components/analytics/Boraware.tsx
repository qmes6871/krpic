'use client';

import Script from 'next/script';

export default function Boraware() {
  return (
    <>
      {/* BORAWARE LOG SCRIPT */}
      <Script
        id="boraware-config"
        strategy="afterInteractive"
      >
        {`var protect_id = 'i926';`}
      </Script>
      <Script
        id="boraware-script"
        strategy="afterInteractive"
        src="//script.boraware.kr/protect_script_v2.js"
      />
      <noscript>
        <img
          src="//script.boraware.kr/protect_nbora.php?protect_id=i926"
          style={{ display: 'none', width: 0, height: 0 }}
          alt=""
        />
      </noscript>
    </>
  );
}
