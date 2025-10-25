# 🐝 Flappy Colb

A Flappy Bird-style game featuring a bee character, created for Flappy Colb.

## 🎮 Game Features

- **Smooth gameplay** with realistic physics
- **Beautiful graphics** with custom bee character
- **Online leaderboard** system
- **Responsive design** for all devices
- **Sound effects** for enhanced experience
- **Local and online score tracking**

## 🚀 How to Play

1. **Start the game** by clicking "Start Game"
2. **Control the bee** by pressing SPACE or clicking
3. **Avoid obstacles** (green pipes)
4. **Collect points** by flying through gaps
5. **Compete** on the leaderboard!

## 🛠️ Installation

### Local Development
1. Download all files
2. Open `index.html` in your browser
3. Start playing!

### Online Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📁 File Structure

```
flappy-colb/
├── index.html              # Main game page
├── style.css               # Game styles
├── script.js               # Game logic
├── leaderboard-api.js      # Leaderboard API
├── pchela.png              # Bee character image
├── api/
│   └── index.php           # PHP API for leaderboard
├── README.md               # This file
└── DEPLOYMENT.md           # Deployment instructions
```

## 🎯 Game Controls

- **SPACE** - Make bee flap wings
- **Mouse Click** - Make bee flap wings
- **Leaderboard Button** - View top scores

## 🏆 Leaderboard System

- **Local storage** fallback when server unavailable
- **Online synchronization** when API is accessible
- **Top 10 scores** displayed
- **Player names** and dates recorded

## 🎨 Customization

### Changing the Bee Image
1. Replace `pchela.png` with your image
2. Keep the same filename or update the path in `script.js`

### Modifying Game Difficulty
Edit values in `script.js`:
```javascript
// Bee physics
gravity: 0.3,        // Lower = easier
jumpPower: -10,      // Higher = stronger jump

// Obstacles
pipeGap: 250,        // Larger = easier
pipeSpeed: 1.5,      // Lower = easier
```

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

- Touch controls
- Responsive design
- Optimized for mobile screens

## 🔧 Technical Details

- **Pure JavaScript** - No frameworks required
- **Canvas 2D** for rendering
- **Web Audio API** for sounds
- **Fetch API** for leaderboard
- **LocalStorage** for offline scores

## 🐛 Troubleshooting

### Game not loading
- Check browser console (F12)
- Ensure all files are present
- Verify image file `pchela.png` exists

### Leaderboard not working
- Check API endpoint URL in `leaderboard-api.js`
- Verify server is running
- Check CORS settings

### Sound not playing
- Ensure browser allows audio
- Check Web Audio API support

## 📄 License

Created by Dastent for Flappy Colb.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Enjoy the game! 🐝🎮**
