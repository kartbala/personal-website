const canvas = document.getElementById('timeCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 800;
canvas.height = 600;

let time = 0;
const circles = [];
const MAX_CIRCLES = 50;
const CIRCLE_SPAWN_INTERVAL = 120; // Spawn a new circle every X frames (approx 2 seconds at 60fps)
let frameCount = 0;

// --- Color Palette ---
// Background will transition from a day-like blue to a night-like darker blue/purple
const START_BG_COLOR = { r: 135, g: 206, b: 235 }; // Sky Blue
const END_BG_COLOR = { r: 25, g: 25, b: 112 };     // Midnight Blue

// Circle colors - a few options
const CIRCLE_COLORS = [
    'rgba(255, 165, 0, 0.7)', // Orange
    'rgba(255, 255, 0, 0.7)', // Yellow
    'rgba(255, 192, 203, 0.7)', // Pink
    'rgba(173, 216, 230, 0.7)'  // Light Blue
];

function lerpColor(color1, color2, factor) {
    const r = color1.r + factor * (color2.r - color1.r);
    const g = color1.g + factor * (color2.g - color1.g);
    const b = color1.b + factor * (color2.b - color1.b);
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.initialRadius = radius;
    this.maxRadius = radius * 3 + 20; // Max growth
    this.color = color;
    this.opacity = 0.7; // Initial opacity
    this.growthRate = 0.1 + Math.random() * 0.1; // Slower growth

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        // Create a subtle gradient for each circle
        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color.replace(/[\d\.]+\)$/g, '0.9)')); // Brighter center
        gradient.addColorStop(1, this.color.replace(/[\d\.]+\)$/g, '0.3)')); // More transparent edge
        ctx.fillStyle = gradient;
        ctx.fill();
    };

    this.update = function() {
        if (this.radius < this.maxRadius) {
            this.radius += this.growthRate;
        } else {
            // Start fading once max radius is reached
            if (this.opacity > 0.02) {
                this.opacity -= 0.005;
                // Update color with new opacity
                this.color = this.color.replace(/[\d\.]+\)$/g, this.opacity.toFixed(2) + ')');
            } else {
                this.opacity = 0; // Mark for removal
            }
        }
        this.draw();
    };
}

function addCircle() {
    if (circles.length >= MAX_CIRCLES) return;

    const radius = 5 + Math.random() * 10; // Initial radius: 5 to 15
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = CIRCLE_COLORS[Math.floor(Math.random() * CIRCLE_COLORS.length)];
    circles.push(new Circle(x, y, radius, color));
}

function animate() {
    requestAnimationFrame(animate);
    frameCount++;

    // Background color transition
    // Let's make the transition happen over, say, 3000 frames (50 seconds at 60fps)
    const timeFactor = Math.min(time / 3000, 1);
    const currentBgColor = lerpColor(START_BG_COLOR, END_BG_COLOR, timeFactor);
    ctx.fillStyle = currentBgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add new circles periodically
    if (frameCount % CIRCLE_SPAWN_INTERVAL === 0) {
        addCircle();
    }

    // Update and draw circles
    for (let i = circles.length - 1; i >= 0; i--) {
        circles[i].update();
        if (circles[i].opacity === 0) {
            circles.splice(i, 1); // Remove faded circles
        }
    }

    time++;
}

// Initial setup
addCircle(); // Start with one circle
animate();
