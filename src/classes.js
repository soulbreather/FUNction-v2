class Enemy { // this class creates enemies/enemies
    constructor(radius, enemyType, speed) {
        // positional variables
        this.x = -radius;
        this.y = 0;
        // this.angle = 0;
        this.trailPositions = [];
        this.trailLength = 20;

        this.hp = 10;

        // size and type
        this.radius = radius;
        this.enemyType = enemyType;
        this.speed = speed;
        this.hasCollided = false;
        this.col = color(random(0, 255), random(0, 255), random(0, 255));
        this.hasCollided = false;

        this.getANewImage();

        // coefficients variables
        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.d = 0;

        // it needs to be called once before running and displaying the enemy
        this.getCoefficients();
    }

    getANewImage() { // chooses a random image and sizes it according to the players screensize
        this.eImage = enemyImages[Math.floor(random(enemyImages.length))];
        this.iWidth = this.eImage.width / 1.6 * getImageSize() / 20;
        this.iHeight = this.eImage.height / 1.6 * getImageSize() / 20;
    }

    // this function creates and gets random coefficients
    getCoefficients() {
        if (this.enemyType == 1) {
            this.setupLineaer();
        } else if (this.enemyType == 2) {
            this.setupParabel();
        } else if (this.enemyType == 3) {
            this.setupEksponentiel();
        } else if (this.enemyType == 4) {
            this.setupHyperbel();
        } else if (this.enemyType == 5) {
            this.setupTrigo();
        }
    }

    // this function creates random coefficients for the lineaer function
    setupLineaer() {
        let x1 = -this.radius;
        let y1 = random(0, height);
        let x2 = width;
        let y2 = floor(random(0, height));
        this.a = (y2 - y1) / (x2 - x1);
        this.b = y1;

    }

    // this function creates random coefficients for the parabola function
    setupParabel() {
        let x1 = -this.radius;
        let y1 = floor(random(0 + 100, height - 100));
        let x2 = floor(random(width / 2 - 20, width / 2 + 20));
        let y2 = floor(random(0 - 400, height + 400));
        let x3 = width;
        let y3 = floor(random(0, height));
        this.a = ((x2 - x1) * y3 + (x1 - x3) * y2 + (x3 - x2) * y1) / ((x2 - x1) * x3 * x3 + (x1 * x1 - x2 * x2) * x3 + x1 * x2 * x2 - x1 * x1 * x2);
        this.b = -(((x2 * x2 - x1 * x1) * y3 + (x1 * x1 - x3 * x3) * y2 + (x3 * x3 - x2 * x2) * y1) / ((x2 - x1) * x3 * x3 + (x1 * x1 - x2 * x2) * x3 + x1 * x2 * x2 - x1 * x1 * x2));
        this.c = ((x1 * x2 * x2 - x1 * x1 * x2) * y3 + (x1 * x1 * x3 - x1 * x3 * x3) * y2 + (x2 * x3 * x3 - x2 * x2 * x3) * y1) / ((x2 - x1) * x3 * x3 + (x1 * x1 - x2 * x2) * x3 + x1 * x2 * x2 - x1 * x1 * x2);
    }

    // this function creates random coefficients for the power function
    setupEksponentiel() {
        let x1 = 0;
        let y1 = random(0, height);
        let x2 = width;
        let y2 = random(10, height);
        this.a = pow((y1 / y2), (1 / (x1 - x2)));
        this.b = (y1 / (pow(this.a, x1)));
    }

    // this function creates random coefficients for the hyperbolic function
    setupHyperbel() {
        let x1 = 50;
        let y1 = random(0, height);
        let x2 = width;
        let y2 = random(0, height);
        this.a = (x1 * x2 * y1 - x1 * x2 * y2) / (x2 - x1);
        this.c = (x2 * y2 - x1 * x1) / (x2 - x1);
    }

    // this function creates random coefficients for the trigonometric function
    setupTrigo() {
        this.a = random(80, height / 2);
        this.b = random(0.001, 0.01);
        this.c = random(0, TWO_PI);
        this.d = height / 2 + random(-40, 40);
    }

    move() { // calculates position
        this.x += this.speed;
        this.y = this.getYValue();
        this.angle = atan(this.getSlope());

        if (frameCount % 7 == 0) {
            this.trailPositions.unshift(createVector(this.x, this.y));
        }
        if (this.trailPositions.length > this.trailLength) {
            this.trailPositions.pop();
        }
    }

    display() { // draws at the current position
        this.displayTrail();
        push();
        translate(this.x, this.y);
        push();
        rotate((-PI / 2) + this.angle);
        imageMode(CENTER);
        image(this.eImage, 0, 0, this.iWidth, this.iHeight);
        // circle(0, 0, this.radius * 2);

        // draw healthbar
        pop();
        noStroke();
        fill(255, 0, 0);
        rect(-20, this.radius + 10, 40, 5);
        fill(0, 255, 0);
        rect(-20, this.radius + 10, 40 * this.hp / 10, 5);

        pop();
    }

    // calculates the Y value of the given x value according to its function
    getYValue() {
        let y = 0;
        if (this.enemyType == 1) {
            // lineaer funktion
            y = this.a * this.x + this.b;
        } else if (this.enemyType == 2) {
            // andengrads function
            y = this.a * pow(this.x, 2) + this.b * this.x + this.c;
        } else if (this.enemyType == 3) {
            // eksponentiel function
            y = this.b * pow(this.a, this.x);
        } else if (this.enemyType == 4) {
            // hyperbole function
            y = this.a * pow(this.x, -1) + this.c;
        } else if (this.enemyType == 5) {
            // trigo function
            y = this.a * sin(this.b * this.x + this.c) + this.d;
        }
        return y;
    }

    getSlope() { // calculates the slope of the functions
        let angle = 0;

        if (this.enemyType == 1) {
            // lineaer funktion
            angle = Math.atan(this.a);
        } else if (this.enemyType == 2) {
            // andengrads function
            angle = Math.atan(2 * this.a * this.x + this.b);
        } else if (this.enemyType == 3) {
            // eksponentiel function
            angle = Math.atan(this.b * log(this.a) * pow(this.a, this.x));
        } else if (this.enemyType == 4) {
            // hyperbole function
            angle = -(this.a / pow(this.x, 2));
            // angle = this.a * pow(this.x, -1) + this.c;
        } else if (this.enemyType == 5) {
            // trigo function
            angle = Math.atan(this.a * this.b * cos(this.b * this.x + this.c));

        }
        return angle;
    }

    displayTrail() { // creates and desplays trail behind enemies
        push();
        stroke(255);
        strokeWeight(1);
        for (let tN = 0; tN < this.trailPositions.length; tN++) {
            let trailPos = this.trailPositions[tN];
            fill(200);
            let newRadius;
            let distance = dist(trailPos.x, trailPos.y, this.x, this.y);
            newRadius = constrain(floor(this.radius * 20 * pow(distance + 1, -0.86)), 0, this.radius);
            if (newRadius > 1) circle(trailPos.x, trailPos.y, newRadius);
        }
        pop();
    }

    updateHealth(laserNumber, corresponding = 8, other = 0.8) { // updates enemy health when they are hit
        if (laserNumber + 1 == this.enemyType) {
            this.hp -= corresponding;
        } else {
            this.hp -= other;
        }
    }

    isDead() { // checks if enemy is dead
        return (this.hp <= 0);
    }
}

