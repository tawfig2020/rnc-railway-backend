import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { QrCode, Download, Share } from '@mui/icons-material';
import QRCodeLib from 'qrcode';

const QRCodeGenerator = ({ url, title = "RNC Mobile Access", size = 200 }) => {
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const generateQRCode = async () => {
      if (canvasRef.current && url) {
        try {
          // Generate QR code on canvas
          await QRCodeLib.toCanvas(canvasRef.current, url, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          
          // Also generate data URL for download
          const dataUrl = await QRCodeLib.toDataURL(url, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrDataUrl(dataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [url, size]);

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = `rnc-${title.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
      link.href = qrDataUrl;
      link.click();
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Access RNC Platform on mobile`,
          url: url
        });
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback to copying URL
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        textAlign: 'center', 
        maxWidth: 300, 
        margin: '20px auto',
        borderRadius: 2
      }}
    >
      <Box sx={{ mb: 2 }}>
        <QrCode sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Scan to access on mobile device
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <canvas 
          ref={canvasRef}
          width={size}
          height={size}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            maxWidth: '100%',
            height: 'auto'
          }}
        />
      </Box>
      
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          mb: 2, 
          wordBreak: 'break-all',
          backgroundColor: '#f5f5f5',
          p: 1,
          borderRadius: 1
        }}
      >
        {url}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Download />}
          onClick={downloadQR}
        >
          Download
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Share />}
          onClick={shareQR}
        >
          Share
        </Button>
      </Box>
    </Paper>
  );
};

export default QRCodeGenerator;
