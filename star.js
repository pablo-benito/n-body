class Star {
    constructor() {
        let x = random(-3*windowWidth, 3*windowWidth);
        let y = random(-3*HEIGHT, 3*HEIGHT);
        this.position = createVector(x,y);
        this.color = random(['yellow', 'blue', 'white']);
    }

    render() {
        stroke(this.color);
        point(this.position);
    }
}