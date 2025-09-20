import React from 'react';
import { Box } from '@mui/material';

const RNCLogo = ({ size = 90, style = {} }) => {
  // Use the new RNC logo (green and blue heart design)
  const logoSrc = "/assets/rnc-new-logo.png";

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <img
        src={logoSrc}
        alt="RNC Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        onError={(e) => {
          // Fallback to CSS-only logo if SVG fails
          e.target.style.display = 'none';
          const parent = e.target.parentElement;
          parent.innerHTML = `
            <div style="
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              color: white;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              font-family: Arial, sans-serif;
            ">
              <div>RNC</div>
              <div style="font-size: 8px; opacity: 0.9;">Network</div>
            </div>
          `;
        }}
      />
    </Box>
  );
};

export default RNCLogo;
