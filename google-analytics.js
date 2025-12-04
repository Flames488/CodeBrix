// Google Analytics
(function() {
  // Your Measurement ID here
  const MEASUREMENT_ID = 'G-11445955788';
  
  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
  
  // Initialize
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
})();