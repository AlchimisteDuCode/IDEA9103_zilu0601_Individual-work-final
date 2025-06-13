// ========== Initialize Variables ==========
let snowflakes = [];         // Array to store all snowflake objects
let stars = [];              // Array to store all star objects
let numStars = 250;          // Number of stars
let windDirection = 1;       // Wind direction: 1 = blowing right, -1 = blowing left
let windTimer = 0;           // Timer to control when wind direction changes
let windNoiseOffset = 0;     // Offset for Perlin noise to simulate smooth wind variation
let glowingFruits = [];      // Array to store all "glowing fruit" objects
 // Responsive Setup
let scaleFactor;  // Global scaling factor for maintaining proportions on different screen sizes
let originalWidth = 457; // Original canvas width (used as base reference)
let originalHeight = 650; // Original canvas height (used as base reference)

function setup() {
createCanvas(windowWidth, windowHeight); // Make the canvas size match the browser window (responsive)
originalWidth = 457;
originalHeight = 650;
angleMode(DEGREES); // Use degrees instead of radians for angle calculations


// ========== Generate Snowflakes ==========
// Create multiple snowflake objects and store them in the snowflakes array.
// These snowflakes will later be animated with Perlin-noise-influenced wind.
for (let i = 0; i < 270; i++) {
  snowflakes.push(new Snowflake());  // Create a new snowflake and add it to the array
}


// ========== Generate Stars ==========
// Star positions and flickering brightness will be static in location,
// but dynamic in brightness using Perlin noise for smooth variation.
randomSeed(42); // Set random seed to ensure consistent star field across runs
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: random(width),             // Random x-position
    y: random(height * 0.4),      // Limit stars to appear in the top 40% of the canvas
    size: random(1, 3),           // Random size range for each star
    offset: random(1000)          // Perlin noise offset for controlling brightness flicker
  });
}

// ========== Generate Glowing Fruits ==========
// Manually place "glowing fruits" (representing apples) at fixed positions.
// Each fruit will glow and gradually freeze, then fade away based on Perlin noise and random().
glowingFruits = [
new GlowingFruit(231.1, 417.4, 40),
new GlowingFruit(238.2, 444.1, 28),
new GlowingFruit(220.7, 467.94, 46),
new GlowingFruit(233.7, 219.3, 40),
new GlowingFruit(128.35, 142.5, 34),
new GlowingFruit(260.84, 201.4, 28),
new GlowingFruit(228.7, 369.8, 74),
new GlowingFruit(242.7, 314.6, 52),
new GlowingFruit(192, 201.1, 22),
new GlowingFruit(213.2, 200.2, 30),
new GlowingFruit(207, 182.55, 22),
new GlowingFruit(253.57, 274.75, 38),
new GlowingFruit(275.268,184.58, 22),
new GlowingFruit(172.4,268.8, 36),
new GlowingFruit(201.67, 272.3, 30),
new GlowingFruit(281.4, 272.3, 28),
new GlowingFruit(308.55, 267.65, 38),
new GlowingFruit(142, 240, 64),
new GlowingFruit(133.1, 194.7, 44),
new GlowingFruit(140.46, 165.9, 28),
new GlowingFruit(128.35, 142.5,32),
new GlowingFruit(95.38, 92.78, 52),
new GlowingFruit(101.96, 128.1, 36),
new GlowingFruit(319.4, 237.1, 42),
new GlowingFruit(325.77, 206.856, 32),
new GlowingFruit(328.277, 170.56, 54),
new GlowingFruit(326.36, 136.8, 26),
new GlowingFruit(345.9, 130, 20),
new GlowingFruit(369.53,134.278, 40),
new GlowingFruit(395.46, 143.946, 26),
new GlowingFruit(410.44, 127.88, 26),
new GlowingFruit(167.5, 481.436, 44),
new GlowingFruit(197.81, 483, 24),
new GlowingFruit(253.46, 480.3, 34),
new GlowingFruit(289.5, 485.86, 46),
new GlowingFruit(231.25, 248.5, 26),
new GlowingFruit(225.7, 267.2, 27),

];
}

