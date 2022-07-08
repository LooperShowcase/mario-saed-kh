kaboom({
  global: true,
  scale: 2,
  fullscreen: true,
  clearColor: [0, 1, 1, 1],
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("spong", "spongebob.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("star", "star.png");
loadSprite("princes", "princes.png");
loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                                                                                                                            ",
    "                                                                                                                                                            ",
    "                                                                                                                                                            ",
    "                                                                                                                                                             ",
    "                                                                                                                                                            ",
    "                                                                                                                                                             ",
    "                                                                                                                                     ",
    "                                                                                                                                           ",
    "                                                                                                                                           ",
    "                                                                                                                                          ",
    "                        ======                                                                                                                                     ",
    "                  =G===         =G==                                                                                                                    ",
    "                                                                                                                                             ",
    "===================================================================================================                                                                                                    ",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    s: [sprite("spong"), solid(), "spong"],
    $: [sprite("surprise"), solid(), "surprise_coin"],
    "*": [sprite("surprise"), solid(), "surprise_princes"],
    G: [sprite("surprise"), solid(), "surprise_star"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    c: [sprite("coin"), solid(), "coin"],
    p: [sprite("princes"), solid(), "princes", body()],
    s: [sprite("pipe"), solid()],
    k: [sprite("spong"), "spong", body(), solid()],
    g: [sprite("star"), "star", solid(), body()],
  };
  const gameLevel = addLevel(map, mapSymbols);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    //add this
    big(),
  ]);

  keyDown("right", () => {
    player.move(150, 0);
  });
  keyDown("left", () => {
    player.move(-150, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      play("jump");
      player.jump(CURRENT_JUMP_FORCE);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("c", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_princes")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("p", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_star")) {
      destroy(obj);
      gameLevel.spawn("u", obj.gridPos);
      gameLevel.spawn("g", obj.gridPos.sub(0, 1));
    }
  });

  action("princes", (obj) => {
    obj.move(20, 0);
  });

  player.collides("coin", (obj) => {
    destroy(obj);
  });
  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify();
  });

  player.collides("prenses", (obj) => {
    destroy(obj);
    //add this
    player;
  });
  player.action(() => {
    camPos(player.pos);
    if (player.pos.y > 500) {
      go("lose");
    }
  });

  action("spong", (obj) => {
    obj.move(-30, 0);
  });
  action("star", (obj) => {
    obj.move(30, 0);
  });

  let lastGrounded = true;
  player.collides("spong", (obj) => {
    if (lastGrounded) {
      go("lose");
    } else {
      destroy(obj);
    }
  });

  player.action(() => {
    lastGrounded = player.grounded();
  });

  //scene end
});

scene("lose", () => {
  add([
    text("game over \nRand lost", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

start("game");
