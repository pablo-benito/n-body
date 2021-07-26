let p1;
let p2;
let fixedParticle;
let particleArray = [];
let starArray = [];
let n = 200;
let paused = false;
let totalMass = 0;
let HEIGHT = 500;

function setup() {
  
  createCanvas(windowWidth, HEIGHT);
  
  for(let i = 0; i < n; i++) {
    let p = new Particle(random(1,20));
    particleArray.push(p);

    totalMass+= p.mass;
  }

  for(let i = 0; i < 1000; i++) {
    starArray.push(new Star());
  }

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
  let factor = max(min(factorX, factorY), 0.4);
  return {cof, factor, factorX, factorY};
}

function drawBackground(factor) {
  push();
  
  if (factor < 0.8) {
    strokeWeight(2);
  } else {  
    strokeWeight(1);
  }
  for (let i = 0; i < starArray.length; i++) {
     const star = starArray[i];
     stroke(star.color);
     point(star.position);
    
  }
  pop();
}

function draw() {
  background(20);
  
  let {cof, factor, factorX, factorY} = calculateCOF();
  let center = createVector(windowWidth/2.,HEIGHT/2.);
  
  translate(center.x, center.y);
  scale(factor);
  translate(-cof.x, -cof.y);
  drawBackground(factor);
  
  
  
  //translate(windowWidth/2. - cof.x, 250 - cof.y );
  //scale(2*factorX, factorY);
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
}
