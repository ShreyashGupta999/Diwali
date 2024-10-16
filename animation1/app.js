let canvas, ctx, w, h;
let fireworks = [], particles = [], circles = [];
const fireworksMax = 50;
const fireworksChance = 0.2;
let hue = 0;

function init() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  animationLoop();
}

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, w, h);
}

function animationLoop() {
  // Add fireworks if conditions are met
  if (fireworks.length < fireworksMax && Math.random() < fireworksChance) {
    fireworks.push(new Firework());
    hue += 10;
  }

  // Draw background with slight opacity for fading effect
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0, 0, 0, .1)";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";

  drawScene();
  cleanUpArrays();

  // Loop animation
  requestAnimationFrame(animationLoop);
}

function drawScene() {
  fireworks.forEach(firework => {
    firework.update();
    firework.draw();
  });

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  circles.forEach(circle => {
    circle.update();
    circle.draw();
  });
}

function cleanUpArrays() {
  // Filter out finished fireworks, particles, and circles
  fireworks = fireworks.filter(firework => firework.alpha > 0);
  particles = particles.filter(particle => particle.size > 0);
  circles = circles.filter(circle => circle.size < circle.endSize);

  // Create explosions for fireworks that are done
  fireworks.forEach(firework => {
    if (firework.alpha <= 0) createExplosion(firework.x, firework.y, firework.hue);
  });
}

function createExplosion(x, y, hue) {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, y, hue, i));
  }
  circles.push(new Circle(x, y, hue));
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

class Firework {
  constructor() {
    this.x = getRandomInt(w * 0.3, w * 0.7);
    this.y = h;
    this.targetY = getRandomInt(h * 0.2, h * 0.4);
    this.hue = hue;
    this.alpha = 1;
    this.tick = 0;
    this.ttl = getRandomInt(120, 180);
  }

  update() {
    const progress = 1 - (this.ttl - this.tick) / this.ttl;
    this.y = h - (h - this.targetY) * easeOutQuart(progress);
    this.alpha = 1 - easeOutQuart(progress);
    this.tick++;
  }

  draw() {
    if (this.tick <= this.ttl) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
      ctx.fill();
      ctx.closePath();
    }
  }
}

class Particle {
  constructor(x, y, hue, index) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.size = getRandomInt(2, 3);
    this.speed = getRandomInt(30, 40) / 10;
    this.angle = getRandomInt(0, 36) + 36 * index;
  }

  update() {
    const radian = (Math.PI / 180) * this.angle;
    this.x += this.speed * Math.sin(radian);
    this.y += this.speed * Math.cos(radian);
    this.size -= 0.05;
  }

  draw() {
    if (this.size > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
      ctx.fill();
      ctx.closePath();
    }
  }
}

class Circle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.size = 0;
    this.endSize = getRandomInt(100, 130);
  }

  update() {
    this.size += 15;
  }

  draw() {
    if (this.size < this.endSize) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, .2)`;
      ctx.fill();
      ctx.closePath();
    }
  }
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resizeCanvas);
