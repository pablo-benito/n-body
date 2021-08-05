class Star {
    constructor() {
        let x = randomGaussian(windowWidth/2, windowWidth);
        let y = randomGaussian(HEIGHT/2, HEIGHT);
        this.position = createVector(x,y);
        this.color = random(['yellow', 'blue', 'white', 'orange']);
    }

    render() {
        stroke(this.color);
        point(this.position);
    }
}