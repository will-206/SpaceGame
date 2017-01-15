/* eslint-disable no-extra-parens */
/* eslint-disable max-len*/
/* eslint-disable max-statements*/
/* eslint-disable no-use-before-define*/
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable */

'use strict';

// global variables
let pauseLabel = {};
let cursors = {};
let ship = {};
let asteroidsGroup = {};
let spaceman = {};
let startingGate = {};
let explosion = {};
let hangerTilesGroup = {};
let spacemanAcquired = false;
let line = {};
let borderLineTop = {};
let borderLineBottom = {};
let borderLineRight = {};
let borderLineLeft = {};
let pointer = {};
let intersectPoint = {};
let pauseTime = 0;
let unpauseTime = 0;
let totalTimePaused = 0;

let startTime = 0;
let time = 0;
let timeText = {};
let gameStarted = false;
let finishTime = 0;

const mapSizeX = 1920;
const mapSizeY = 1920;

const screenSizeX = 1000;
const screenSizeY = 700;

// const screenSizeX = mapSizeX;
// const screenSizeY = mapSizeY;

const shipProperties = {
   // start coordinates
  startX: mapSizeX / 2,
  startY: mapSizeY - 300
};

const graphicAssets = {
  background: { URL: '/assets/deep-space.jpg', name: 'deepSpace' },
  ship: { URL: '/assets/xenon2_ship.png', name: 'ship' },
  asteroid: { URL: '/assets/factory.png', name: 'asteroid' },
  spaceman: { URL: '/assets/phaser-dude.png', name: 'spaceman' },
  startingGate: { URL: '/assets/bullet.png', name: 'startingGate' },
  kaboom: { URL: '/assets/explode.png', name: 'kaboom' },
  hanger: { URL: '/assets/tron.png', name: 'hanger' },
  pointer: { URL: '/assets/pointer.png', name: 'pointer' }
};

const preload = (() => {
  game.load.image(graphicAssets.background.name, graphicAssets.background.URL);
  game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);
  game.load.image(graphicAssets.asteroid.name, graphicAssets.asteroid.URL);
  game.load.image(graphicAssets.spaceman.name, graphicAssets.spaceman.URL);
  game.load.image(graphicAssets.startingGate.name, graphicAssets.startingGate.URL);
  game.load.spritesheet(graphicAssets.kaboom.name, graphicAssets.kaboom.URL, 128, 128);
  game.load.image(graphicAssets.hanger.name, graphicAssets.hanger.URL);
  game.load.image(graphicAssets.pointer.name, graphicAssets.pointer.URL);
});

const create = (() => {
  // set asteroid coordinates
  const gameObjects = {
    asteroids: [[630, 550], [674, 686], [690, 770], [769, 510], [835, 660], [535, 730], [1005, 619], [999, 675], [885, 835], [456, 547], [346, 634], [451, 289], [346, 634], [366, 434], [833, 387], [705, 207], [960, 273], [702, 994], [569, 938], [409, 867], [451, 1082], [1185, 882], [1272, 846], [1418, 871], [1588, 895], [451, 289], [346, 634], [366, 434]],
    hangerTiles: [[0, 0], [50, 0], [100, 0], [450, 0], [500, 0], [550, 0],
    [0, 50], [0, 100], [0, 150], [0, 200], [0, 250], [0, 300], [0, 350],
    [550, 50], [550, 50], [550, 50], [550, 100], [550, 150], [550, 200], [550, 250], [550, 300], [550, 350],
    [50, 350], [100, 350], [150, 350], [200, 350], [250, 350], [300, 350], [350, 350], [400, 350], [450, 350], [500, 350]]
  };

  game.add.tileSprite(0, 0, 1920, 1920, 'deepSpace');

  game.world.setBounds(0, 0, mapSizeX, mapSizeY);

  game.physics.startSystem(Phaser.Physics.arcade);

  // create ship sprite, enable physics
  ship = game.add.sprite(shipProperties.startX, shipProperties.startY, 'ship');
  ship.anchor.set(0.5, 0.5);
  game.physics.arcade.enable(ship);
  ship.body.collideWorldBounds = true;

  // create pointer
  // pointer = game.add.sprite(755, 1270, 'pointer');

  const offsetX = (mapSizeX / 2) - 300;
  const offsetY = mapSizeY - 600;

  // create asteroids
  asteroidsGroup = game.add.physicsGroup();

  const addAsteroids = (() => {
    for (const elem of gameObjects.asteroids) {
      const newObject = asteroidsGroup.create(elem[0], elem[1], 'asteroid');

      newObject.body.immovable = true;
    }
  });

  hangerTilesGroup = game.add.physicsGroup();

  const addHangerTile = (() => {
    for (const elem of gameObjects.hangerTiles) {
      const newObject = hangerTilesGroup.create(offsetX + elem[0], offsetY + elem[1], 'hanger');

      newObject.body.immovable = true;
    }
  });

  addAsteroids();
  addHangerTile();

  spaceman = game.add.sprite(600, 400, 'spaceman');
  game.physics.arcade.enable(spaceman);

  startingGate = game.add.sprite(offsetX + 150, offsetY + 0, 'startingGate');
  game.physics.arcade.enable(startingGate);

  cursors = game.input.keyboard.createCursorKeys();

  game.camera.follow(ship);
});

