const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(process.cwd(), 'public', 'avatars');

// Create avatars directory if it doesn't exist
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const analysts = [
  'warren-buffett',
  'cathie-wood',
  'ben-graham',
  'bill-ackman',
];

// Generate a simple SVG avatar for each analyst
analysts.forEach((analyst) => {
  const colors = {
    'warren-buffett': '#4F46E5',
    'cathie-wood': '#EC4899',
    'ben-graham': '#10B981',
    'bill-ackman': '#F59E0B',
  };

  const svg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="${colors[analyst]}" />
    <circle cx="200" cy="150" r="80" fill="white" opacity="0.2" />
    <circle cx="200" cy="350" r="120" fill="white" opacity="0.2" />
  </svg>`;

  fs.writeFileSync(path.join(avatarsDir, `${analyst}.svg`), svg);
});

console.log('Generated placeholder avatars in public/avatars/'); 