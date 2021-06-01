
var trex, trex_running;
var edges, bottomEdge;
var score = 0;
var PLAY = 1, END = 2;
var gameState = PLAY;
var obstacleGroup,cloudGROUP;
var gameOver,gameOverImg;

//var gameState = "play";

function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImg =loadImage('ground2.png');
  cloudImg = loadImage('cloud.png');
  obstacleImg1 = loadImage('obstacle1.png')
  obstacleImg2 = loadImage('obstacle2.png')
  obstacleImg3 = loadImage('obstacle3.png')
  obstacleImg4 = loadImage('obstacle4.png')
  obstacleImg5 = loadImage('obstacle5.png')
  obstacleImg6 = loadImage('obstacle6.png');
  terex=loadAnimation('trex_collided.png');
  gameOverImg =loadImage('gameOver.png');
  restartImg = loadImage('restart.png');
}


function setup(){
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,100,50);
  trex.addAnimation( "running", trex_running);
  trex.scale = 0.6;
  console.log("trex: "+trex.depth);
  //trex.debug = true;
  //trex image should touch the obstacle
  trex.setCollider("rectangle",0,0,60,80);
  
  
  ground = createSprite(300,190,600,2);
  ground.addImage('stable', groundImg);
  console.log("ground: " + ground.depth)
  //ground.debug = true
  /*
  edges  = createEdgeSprites();
  bottomEdge = edges[3];
  //edges is an array
  //edges[0] left edge
  //edges[1] right
  //edges[2] top
  //edges[3] bottom
  */
  gameOver = createSprite(300,20,60,20);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  
  restart = createSprite(300,80,60,20);
  restart.addImage(restartImg);
  restart.visible = false;
  
  invisibleGround = createSprite(300,194,600,10);
  invisibleGround.visible = false;
  console.log("invisibleGround: " + invisibleGround.depth);
  
  obstacleGroup = new Group();
  cloudGroup = new Group();
 
}


function draw(){
  background("white");
  
  if(gameState === PLAY) {  
    ground.velocityX = -6;
    //game adaptive
    //ground.velocityX = - (6+ score/ 1000)
    
    //if space key is pressed and trex is on ground then trex jumps
    if(keyDown("space") && trex.y >= 156.1) {
      trex.velocityY = -10
    } //console.log(trex.y)
    
    //score = Math.round(score + frameCount/100);
    score = score + 1;  
    
    if(ground.x < 0)
      ground.x = 300;
    //adding gravity
    trex.velocityY = trex.velocityY + 0.5;
    //if 100 frames have passed then make next cloud
    if(frameCount % 100 === 0)
        spawnClouds();
    
    //% is the modulus operator that checks remainder of frameCount divided by 100

    if(frameCount % 70 === 0)
      spawnObstacle();
    
    gameOver.visible = false;
    
    if(trex.isTouching(obstacleGroup)){
      gameState = END;
    }
  }
  else if (gameState === END) {  
    ground.velocityX = 0;
    trex.addAnimation("terex", terex);
    trex.changeAnimation("terex");
    obstacleGroup.setVelocityXEach(0);
    //clouds should stop moving
    cloudGroup.setVelocityXEach(0);
    gameOver.addImage(gameOverImg);
  
   
    //obstacles should not disappear by giving negative lifetime
    //negative lifetime means its lifetime will not become 0
    obstacleGroup.setLifetimeEach(-1);
    //clouds should not disappear
    cloudGroup.setLifetimeEach(-1);
    
      
    //game over message should be displayed
    gameOver.visible = true;
    restart.visible = true;
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  textSize(15);
  text('score: '+ score, 500,30);
   
  trex.collide(invisibleGround);
  
  drawSprites();
  
  //if (restart is clicked) { instructions for making the game reset}
  
  //console.timeEnd();
  //console.count("function draw is running");
  //console.log(frameCount);
  //console.time();
}

function reset(){
  gameState = PLAY;
  //terex should not touch the obstacle
  obstacleGroup.destroyEach();
  trex.changeAnimation( "running")
  restart.visible=false
}

function spawnClouds(){
  var cloud = createSprite(600,random(30,60));
  cloudGroup.add(cloud);
  //giving lifetime to avoid memory leak
  // we have given lifetime as (distance/speed) + 10
  cloud.lifetime = (600/cloud.velocityX) + 10
  cloud.addImage("cloud", cloudImg);
  cloud.scale = random(0.5,0.8);
  cloud.velocityX = -4;
  //console.log("new cloud: " + cloud.depth)
  trex.depth = cloud.depth + 1;
}

 function spawnObstacle(){  
  var obstacle = createSprite(600,175,10,30);
   obstacleGroup.add(obstacle);
   //giving lifetime to avoid memory leak
   obstacle.lifetime = 600/6 + 10
  //Math.round() can round off any number
  var r = Math.round(random(1,6));
  obstacle.velocityX=-6;
  obstacle.scale=0.6;
  trex.depth = obstacle.depth + 1;
  console.log(r);
   switch(r){
   
     case 1: obstacle.addImage('o1',obstacleImg1);
             break;
     case 2: obstacle.addImage('o2',obstacleImg2);
             break;
     case 3: obstacle.addImage('o3',obstacleImg3);
             break;
     case 4: obstacle.addImage('o4',obstacleImg4);
             break;
     case 5: obstacle.addImage('o5',obstacleImg5);
             break;
     case 6: obstacle.addImage('o6',obstacleImg6);
             break;
     default: break;     
   }
  
   /*
   switch(switch expression){
     case a: //code to perform when value of 
               switch expression is a
     case b: //code to perform when value of 
               switch expression is b
       
    default: //code to perform when value of 
               switch expression is none of the above cases
    }
    */
   
    /*
   if(r===1)
     obstacle.addImage('o1',obstacleImg1);
   if(r===2)
     obstacle.addImage('o2',obstacleImg2);
   if(r===3)
     obstacle.addImage('o3',obstacleImg3);
   */
   
 }