// ========== draw() loop ==========
function draw() {

  // Dynamic Scaling 
 scaleFactor = min(width / originalWidth, height / originalHeight); // Calculate scaling factor based on window size
 scale(scaleFactor); // Scale all subsequent drawings to maintain visual proportions

 background(10, 10, 30); // Deep blue background simulating a winter night
 drawStars();   // Call star rendering function
 drawAllGraphics(); // Draw shared group visuals (static image)


// ========== Animate Wind ==========
  // Occasionally flip wind direction every 120 frames (approx 2 seconds),
  // but only with 1% probability per frame after cooldown.
if (frameCount - windTimer > 120 && random() < 0.01) {
windDirection *= -1; // Change wind direction with a 1% chance using random()
windTimer = frameCount;
}

windNoiseOffset += 0.01; // Smooth wind simulation using Perlin noise

// --- External Technique Notice ---
// The map() functions below were used to map Perlin noise values.
// I learned how to use these functions from The Coding Train's YouTube tutorials
// A detailed explanation of their purpose，usage and source is included in the README file.

// Compute wind force based on Perlin noise and direction
let windForce = map(noise(windNoiseOffset), 0, 1, -1.5, 1.5) * windDirection;


 // ========== Animate and Draw Snowflakes ==========
for (let flake of snowflakes) {
flake.update(windForce); // Update position based on wind force
flake.display();  // Render each snowflake as a white ellipse
}

// === Animate and render glowing fruits ===
for (let fruit of glowingFruits) {
fruit.update(); // Update freeze and fade-out status
fruit.display(); // Draw the glowing fruit
}

}


// ========== Draw twinkling stars using Perlin noise ==========
function drawStars() {
noStroke();
for (let i = 0; i < stars.length; i++) {
let star = stars[i];

// Use Perlin noise to create smooth fluctuations in brightness.
  // This avoids the harsh flicker of pure randomness.
let brightness = map(noise(star.offset + frameCount * 0.05), 0, 1, 50, 255);

fill(brightness);   // Set brightness based on Perlin noise
ellipse(star.x, star.y, star.size);  // Draw the star as a small glowing dot
}

// ========== Window Resize Handler ==========
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);// Automatically resize the canvas when the window is resized
}
}

// ========== Snowflake Class ==========
class Snowflake {
constructor() {
this.xoff = random(1000); // Unique Perlin noise offset for each snowflake’s path
this.y = random(-height, 0); // Random vertical start position above canvas
this.size = random(5, 12); // Snowflake size generated using random()
this.x = map(noise(this.xoff), 0, 1, 0, width); // Horizontal position determined by Perlin noise
this.ySpeed = random(1, 2); // Vertical falling speed randomized
}

update(windForce) {
this.y += this.ySpeed; // Fall vertically
this.xoff += 0.01;     // Increment noise offset
this.x += windForce;   // Drift horizontally based on Perlin-noise-driven wind

// Reset snowflake if it goes off screen
if (this.y > height) {
this.y = random(-50, -10); // Respawn above the screen
this.x = random(width);   // Random horizontal position
}
}

display() {
noStroke();
fill(255, 255, 255, 220); // White with slight transparency for soft look
ellipse(this.x, this.y, this.size);// Draw the snowflake

}
}

// ========== GlowingFruit Class ==========
// This class simulates an apple that slowly freezes, glows, and then disappears.
// The animation uses both Perlin noise (for smooth pulsing glow) and random() (for unpredictability)
class GlowingFruit {
constructor(x, y, baseSize) {
this.x = x;        // X-position of the fruit on canvas
this.y = y;        // Y-position of the fruit on canvas
this.baseSize = baseSize;  // Base size of the fruit
this.freezeProgress = 0;  // Freezing progress (from 0 to 1), controls color transition
this.noiseOffset = random(1000);  // Unique Perlin noise offset for each fruit to control glow variation
this.disappear = false; // State flag: whether fruit begins disappearing
this.fadeOut = 255;  // Controls gradual fade out
}

update() {
if (!this.disappear) {
// Gradually increase freezing progress over time
this.freezeProgress += 0.002; // The freeze progress is gradually increasing 
this.freezeProgress = constrain(this.freezeProgress, 0, 1);// Limit between 0 and 1


// Once freeze progress is above 80%, use random() to decide if this fruit should disappear
if (this.freezeProgress > 0.8 && random() < 0.002) {
this.disappear = true; // 0.2% chance per frame after freezing threshold
}
} else {
 // If in disappear state, gradually reduce opacity (fade out)
this.fadeOut -= 2; 
if (this.fadeOut < 0) this.fadeOut = 0; // Clamp to avoid negative alpha
}
}

display() {
push();
translate(this.x, this.y);// Move drawing context to fruit position


// --- External Technique Notice ---
// Using lerp() to interpolate color — technique learned from The Coding Train (YouTube)
// More details in README.

// === Color transition: simulates freezing ===
    // Using lerp() to interpolate between warm and cold colors
let r = lerp(222, 180, this.freezeProgress); // Red shifts from warm to cool
let g = lerp(94, 200, this.freezeProgress); // Green becomes brighter (frosty)
let b = lerp(96, 255, this.freezeProgress);  // Blue increases, representing ice



// === Glowing flicker effect: simulated with Perlin noise ===
    // Perlin noise gives smooth, organic variation in glow intensity
let glow = map(noise(this.noiseOffset + frameCount * 0.01), 0, 1, 150, 255);

// Simulate subtle pulsing in size using same Perlin noise offset
let sizePulse = this.baseSize + map(noise(this.noiseOffset + frameCount * 0.01), 0, 1, -1, 1);

 // Set fill with dynamic transparency: min() ensures fruit fades out properly
fill(r, g, b, min(this.fadeOut, glow));
noStroke();
ellipse(0, 0, sizePulse); // Draw glowing fruit

pop(); // Restore drawing context
}
}