const update = (() => {
  // pause / play
  if (pauseLabel.text) {
    pauseLabel.kill();
  }
  pauseLabel = game.add.text(game.camera.x, game.camera.y, 'Pause', { font: '24px Arial', fill: 'red' });
  pauseLabel.inputEnabled = true;

  pauseLabel.events.onInputUp.add(() => {

    game.paused = true;
    if (pauseLabel.text) {
      pauseLabel.kill();
    }
    pauseTime = Date.now() - startTime;
    pauseLabel = game.add.text(game.camera.x, game.camera.y, 'Play', { font: '24px Arial', fill: 'red' });
  });

  const unpause = (() => {
    if (game.paused) {
      game.paused = false;
      totalTimePaused += Date.now() - startTime - pauseTime;
    }
  });

  game.input.onDown.add(unpause, self);

  // time counter text
  // time = game.time.totalElapsedSeconds().toFixed(1)
  if (timeText.text) {
    timeText.kill();
  }

  if (gameStarted) {
    time = (((Date.now() - startTime) - totalTimePaused) / 1000).toFixed(2);

    timeText = game.add.text(game.camera.x + screenSizeX - 200, game.camera.y, `Time: ${time}`, { fontSize: '32px', fill: 'red' });
  }
  // add collision physics
  if (game.physics.arcade.collide(ship, asteroidsGroup)) {
    explosion = game.add.sprite(ship.body.x, ship.body.y, 'kaboom');
    explosion.animations.add('kaboom');
    explosion.anchor.setTo(0.5, 0.5);
    explosion.play('kaboom', 30, false, true);
    ship.kill();
    spacemanAcquired = false;

    setTimeout(restart, 600);

    startTime = Date.now(); //reset time
    gameStarted = false;
  }

  game.physics.arcade.collide(ship, hangerTilesGroup);

  if (game.physics.arcade.overlap(ship, spaceman)) {
    spaceman.kill();
    spacemanAcquired = true;
  }

  if (game.physics.arcade.overlap(ship, startingGate)) {
    gameStarted = true;
    console.log('hit starting gate');
    if (spacemanAcquired === true) {
      console.log('victory ' + time);
      // stop game
      finishTime = time;
      gameStarted = false;
      game.paused = true;
    }
    startTime = Date.now() - totalTimePaused;
  }

  // ship movement /////////////////////
  if (cursors.up.isDown) {
    game.physics.arcade.accelerationFromRotation(ship.rotation - 1.5708, 200, ship.body.acceleration);
  }
  else {
    ship.body.acceleration.set(0);
  }
  if (cursors.left.isDown) {
    ship.body.angularVelocity = -300;
  }
  else if (cursors.right.isDown) {
    ship.body.angularVelocity = 300;
  }
  else {
    ship.body.angularVelocity = 0;
  }

  // border lines //////////////////////
  if (spacemanAcquired) {
    line = new Phaser.Line(ship.body.x, ship.body.y, shipProperties.startX, shipProperties.startY);
  }
  else {
    line = new Phaser.Line(ship.body.x, ship.body.y, spaceman.body.x, spaceman.body.y);
  }

  borderLineTop = new Phaser.Line(game.camera.x, game.camera.y, game.camera.x + screenSizeX, game.camera.y);

  borderLineBottom = new Phaser.Line(game.camera.x, game.camera.y + screenSizeY, game.camera.x + screenSizeX, game.camera.y + screenSizeY);

  borderLineRight = new Phaser.Line(game.camera.x + screenSizeX, game.camera.y, game.camera.x + screenSizeX, game.camera.y + screenSizeY);

  borderLineLeft = new Phaser.Line(game.camera.x - 10, game.camera.y, game.camera.x - 10, game.camera.y + screenSizeY);

  // pointer creation, alignment, deletion ///////////
  if (pointer.key) {
    pointer.destroy();
  }

  const intersectFunction = ((borderLines) => {
    for (const borderLine of borderLines) {
      intersectPoint = line.intersects(borderLine, true);

      if (intersectPoint) {
        pointer = game.add.sprite(intersectPoint.x, intersectPoint.y, 'pointer');
        pointer.anchor.set(0.5, -1);
        pointer.angle = (line.angle * 360) / (Math.PI * 2) + 90;
      }
    }
  });

  intersectFunction([borderLineTop, borderLineBottom, borderLineLeft, borderLineRight]);
});

const restart = (() => { game.state.start(game.state.current); });

const render = (() => {
  // game.debug.pointer(game.input.activePointer);
  // game.debug.cameraInfo(game.camera);
  // game.debug.spriteCoords(ship, 32, 500);
  // game.debug.geom(line);
  // game.debug.geom(borderLineTop);
  // game.debug.geom(borderLineBottom);
  // game.debug.geom(borderLineRight);
  // game.debug.geom(borderLineLeft);
  // game.debug.lineInfo(line, 32, 32);
});

const game = new Phaser.Game(screenSizeX, screenSizeY, Phaser.CANVAS, 'gamecontainer', { preload, create, update, render });
