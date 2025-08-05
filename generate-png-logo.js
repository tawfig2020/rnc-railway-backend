const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 90x90 canvas
const canvas = createCanvas(90, 90);
const ctx = canvas.getContext('2d');

// Clear canvas with transparent background
ctx.clearRect(0, 0, 90, 90);

// Draw outer circle
ctx.fillStyle = '#2E7D32';
ctx.beginPath();
ctx.arc(45, 45, 40, 0, 2 * Math.PI);
ctx.fill();

// Draw inner circle
ctx.fillStyle = '#4CAF50';
ctx.beginPath();
ctx.arc(45, 45, 32, 0, 2 * Math.PI);
ctx.fill();

// Add some design elements (simplified hands/community symbol)
ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
ctx.beginPath();
ctx.arc(35, 35, 8, 0, 2 * Math.PI);
ctx.fill();
ctx.beginPath();
ctx.arc(55, 35, 8, 0, 2 * Math.PI);
ctx.fill();

// Draw RNC text
ctx.fillStyle = 'white';
ctx.font = 'bold 16px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('RNC', 45, 45);

// Draw subtitle
ctx.font = '8px Arial';
ctx.fillText('Network', 45, 58);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./client/public/assets/rnc-logo.png', buffer);

console.log('RNC Logo PNG generated successfully!');
