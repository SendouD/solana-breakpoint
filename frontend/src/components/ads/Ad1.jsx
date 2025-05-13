import { useRef, useEffect } from "react";

const backendapi=import.meta.env.VITE_BACKEND_API
  
  const AdComponent = () => {
      const adRef = useRef(null);
      const hasRun = useRef(false);
  
      useEffect(() => {
          if (!adRef.current || hasRun.current) return;
          hasRun.current = true;
  
          const script = document.createElement("script");
          script.src = `${backendapi}/advertisement.js`;
          script.async = true;
  
          script.setAttribute("data-ad-image", "https://res.cloudinary.com/dgjqg72wo/image/upload/v1738873337/qrrmigaw3ds7qoysznxq.jpg");
          script.setAttribute("data-ad-width", "400px");
          script.setAttribute("data-ad-height", "350px");
          script.setAttribute("data-ad-id", "h1");
          script.setAttribute("redirect-url", "https://www.google.com/");
          script.setAttribute("product", "p1");
  
          adRef.current.appendChild(script);
      }, []);
  
      return <div ref={adRef} id="ad-container"></div>;
  };
  
  export default AdComponent;