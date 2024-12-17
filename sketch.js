let ball;
let sprite;
let floor;
let balls = [];
let grabbedBall = null;
let clawL1, clawR1, cL, cR;
let clawL2, clawR2, cL2, cR2;
let score = 0;
let musi;
let musi1;
let images = [];
let selectedImage;
let imageProcessed = false; // New flag to track score processing for the selected imagelet timer = 30; // Timer starts at 30 seconds
let lastTime; // To store the last frame time for the timer
let timerRunning = true; // Flag to check if the timer is running
let imageToShow; // Image to display when the timer runs out
let timer = 60; 
let Timer; // To store the last frame time for the timer
let timerR = true; // Flag to check if the timer is running


// Learn more about p5play here -> https://p5play.org/learn

function setup() {
  // creates a canvas that fills the screen
  new Canvas(800, 700);
  Timer = millis();

  selectedImage = random(images);
  player = new Sprite();
  player.x = 200;
  player.y = 100;
  player.color = "#7c4b92";
  player.stroke = "0";
  player.collider = "k"; //changed to kinematic
  world.gravity.y = 5;
  r = random(255);
  g = random(255);
  b = random(255);

  // Left claw
  clawL = new Sprite(160, 100, 50, 10);
  cL = new HingeJoint(player, clawL);
  clawL.color = "#7c4b92";
  clawL.stroke = "0";
  cL.visible = false;
  cL.maxPower = 0;
  cL.lowerLimit = -50;
  cL.upperLimit = 50;
  clawL2 = new Sprite(140, 120, 10, 50);
  cL2 = new GlueJoint(clawL, clawL2);
  cL2.visible = false;
  clawL2.color = "#7c4b92";
  clawL2.stroke = "0";

  // Right claw
  clawR = new Sprite(240, 100, 50, 10);
  cR = new HingeJoint(player, clawR);
  clawR.color = "#7c4b92";
  clawR.stroke = "0";
  cR.visible = false;
  cR.maxPower = 0;
  cR.lowerLimit = -50;
  cR.upperLimit = 50;
  clawR2 = new Sprite(260, 120, 10, 50);
  cR2 = new GlueJoint(clawR, clawR2);
  cR2.visible = false;
  clawR2.color = "#7c4b92";
  clawR2.stroke = "0";

  // Left wall
  floor = new Sprite(120, 340, 15, 300, "static");
  floor.color = "0"; //the walls are there but transparent.
  floor.stroke = "0";
  floor = new Sprite(150, 490, 5, 100, "static");
  floor.color = "0"; //the walls are there but transparent.
  floor.stroke = "0";
  floor.rotation = -45;

  // Right wall
  floor = new Sprite(690, 340, 20, 460, "static");
  floor.color = "0";
  floor.stroke = "0";
  floor = new Sprite(520, 490, 5, 100, "static");
  floor.color = "0"; //the walls are there but transparent.
  floor.stroke = "0";
  floor.rotation = 45;
  // Main floor
  floor = new Sprite(300, 540, 500, 80, "static");
  floor.color = "0";
  floor.stroke = "0";

  // Prize boxes
  floor = new Sprite(550, 375, 10, 260, "static");
  floor.color = "#7c4b92";
  floor.stroke = "0";


  // Balls and their placement
  for (let i = 0; i < 25; i++) {
    balls.push(new Sprite(random(200, 450), random(350, 500), 50, 60)); // Random positions
    balls[i].diameter = 45; // Set the diameter of the balls
  }
}

function preload() {
  bgimg = loadImage("bg.png");
  musi = loadSound("bg.wav");
  musi1 = loadSound("hooray.wav");
  images[0] = loadImage("image1.png");
  images[1] = loadImage("image2.png");
  images[2] = loadImage("image3.png");
  images[3] = loadImage("image4.png");
  images[4] = loadImage("image5.png");
  images[5] = loadImage("image6.png");
  images[6] = loadImage("image7.png");
  images[7] = loadImage("image8.png");
  images[8] = loadImage("image9.png");
  images[9] = loadImage("image10.png");
}

