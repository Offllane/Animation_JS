(() => {
  const cnv = document.querySelector('canvas');
  const ctx = cnv.getContext('2d');

  let cw, ch, cx, cy;
  

  function resizeCanvas() {
    let imageHeight = document.querySelector("img").height;
    cw = cnv.width = innerWidth;
    ch = cnv.height = imageHeight-10;
    cx = cw / 2;
    cy = ch / 2;
  }

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  const cfg = {
    hue: 0,
    bgFillColor: 'rgba(30,30,30,0.01)',
    dirsCount: 6,
    stepsToTurn: 40,
    dotSize: 2,
    dotsCount: 40000,
    dotVelocity: 1,
    distance: 500,
    gradientLen: 5
  };

  function CheckWindowWidth() {
    document.querySelector("img").setAttribute("width","100%");

    if (innerWidth < 700) {
      cfg.stepsToTurn = 20;
      document.querySelector("img").setAttribute("src", "img/lion_background_mobile.png");
      resizeCanvas();
      console.log("here");
    }

    console.log(cnv.height);

    if (innerWidth < 300) {
      cfg.stepsToTurn = 15;
      document.querySelector("img").setAttribute("src", "img/lion_background_mobile.png");
      document.querySelector("img").setAttribute("height", "100%");
      resizeCanvas();
    }
  }  

  console.log(cfg.stepsToTurn);

  function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gso) {
    ctx.globalCompositeOperation = gso;
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
      this.dir = cfg.dirsCount === 6 ? (Math.random() * 3 | 0)* 2
                : Math.random() * cfg.dirsCount |0;
      this.step = 0;
    }

    redrawDot() {
      let xy = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy);
      let makeHue = (cfg.hue + xy/cfg.gradientLen) % 360;
      let blur = cfg.dotSize;
      let color = `hsl(${cfg.hue}, 100%, 50%)`;
      let size =cfg.dotSize;
      let x = this.pos.x - size / 2;
      let y = this.pos.y - size / 2;

      drawRect(color, x, y, size, size, color, blur, 'lighter');
    }

    moveDot() {
      this.step++;
      this.pos.x += dirsList[this.dir].x*cfg.dotVelocity;
      this.pos.y += dirsList[this.dir].y*cfg.dotVelocity;
    }

    changeDir(id) {
      if (this.step % cfg.stepsToTurn == 0) {
        this.dir = Math.random() > 0.5 ? (this.dir + 1) % cfg.dirsCount : (this.dir + cfg.dirsCount - 1) % cfg.dirsCount;
      }
      let imageWidth = document.querySelector("img").width;
      let imageHeight = document.querySelector("img").height;

      if (this.pos.x > (cx + imageWidth/2) || this.pos.x <(cx - imageWidth/2) || this.pos.y > (cy+imageHeight/2) || this.pos.y <(cy-imageHeight/2)) {
       this.dir = Math.random() > 0.5 ? (this.dir + 1) % cfg.dirsCount : (this.dir + cfg.dirsCount - 1)%cfg.dirsCount;
      }
    }

    killDot(id) {
      let percent = Math.random() * Math.exp(this.step/cfg.distance);
      let imageWidth = document.querySelector("img").width;
      let imageHeight = document.querySelector("img").height;
      if (this.pos.x > (cx + imageWidth / 2 - 10) || this.pos.x < (cx - imageWidth / 2 + 10) || this.pos.y > (cy + imageHeight / 2 - 10) || this.pos.y < (cy - imageHeight / 2 + 10)) {
        dotsList.splice(id,1);
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

  let dotsList = [];
  function addDot() {
    if(dotsList.length < cfg.dotsCount && Math.random() > 0.8) {
      dotsList.push(new Dot());
      cfg.hue = (cfg.hue +1) % 360;
    }
  }

  function refreshDots() {
    dotsList.forEach ((i,id) => {
      i.moveDot();
      i.redrawDot();
      i.changeDir(id);
      i.killDot(id);
    })
  }

  document.querySelector("body").onload = CheckWindowWidth();

  function loop() {
    drawRect(cfg.bgFillColor, 0, 0, cw, ch, 0, 0, 'normal');
    addDot();
    refreshDots();
    requestAnimationFrame(loop);
  }
  loop();
})();