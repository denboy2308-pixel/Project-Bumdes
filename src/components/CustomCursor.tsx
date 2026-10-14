import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect mobile/touch devices
    const checkDevice = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (isMobile) return;

    // Hardware-accelerated movement updates directly on the element style
    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    // Dynamic hover detection for clickable elements
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .cursor-pointer, [onClick]'
      );
      
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Initial attach
    addHoverListeners();

    // Re-attach listeners periodically to capture dynamically rendered elements
    const interval = setInterval(addHoverListeners, 1000);

    // Hide default cursor on desktop
    const style = document.createElement('style');
    style.id = 'hide-default-cursor';
    style.innerHTML = `
      @media (min-width: 769px) {
        body, a, button, [role="button"], input, select, textarea, .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearInterval(interval);
      const cursorStyle = document.getElementById('hide-default-cursor');
      if (cursorStyle) cursorStyle.remove();
    };
  }, [isMobile, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        marginLeft: '-14px',
        marginTop: '-12px',
        willChange: 'transform',
      }}
      className="drop-shadow-[0_8px_16px_rgba(16,185,129,0.25)] select-none pointer-events-none"
    >
      {/* 3D Claymation Hand wrapper utilizing high performance CSS transitions for status updates */}
      <div
        style={{
          transition: 'transform 120ms cubic-bezier(0.25, 1, 0.5, 1)',
          transform: `scale(${isActive ? 0.8 : isHovered ? 1.25 : 1}) rotate(${isHovered ? -12 : -4}deg)`,
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Main 3D gradients */}
            <linearGradient id="claySkin" x1="12" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <linearGradient id="clayBlue" x1="16" y1="28" x2="32" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            <linearGradient id="clayHighlight" x1="16" y1="4" x2="24" y2="18" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Realistic 3D drop shadow filter */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="3" stdDeviation="2" floodColor="#000000" floodOpacity="0.12" />
              <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#1e293b" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Hand Shape Group with shadow */}
          <g filter="url(#softShadow)">
            {/* Blue Cuff/Sleeve - 3D Clay cylinder */}
            <path
              d="M 18,36 C 18,34 30,34 30,36 L 28,45 C 28,46 20,46 20,45 Z"
              fill="url(#clayBlue)"
            />
            <ellipse cx="24" cy="36" rx="6" ry="1.5" fill="#1d4ed8" opacity="0.4" />

            {/* Main Palm and Fingers */}
            {/* Index Finger (Pointing Up) */}
            <path
              d="M 19,16 C 19,8 24,8 24,16 L 24,28 L 19,28 Z"
              fill="url(#claySkin)"
            />
            {/* Index Highlight */}
            <path
              d="M 20,16 C 20,10 23,10 23,16 L 23,24 L 20,24 Z"
              fill="url(#clayHighlight)"
              opacity="0.6"
            />

            {/* Middle Finger (Folded) */}
            <rect x="24.5" y="19" width="4.5" height="9" rx="2.25" fill="url(#claySkin)" />
            {/* Ring Finger (Folded) */}
            <rect x="29" y="21" width="4.5" height="7" rx="2.25" fill="url(#claySkin)" />
            {/* Little Finger (Folded) */}
            <rect x="33.5" y="23" width="4" height="5" rx="2" fill="url(#claySkin)" />

            {/* Thumb (Elegantly resting/pointing outward slightly) */}
            <path
              d="M 18,25 C 13,25 12,28 15,31 C 18,34 20,31 20,28 Z"
              fill="url(#claySkin)"
            />

            {/* Main Hand Palm Body */}
            <path
              d="M 18,25 C 18,25 21,24 24,24 C 29,24 35,27 35,32 C 35,35 32,37 28,37 C 24,37 18,36 18,31 Z"
              fill="url(#claySkin)"
            />

            {/* Palm Inner Shading/Depth contour */}
            <path
              d="M 21,29 C 23,28 27,28 29,31"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