// ========== 原图像绘制函数 ==========
function drawAllGraphics() {
let polygon1 = [
{ x: 28.13, y: 483.25 },
{ x: 78.67, y: 484.6 },
{ x: 79.45, y: 547.9 },
{ x: 26.65, y: 546.3 },
];
fill('#4E876B'); 
stroke('#262F37'); 
strokeWeight(2);
beginShape();
for (let pt of polygon1) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon2 = [
{ x: 78.67, y: 484.6 },
{ x: 79.45, y: 547.9 },
{ x: 388.9, y: 553 },
{ x: 388.9, y: 497 },
{ x: 206.1, y: 497.5 },
];
fill('#4E876B'); 
stroke('#262F37'); 
strokeWeight(2);
beginShape();
for (let pt of polygon2) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon3 = [
{ x: 388.9, y: 553 },
{ x: 388.9, y: 497 },
{ x: 425.4, y: 498.2 },
{ x: 426.6, y: 552.4 },
]
fill('#4E876B'); 
stroke('#262F37'); 
strokeWeight(2);
beginShape();
for (let pt of polygon3) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon10 = [
{ x: 106.4, y: 482 },
{ x: 107.8, y: 537 },
{ x: 337.4, y: 540.8},
{ x: 336.2, y: 486.2 },
]
noFill(); 
stroke('#262F37'); 
strokeWeight(5);
beginShape();
for (let pt of polygon10) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon4 = [
{ x: 106.4, y: 482 },
{ x: 107.8, y: 537 },
{ x: 149, y: 537.8 },
{ x: 149, y: 482.6 },
]
fill('#D3B265'); 
noStroke();
beginShape();
for (let pt of polygon4) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon5 = [
{ x: 187.2, y: 483.4 },
{ x: 187.2, y: 538.3},
{ x: 149, y: 537.8 },
{ x: 149, y: 482.6 },
]
fill('#DE5E60'); 
noStroke();
beginShape();
for (let pt of polygon5) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon6 = [
{ x: 187.2, y: 483.4 },
{ x: 187.2, y: 538.3},
{ x: 231.5, y: 539 },
{ x: 231.5, y: 484.2 },
]
fill('#75AD82'); 
noStroke();
beginShape();
for (let pt of polygon6) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon7 = [
{ x: 268.1, y: 485 },
{ x: 267.1, y: 539.7},
{ x: 231.5, y: 539 },
{ x: 231.5, y: 484.2 },
]
fill('#D3B265'); 
noStroke();
beginShape();
for (let pt of polygon7) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon8 = [
{ x: 268.1, y: 485 },
{ x: 267.1, y: 539.7},
{ x: 309, y: 540.39 },
{ x: 310, y: 485.7 },
]
fill('#75AD82'); 
noStroke();
beginShape();
for (let pt of polygon8) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
let polygon9 = [
{ x: 336.2, y: 486.2 },
{ x: 337.4, y: 540.8},
{ x: 309, y: 540.39 },
{ x: 310, y: 485.7 },
]
fill('#D3B265'); 
noStroke();
beginShape();
for (let pt of polygon9) {
vertex(pt.x, pt.y);
}
endShape(CLOSE);
// 阴影
let fixedCircles = [
{ x: 228.7, y: 369.8, r: 38.5, color: '#423B40' },
{ x: 242.7, y: 314.6, r: 28, color: '#423B40' },
{ x: 231.1, y: 417.4, r: 21.75, color: '#423B40' },
{ x: 238.2, y: 444.1, r: 16.5, color: '#423B40' },
{ x: 220.7, y: 467.94, r: 25, color: '#423B40' },
{ x: 233.7, y: 219.3, r: 23, color: '#423B40' },
{ x: 231.25, y: 248.5, r: 14.5, color: '#423B40' },
{ x: 192, y: 201.1, r: 13, color: '#423B40' },
{ x: 213.2, y: 200.2, r: 17, color: '#423B40' },
{ x: 260.84, y: 201.4, r: 16, color: '#423B40' },
{ x: 207, y: 182.55, r: 13, color: '#423B40' },
{ x: 275.268, y: 184.58, r: 13, color: '#423B40' },
{ x: 253.57, y: 274.75, r: 21.75, color: '#423B40' },
{ x: 225.7, y: 267.2, r: 15.5, color: '#423B40' },
{ x: 253.57, y: 274.75, r: 21.75, color: '#423B40' },
{ x: 172.4, y: 268.8, r: 20, color: '#423B40' },
{ x: 201.67, y: 272.3, r: 17, color: '#423B40' },
{ x: 281.4, y: 272.3, r: 16, color: '#423B40' },
{ x: 308.55, y: 267.65, r: 21, color: '#423B40' },
{ x: 142, y: 240, r: 34, color: '#423B40' },
{ x: 133.1, y: 194.7, r: 24, color: '#423B40' },
{ x: 140.46, y: 165.9, r: 16, color: '#423B40' },
{ x: 128.35, y: 142.5, r: 18, color: '#423B40' },
{ x: 95.38, y: 92.78, r: 28, color: '#423B40' },
{ x: 101.96, y: 128.1, r: 20, color: '#423B40' },
{ x: 319.4, y: 237.1, r: 23, color: '#423B40' },
{ x: 325.77, y: 206.856, r: 18, color: '#423B40' },
{ x: 328.277, y:170.56, r: 28.5, color: '#423B40' },
{ x: 326.36, y:136.8, r: 15, color: '#423B40' },
{ x: 345.9, y:130, r: 11.65, color: '#423B40' },
{ x: 369.53, y:134.278, r: 22, color: '#423B40' },
{ x: 395.46, y:143.946, r: 14.5, color: '#423B40' },
{ x: 410.44, y:127.88, r: 14.5, color: '#423B40' },
{ x: 167.5, y:481.436, r: 23.5, color: '#423B40' },
{ x: 197.81, y:483, r: 14, color: '#423B40' },
{ x: 253.46, y:480.3, r: 19, color: '#423B40' },
{ x: 289.5, y:485.86, r: 25, color: '#423B40' },
];
for (let c of fixedCircles) {
fill(c.color);
noStroke();
ellipse(c.x, c.y, c.r * 2);
}
let halfCircles = [
{ x:102, y: 48, r: 30 },
];
for (let c of halfCircles) {
fill('#423B40'); 
arc(c.x, c.y, c.r * 2, c.r * 2, 0, 180, 180); 
}
drawSplitCirclePrecise(228.7, 369.8, 35.5, 5.73, -1.33); 
drawSplitCirclePrecise(242.7, 314.6, 25, -9.2, -1.33); 
drawSplitCirclePrecise(231.1, 417.4, 18.75, -4.5, -181.33); 
drawSplitCirclePrecise(238.2, 444.1, 13.5, 2, -181.33); 
drawSplitCirclePrecise(220.7, 467.94, 22, 16.1, -1.33); 
drawSplitCirclePrecise(233.7, 219.3, 20, 2.1, -181.33);
drawSplitCirclePrecise(231.25, 248.5, 11.5, 1, -1.33);
drawSplitCirclePrecise(192, 201.1, 10, -1, 90.76);
drawSplitCirclePrecise(213.2, 200.2, 14, -1.2, 270.76);
drawSplitCirclePrecise(260.84, 201.4, 13, 1, 90.76);
drawSplitCirclePrecise(207, 182.55, 10, -1.4, -1.1);
drawSplitCirclePrecise(275.268, 184.58, 10, 1, -0.91);
drawSplitCirclePrecise(253.57, 274.75, 18.75, -4, 90.84);
drawSplitCirclePrecise(225.7, 267.2, 12.5, -3, 272.84);
drawSplitCirclePrecise(253.57, 274.75, 18.75, -4, 90.84);
drawSplitCirclePrecise(172.4, 268.8, 17, -1, 270.84);
drawSplitCirclePrecise(201.67, 272.3, 14, -2, 90.84);
drawSplitCirclePrecise(281.4, 272.3, 13, -2, 90.84);
drawSplitCirclePrecise(308.55, 267.65, 18, -4, 270.84);
drawSplitCirclePrecise(142, 240, 31, 4, 182.01);
drawSplitCirclePrecise(133.1, 194.7, 21, 6, 2.01);
drawSplitCirclePrecise(140.46, 165.9, 13, -1, 182.01);
drawSplitCirclePrecise(128.35, 142.5, 15, -0.9, -91.52);
drawSplitCirclePrecise(95.38, 92.78, 25, 3.1, -3.43);
drawSplitCirclePrecise(101.96, 128.1, 17, 1, -3.43);
drawSplitCirclePrecise(319.4, 237.1, 20, 5, 4.45);
drawSplitCirclePrecise(325.77, 206.856, 15, -2, 184.45);
drawSplitCirclePrecise(328.277, 170.56, 25.5, 2, 4.45);
drawSplitCirclePrecise(326.36, 136.8, 12, -5, 184.45);
drawSplitCirclePrecise(345.9, 130, 8.65, -1, -254.52);
drawSplitCirclePrecise(369.53, 134.278, 19, -2, -74.52);
drawSplitCirclePrecise(395.46, 143.946, 11.5, -1.1, -74.52);
drawSplitCirclePrecise(410.44, 127.88, 11.5, 3, 182.84);
drawSplitCirclePrecise(167.5, 481.436, 20.5, 2, 91.27);
drawSplitCirclePrecise(197.81, 483, 11, -1, 271.27);
drawSplitCirclePrecise(253.46, 480.3, 16, 4, 91.27);
drawSplitCirclePrecise(289.5, 485.86, 22, 0.5, 271.27);
drawSplitSemiCircle(102, 48, 27, -6, -3.43, "up");
let points1 = [
{ x: 97.27, y: 48.12 },
{ x: 103, y: 144 },
{ x: 141.69, y: 143 },
{ x: 137.2, y: 268.4 },
{ x: 323.1, y: 272 },
{ x: 332.15, y: 126.1 },
{ x: 406.4, y: 146.7 },
{ x: 407.8, y: 119 },
{ x: 414.9, y: 119.26 },
];
stroke('#DBAD6E');
strokeWeight(2);
noFill();
beginShape();
for (let pt of points1) {
vertex(pt.x, pt.y);
}
endShape();
let points2 = [
{ x: 204.45, y: 173.55 },
{ x: 204.96, y: 201.1 },
];
stroke('#DBAD6E');
strokeWeight(2);
noFill();
beginShape();
for (let pt of points2) {
vertex(pt.x, pt.y);
}
endShape();
let points3 = [
{ x: 185.85, y: 200.67 },
{ x: 276.2, y: 201.9 },
{ x: 275.76, y: 176.3 },
];
stroke('#DBAD6E');
strokeWeight(2);
noFill();
beginShape();
for (let pt of points3) {
vertex(pt.x, pt.y);
}
endShape();
let points4 = [
{ x: 231.4, y: 201.9 },
{ x: 237.1, y: 484.2 },
];
stroke('#DBAD6E');
strokeWeight(2);
noFill();
beginShape();
for (let pt of points4) {
vertex(pt.x, pt.y);
}
endShape();
let points5 = [
{ x: 106.43, y: 481.87 },
{ x: 336.2, y: 486.3 },
];
stroke('#DBAD6E');
strokeWeight(3);
noFill();
beginShape();
for (let pt of points5) {
vertex(pt.x, pt.y);
}
endShape();
drawTopArch(128.4, 537.5, 41.2, 36.8, '#4E876B', '#DBAD6E', 2);
drawTopArch(168, 538, 38.3, 30, '#DBAD6E', '#DBAD6E', 2);
drawTopArch(209, 538.6, 44.2, 48.8, '#DE5E60', '#DBAD6E', 2);
drawTopArch(249.46, 539.3, 35.9, 40.2, '#DE5E60', '#DBAD6E', 2);
drawTopArch(289.5, 540, 41.97, 26.34, '#DBAD6E', '#DBAD6E', 2);
drawTopArch(323.4, 540.6, 28, 29.2, '#4E876B', '#DBAD6E', 2);
}
function drawSplitCirclePrecise(cx, cy, radius, splitOffset = 0, rotationDeg = 0) {
let resolution = 0.01;
let redPoints = [];
let greenPoints = [];
// 圆周点采样（全部基于局部坐标）
for (let angle = 0; angle <= 360; angle += degrees(resolution)) {
let x = cos(angle) * radius;
let y = sin(angle) * radius;
if (x <= splitOffset) {
redPoints.push({ x, y });
} else {
greenPoints.push({ x, y });
}
}
// 计算白线端点（在圆内）
let dx = splitOffset;
if (abs(dx) >= radius) return; // 超出圆，忽略
let dy = sqrt(sq(radius) - sq(dx));
let top = { x: dx, y: -dy };
let bottom = { x: dx, y: dy };
push();
translate(cx, cy);
rotate(rotationDeg);
noStroke();
// 🔴 红色区域
fill('#DE5E60');
beginShape();
vertex(top.x, top.y);
redPoints.forEach(p => vertex(p.x, p.y));
vertex(bottom.x, bottom.y);
endShape(CLOSE);
// 🟢 绿色区域
fill('#75AD82');
beginShape();
vertex(top.x, top.y);
greenPoints.forEach(p => vertex(p.x, p.y));
vertex(bottom.x, bottom.y);
endShape(CLOSE);
// // ⭕ 墨蓝描边
// stroke('#262F37');
// strokeWeight(2);
// noFill();
// ellipse(0, 0, radius * 2);
// ➖ 线
stroke('#DBAD6E');
strokeWeight(2);
line(top.x, top.y, bottom.x, bottom.y);
pop();
}
function drawSplitSemiCircle(cx, cy, radius, splitOffset = 0, rotationDeg = 0, direction = "up") {
let resolution = 0.01;
let points = [];
let startAngle = 0;
let endAngle = 180;
let flipY = -1;
if (direction === "down") {
startAngle = 180;
endAngle = 360;
flipY = 1;
}
let dx = constrain(splitOffset, -radius, radius);
let dy = sqrt(sq(radius) - sq(dx));
let arcX = dx;
let arcY = flipY * dy;
for (let angle = startAngle; angle <= endAngle; angle += degrees(resolution)) {
let x = cos(angle) * radius;
let y = sin(angle) * radius;
points.push({ x, y });
}
let redPoints = points.filter(p => p.x <= dx);
let greenPoints = points.filter(p => p.x > dx);
push();
translate(cx, cy);
rotate(rotationDeg);
noStroke();
fill('#DE5E60');
beginShape();
vertex(dx, 0);
redPoints.forEach(p => vertex(p.x, p.y));
endShape(CLOSE);
fill('#75AD82');
beginShape();
vertex(dx, 0);
greenPoints.forEach(p => vertex(p.x, p.y));
endShape(CLOSE);
// // ⭕ 墨蓝描边
// stroke('#262F37');
// strokeWeight(2);
// noFill();
// arc(0, 0, radius * 2, radius * 2, startAngle, endAngle);
// 白线画在颜色区域相反一侧（通过镜像 y 坐标）
stroke('#DBAD6E');
strokeWeight(2);
line(dx, 0, dx, -arcY);
pop();
} 
function drawTopArch(x, y, w, h, fillColor, strokeColor, strokeW = 2) {
// ⬛ 填充整体形状（无描边）
noStroke();
fill(fillColor);
beginShape();
for (let a = 0; a <= 180; a += 0.01) {
let px = x + cos(a) * w / 2;
let py = y - sin(a) * h / 2;
vertex(px, py);
}
vertex(x - w / 2, y); // 左下角点
vertex(x + w / 2, y); // 右下角点
endShape(CLOSE);
// 🟠 单独绘制弧线（有描边）
// ⭕ 墨蓝描边
noFill();
stroke(strokeColor);
strokeWeight(strokeW);
arc(x, y, w, h, 180, 0);
}