class Player {
    constructor(x, radius, speed) {
        this.x = x;
        this.y = height / 2;
        this.radius = radius;
        this.speed = speed;
        this.dir = 0;

        this.iWidth = playerImage.width / 1.6 * getImageSize() / 20;
        this.iHeight = playerImage.height / 1.6 * getImageSize() / 20;

        this.canFire = true;
        this.isFiring = false;
        this.rateOfFire = 0.06;
        this.lastFire = -this.rateOfFire;
    }

    move() {
        this.y += constrain(this.dir, -1, 1) * this.speed;
        // limit inside screen
        if (this.y <= this.radius) {
            this.y = this.radius;
        } else if (this.y >= height - this.radius) {
            this.y = height - this.radius;
        }
        // check if you can fire
        if (!this.canFire) {
            this.canFire = this.lastFire <= (millis() - this.rateOfFire * 1000);
        }
        if (this.canFire && this.isFiring) {
            audioLasers[selectedLaser].play();
            bullets.push(new Bullet(player.x - player.radius, player.y, 10, selectedLaser));
            this.canFire = false;
            this.lastFire = millis();
        }
    }

    display() {
        push();
        translate(this.x, this.y);
        imageMode(CENTER);
        rotate(-PI / 2);
        image(playerImage, 0, 0, this.iWidth, this.iHeight);
        pop();
    }

    // code that whether or not the buttons owned by the player has been pressed or released
    movement(state, myKey) {
        if (state == "pressed") {
            if (keyCode == UP_ARROW || myKey == "w") {
                this.dir -= 1;
            }
            if (keyCode == DOWN_ARROW || myKey == "s") {
                this.dir += 1;
            }
            if (myKey == "j" || keyCode == 32) {
                this.isFiring = true;
            }
        } else if (state == "released") {
            if (keyCode == UP_ARROW || myKey == "w") {
                this.dir += 1;
            }
            if (keyCode == DOWN_ARROW || myKey == "s") {
                this.dir -= 1;
            }
            if (myKey == "j" || keyCode == 32) {
                this.isFiring = false;
            }
        }
    }

    switchLaser() {
        if (parseInt(key) < 6 && parseInt(key) > 0) {
            selectedLaser = parseInt(key) - 1;
        }
    }
}

// bullet that is fired from player
class Bullet { // this class creates the bullets that the player shoots 
    // all bullets have the same radius
    static radius = 4;

    constructor(x, y, speed, laserNumber) {
        this.x = x;
        this.y = y;
        this.laserNumber = laserNumber;

        this.speed = speed;
    }

    move() {
        this.x -= this.speed;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(-PI / 2);
        imageMode(CENTER);
        let imageReference = playerLaserImages[this.laserNumber];
        image(imageReference, 0, 0, imageReference.width * 0.7, imageReference.height * 0.7);
        pop();
    }
}