function draw() {
  // Music
  musi.setVolume(0.1);
  if (!musi.isPlaying()) {
    musi.loop();
    musi.play();
  }

  clear();
  background(243, 230, 255);
  bgImg();

  if (timerR){
    if (keyIsDown(LEFT_ARROW)) player.x -= 3; // Move left
    if (keyIsDown(RIGHT_ARROW)) player.x += 3; // Move right
    if (keyIsDown(32)) player.y += 6;
    if (player.y >= 100) {
      player.y -= 3;
    }
  }

  // Make the claw stay in the machine
  player.x = constrain(player.x, 200, 190 + 470 - player.width);
  player.y = constrain(player.y, 150, 450);

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];

    if (
      dist(player.x, player.y, ball.x, ball.y) <
        player.width / 2 + ball.diameter / 2 &&
      !grabbedBall
    ) {
      if (keyIsDown(32)) {
        grabbedBall = ball;
        ball.isGrabbed = true;
      }
    }
  }
  
  if (grabbedBall) {
    grabbedBall.x = player.x;
    grabbedBall.y = player.y + player.height / 2 + 30;
  }

  // How to make the prize fall and update score only once
if (player.x >= 570 && grabbedBall && !imageProcessed) {
    // Reset grabbedBall to null after processing
    grabbedBall = null;

    // Check the selected image and update score
    if (selectedImage === images[4] || selectedImage === images[6]) {
      score += 3; // Add 3 points for image5 or image7
    } else if (
      selectedImage === images[0] ||
      selectedImage === images[1] ||
      selectedImage === images[9]
    ) {
      score += 2; // Add 2 points for image1, image2, or image10
    } else if (
      selectedImage === images[2] ||
      selectedImage === images[5] ||
      selectedImage === images[7] ||
      selectedImage === images[8]
    ) {
      score += 1; // Add 1 point for image3, image6, image8, or image9
    }

    // Mark the image as processed
    imageProcessed = true;
  }

  if (imageProcessed) {
    imageMode(CENTER);
    image(selectedImage, 400, 230, 250, 250);
  }

  if (player.x <= 570) {
    selectedImage = random(images); // Select a new image when the claw is near the drop zone
    imageProcessed = false; // Reset the flag to allow the next image to be processed
  }

  removeBalls();

  // Timer logic
  if (timerR) {
    let elapsedTime = millis() - Timer; // Time since the last frame
    if (elapsedTime >= 1000) { // Update every second
      timer--; // Decrease timer by 1 second
      Timer = millis(); // Reset the last time
    }

    // Stop the timer when it reaches 0
    if (timer <= 0) {
      timer = 0; // Make sure the timer doesn't go negative
      timerR = false; // Stop the timer
    }
  }

  // Display the remaining time only if the timer is still running
  if (timerR) {
    fill(0);
    textSize(32);
    text("Time: " + timer, width / 2 + 150, 50); // Display the timer in the center
    fill(0);
    textSize(32);
    text("Score: " + score, width / 2 - 270, 50);
  }

  // Once the timer runs out, display "Game Over" and the score
  if (!timerR) {
    player.color = "0";
    player.stroke = "0";
    clawL.color = "0";
    clawL.stroke = "0";
    clawL2.color = "0";
    clawL2.stroke = "0";
    clawR.color = "0";
    clawR.stroke = "0";
    clawR2.color = "0";
    clawR2.stroke = "0";
    push();
    rectMode(CENTER)
    fill(243, 230, 255)
    stroke(124, 75, 146);
    strokeWeight(10)
    rect(width / 2-50, height / 2 - 120, 330, 180)
    textAlign(CENTER);
    fill(0);
    noStroke();
    textSize(48);
    text("Times up!" , width / 2-50, height / 2 - 150);
    text("Your Score: " + score, width / 2-50, height / 2 - 100);
    textSize(32);
    text("Press R/r to restart", width / 2-50, height / 2 - 60);
    pop();
  if (!musi1.isPlaying()) {
    musi1.loop();
    musi1.play();
    musi.stop();
  }
  }
}

function removeBalls() {
  // Loop through the balls and remove those with x > 550
  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    if (ball.x > 550 && ball.y > 490) {
      ball.remove(); // Remove the ball from the screen
      balls.splice(i, 1); // Remove the ball from the array
    }
  }
}

function bgImg() {
  imageMode(CENTER);
  image(bgimg, 400, 350, 700, 700);
  fill(124, 75, 146);
  noStroke();
  textSize(32);
  text("R" , 505, 552);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    location.reload(); // Refresh the page
  }
}
