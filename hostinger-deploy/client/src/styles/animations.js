import { keyframes } from '@emotion/react';

// Animations for various components
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const slideUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideIn = keyframes`
  from {
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Framer Motion variants
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.3
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const buttonVariants = {
  hover: { 
    scale: 1.05,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.95 
  }
};

export const navItemVariants = {
  hover: {
    scale: 1.1,
    color: "#D36135", // Terracotta color
    transition: {
      duration: 0.2
    }
  }
};

// Animation settings for AOS (Animate On Scroll)
export const defaultAOSConfig = {
  duration: 800,
  easing: 'ease-out',
  once: false,
  mirror: true
};

// Custom animation hooks for components
export const pageTransition = {
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

export const pageTransitionSettings = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// Cultural pattern animation
export const patternAnimation = keyframes`
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
`;
