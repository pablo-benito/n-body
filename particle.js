
let MAX_HISTORY = 600;

class Particle {
  constructor(mass) {
    this.collided = false;
    this.t = 0;
    this.mass = mass;
    let p = 0.0;
    let x = int(random(p*windowWidth,(1-p)*windowWidth));
    let y = int(random(500));
    this.position = createVector(x,y);
    this.radius = sqrt(mass);
    this.diameter = 2*this.radius;
    colorMode(HSB, 100);
    this.color = color(random(100), 100, 100);

    
    let maxVelocity = 5;
    this.velocity = createVector(random(-maxVelocity,maxVelocity)/this.radius, 
                          random(-maxVelocity,maxVelocity)/this.radius/1.5);
    
    this.history = [];
  }
  
  applyForce(force) {
     
    this.velocity.add(force.x/this.mass, force.y/this.mass);
   
  }
  
  update() {

    if (this.collided) {return;}
    
    this.t++;
    if (this.t % 3 == 0) {
      this.history.unshift(this.position);
      if (this.history.length > MAX_HISTORY) {
        this.history.length = MAX_HISTORY;
      }
    }
    
    this.position = p5.Vector.add(this.position, this.velocity);
  }

  renderPath() {
    if (this.collided) {return;}

    push();

    colorMode(HSB, 100);
    noFill();
    stroke(this.color);

    beginShape();
    for (let t = 0; t <this.history.length; t++) {
      
      vertex(this.history[t].x, this.history[t].y);
    }
    endShape();

    pop();
  }
  
  render() {
    if (this.collided) {return;}

    push();
  
    stroke(255);
    fill(0);
    circle(this.position.x, this.position.y, this.diameter);
    
    pop();

  }

  collide(otherParticle) {

    let totalMass = this.mass + otherParticle.mass;
    this.position.x = this.mass*this.position.x + otherParticle.mass*otherParticle.position.x;
    this.position.y = this.mass*this.position.y + otherParticle.mass*otherParticle.position.y;
    this.position = this.position.div(totalMass, totalMass);
    
    this.velocity.x = this.mass*this.velocity.x + otherParticle.mass*otherParticle.velocity.x;
    this.velocity.y = this.mass*this.velocity.y + otherParticle.mass*otherParticle.velocity.y;
    this.velocity = this.velocity.div(totalMass, totalMass);
    this.mass = totalMass;
    this.radius = sqrt(this.mass);
    this.diameter = 2*this.radius;
    otherParticle.mass = 0;
    otherParticle.radius = 0;
    otherParticle.diameter = 0;
    otherParticle.collided = true;
    otherParticle.history.length = 0;
  }
}