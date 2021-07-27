let particleArray = [];
let starArray = [];
let n = 200;
let paused = false;
let totalMass = 0;
let HEIGHT = 500;
let xoffset = 0;
let yoffset = 0;
let baseZoom = 0;
let center;

function setup() {
  
  var canvas = createCanvas(windowWidth, HEIGHT);
  canvas.parent('sketch-holder');
  
  for(let i = 0; i < n; i++) {
    let p = new Particle(random(1,20));
    particleArray.push(p);

    totalMass+= p.mass;
  }

  for(let i = 0; i < 1000; i++) {
    starArray.push(new Star());
  }

  center = createVector(windowWidth/2.,HEIGHT/2.);

  

}

function calcForce(p1,p2) {
  if (p1.collided || p2.collided) {return;}
  let r = p5.Vector.sub(p1.position, p2.position);
  let distance = r.mag();
  if (distance < (p1.radius + p2.radius)) {
    // colision
    p1.collide(p2);
    return;
  }
  let force = r.mult(-p1.mass*p2.mass).div(distance**3);
  p1.applyForce(force);
  p2.applyForce(force.mult(-1));
}


function calculateCOF() {
  let cof = createVector(0,0);
  let xx = [];
  let yy = [];
  particleArray.forEach(p => {
    cof.x += p.position.x*p.mass;
    cof.y += p.position.y*p.mass;
    if (!p.collided) {
      xx.push(p.position.x);
      yy.push(p.position.y);
    }
  });
  cof = cof.div(totalMass, totalMass);
  
  let factorX = 0.95*windowWidth/(max(xx)-min(xx)); 
  let factorY = 0.95*HEIGHT/(max(yy)-min(yy));
  let factor = max(min(factorX, factorY), 0.4) + baseZoom;
  return {cof, factor};
}

function drawBackground() {

  background(20);
  
  push();
  
  for (let i = 0; i < starArray.length; i++) {
     const star = starArray[i];
     stroke(star.color);
     point(star.position);
    
  }
  pop();
}

function draw() {
  
  let {cof, factor} = calculateCOF();
  
  translate(center.x, center.y);
  scale(factor);
  translate(-cof.x-xoffset, -cof.y-yoffset);

  let s = map(factor, 0.4, 2, 2.5, 1);
  strokeWeight(s);
 
  drawBackground();
  
  if (!paused) {
    for(let i = 0; i < particleArray.length; i++) {
      for(let j = 0 ; j < i; j++) {
        calcForce(particleArray[i], particleArray[j]);
      }
    }
    for(let i = 0; i < particleArray.length; i++) { 
      particleArray[i].update();
      
    }
  }

  for(let i = 0; i < particleArray.length; i++) {
    particleArray[i].render();
  }

}

function keyPressed() {
  if (key === 'p') {
    paused = !paused ;
  } 

  if (key === 'ArrowUp') {
    yoffset += 20;
  }

  if (key === 'ArrowDown') {
    yoffset -= 20;
  }

  if (key === 'ArrowLeft') {
    xoffset -= 50;
  }

  if (key === 'ArrowRight') {
    xoffset += 50;
  }
 
}

function touchMoved(event) {

  xoffset += (pmouseX - mouseX);
  yoffset += (pmouseY - mouseY);
  return false;

}

function mouseWheel(event) {
  
  baseZoom += event.deltaY/1000; 

}