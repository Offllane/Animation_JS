(() => {
  const cnv = document.querySelector('canvas');
  const ctx = cnv.getContext('2d');

  let cw, ch, cx, cy;

  function resizeCanvas() {
    cw = cnv.width = innerWidth;
    ch = cnv.height = innerHeight;
    cx = cw / 2;
    cy = ch / 2;
  }

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  const cfg = {
    bgFillColor: 'rgba(50,50,50, 0.07)',
    dirsCount: 6,
    stepsToTurn: 20,
  }

  function drawRect(color, x, y, w, h, shadowColor, shadowBlur) {
    ctx.shadowColor = shadowColor || 'black';
    ctx.shadowBlur = shadowBlur || 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  class Dot {
    constructor() {
      this.pos = {
        x: cx,
        y: cy
      };
      this.dir = Math.random() * 6 | 0;
      this.step = 0;
    }

    redrawDot() {
      let color = 'red';
      let size = 12;
      let x = this.pos.x - size / 2;
      let y = this.pos.y - size / 2;

      drawRect(color, x, y, size, size);
    }

    moveDot() {
      this.step++;
      this.pos.x += dirsList[this.dir].x;
      this.pos.y += dirsList[this.dir].y;
    }

    changeDir() {
      if (this.step % cfg.stepsToTurn == 0) {
        this.dir = Math.random()*6 |0;
      }
    }
  }

  let dirsList = [];

  function createDirs() {
    for (let i = 0; i < 360; i += 360 / cfg.dirsCount) {
      let x = Math.cos(i * Math.PI / 180);
      let y = Math.sin(i * Math.PI / 180);
      dirsList.push({
        x: x,
        y: y
      });
    }
  }
  createDirs();

  let dot = new Dot();
  dot.redrawDot();

  function loop() {
    // drawRect(cfg.bgFillColor, 0, 0, cw, ch);

    dot.redrawDot();
    dot.moveDot();
    dot.changeDir();

    requestAnimationFrame(loop);
  }
  loop();
})();