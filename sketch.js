let p1;
let p2;
let fixedParticle;
let particleArray = [];
let n = 200;
let paused = false;
let totalMass = 0;


function setup() {
  
  createCanvas(windowWidth, 500);
  
  for(let i = 0; i < n; i++) {
    let p = new Particle(random(1,30));
    particleArray.push(p);

    totalMass+= p.mass;
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
  
  let factorX = windowWidth/(max(xx)-min(xx)); 
  let factorY = 500/(max(yy)-min(yy));
  
  return {cof, factorX, factorY};
}


function draw() {
  
  let {cof, factorX, factorY} = calculateCOF();
  
  translate(windowWidth/2. - cof.x, 250 - cof.y );
  //scale(2*factorX, factorY);
  background(220);
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
