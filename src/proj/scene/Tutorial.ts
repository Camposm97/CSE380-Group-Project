import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Scene from "../../Wolfie2D/Scene/Scene";
import { initButtonHandler, initLabel } from "../ui/UIBuilder";
import {
  PlayerAnimations,
  RobotAnimations,
  RobotMouseAnimations,
  RobotStatueAnimations,
} from "./Constants";
import { LevelT_1, LevelT_2, LevelT_3, LevelT_4 } from "./LevelT";
import MainMenu from "./MainMenu";

const TUTORIAL_LAYER = "TUTORIAL";

const enum GO_TO {
  LEVELT_1 = "LEVELT_1",
  LEVELT_2 = "LEVELT_2",
  LEVELT_3 = "LEVELT_3",
  LEVELT_4 = "LEVELT_4",
  SKIP_TUTORIAL = "LEVEL1_1",
}

// Tutorial Room 1
const t1_1 = "In this room there are three hidden bombs. ";
const t1_2 =
  "As McBendojee gets closer to the bombs, his coat color will change. ";
const t1_3 = "If his coat is white, ";
// {insert White Player sprite here}
const t1_4 = "then he is near none of the bombs. ";
const t1_5 = "If his coat is yellow, ";
// {insert Yellow Player sprite here}
const t1_6 = "then he is 3 spaces away from the bomb. ";
const t1_7 = "If his coat is orange, ";
// {insert Orange Player sprite here}
const t1_8 = "then he is 2 spaces away from the bomb. ";
const t1_9 = "If his coat is red,";
// {insert Red Player sprite here}
const t1_10 = "then he is 1 space away from the bomb. ";
const t1_11 = "If you step on a bomb, it's gameover. ";
const t1_12 =
  'If you are 1 space away from the bomb and facing it, you can place a flag on by pressing "f". ';
// {insert Red Flag Sprite here}'
const t1_13 =
  "This won't deactivate the bomb, but know you know exactly which space it is on. ";
const t1_14 = "The goal is to get McBendorjee to the Green Flag ";
// {insert Green Flag Sprite here}.'
const t1_15 =
  "If there are any boxes blocking McBendorjee, you can push/pull them out by holding \"m\" . ";
// {Insert Block sprite here}'
const t1_16 =
  "Just be careful to not to block your own path. Blocks do not activate the bombs. ";
const t1_17 =
  'If you feel you have gotten stuck at anypoint, press "p" to reset the room. ';
const t1_18 = "The timer will not reset when you do this. ";

// Tutorial Room 2
const t2_1 = "In this room there is one robot ";
// {Insert Blue Robot}
const t2_2 = "and one hidden bomb. ";
const t2_3 =
  "The robot walks in the oposite direction that McBendorjee walks. ";
const t2_4 =
  "If McBendorjee attacks the robot by pressing space or left clicking, it will freeze for a moment, ";
const t2_5 =
  "then will walk in the same direction McBendorjee walks. Hit the robot again to get him ";
const t2_6 = "back to his primary behavior. ";
const t2_7 = "The only way to kill the robot is to have him step on the bomb. ";
const t2_8 =
  "If the robot steps on the bomb, the bomb will go off, destroying the enemy and the bomb. ";
const t2_9 =
  "If a room has robots, they must be destroyed before stepping on the green flag. ";

// Tutorial Room 3
const t3_1 = `In this room there is one robot mouse `;
// {Insert Blue Mouse Robot sprite}
const t3_2 = "and one hidden bomb. ";
const t3_3 =
  "This robot moves left and right, reversing it's direction everytime to collides with something. ";
const t3_4 =
  "If McBendorjee attacks the robot mouse, it will freeze for a moment, and McBendorjee will be able to ";
const t3_5 =
  "push it just like a block. Once the robot mouse unfreezes, it will start moving up and down instead. ";
const t3_6 =
  "Once again, you must get the robot to move over the bomb to destory it, then step on the green flag ";
const t3_7 = "to beat the room.";

// Tutorial Room 4
const t4_1 = "In this room there is one robot statue ";
// {Insert Blue Statue Robot sprite}
const t4_2 = "and one hidden bomb. ";
const t4_3 =
  "This robot does not move but instead shoots projectiles down, right, up and left. If you hit ";
const t4_4 =
  "the robot statue, it will move back a couple spaces and be frozen. Just like the mouse, the player ";
const t4_5 =
  "can push the robot statue while it's frozen. The statue will resume shooting projectiles once it unfreezes. ";

export class Tutorial1_1 extends Scene {
  loadScene(): void {
    this.load.spritesheet("mcbendorjee", "res/spritesheets/mcbendorjee.json");
    this.load.spritesheet("red_flag", "res/spritesheets/flag.json");
    this.load.spritesheet("green_flag", "res/spritesheets/green_flag.json");
    this.load.image("block", "res/sprites/block.png");
    this.load.audio("levelMusic", "res/music/CSE_380_Tutorial.mp3"); // Load Music info
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVELT_1, GO_TO.SKIP_TUTORIAL]);
    this.addUILayer(TUTORIAL_LAYER);
    const c = this.viewport.getCenter().clone();
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 350),
      t1_1 + t1_2 + t1_3
    ).fontSize = 18;

    let sprite1 = this.add.animatedSprite("mcbendorjee", TUTORIAL_LAYER);
    sprite1.animation.play(PlayerAnimations.IDLE_WHITE, true);
    sprite1.position = new Vec2(c.x, c.y - 310);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 270),
      t1_4 + t1_5
    ).fontSize = 18;

    let sprite2 = this.add.animatedSprite("mcbendorjee", TUTORIAL_LAYER);
    sprite2.animation.play(PlayerAnimations.IDLE_YELLOW, true);
    sprite2.position = new Vec2(c.x, c.y - 230);
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 190),
      t1_6 + t1_7
    ).fontSize = 18;

    let sprite3 = this.add.animatedSprite("mcbendorjee", TUTORIAL_LAYER);
    sprite3.animation.play(PlayerAnimations.IDLE_ORANGE, true);
    sprite3.position = new Vec2(c.x, c.y - 150);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 110),
      t1_8 + t1_9
    ).fontSize = 18;

    let sprite4 = this.add.animatedSprite("mcbendorjee", TUTORIAL_LAYER);
    sprite4.animation.play(PlayerAnimations.IDLE_RED, true);
    sprite4.position = new Vec2(c.x, c.y - 70);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 30),
      t1_10
    ).fontSize = 18;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 5),
      t1_11 + t1_12
    ).fontSize = 18;

    let redFlagSprite = this.add.animatedSprite("red_flag", TUTORIAL_LAYER);
    redFlagSprite.animation.play("IDLE");
    redFlagSprite.position = new Vec2(c.x, c.y + 35);
    redFlagSprite.scale = new Vec2(1.5, 1.5);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y + 60),
      t1_13 + t1_14
    ).fontSize = 18;

    let greenFlagSprite = this.add.animatedSprite("green_flag", TUTORIAL_LAYER);
    greenFlagSprite.animation.play("IDLE");
    greenFlagSprite.position = new Vec2(c.x, c.y + 100);
    greenFlagSprite.scale = new Vec2(1.5, 1.5);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y + 135),
      t1_15
    ).fontSize = 18;

    let blockSprite = this.add.sprite("block", TUTORIAL_LAYER);
    blockSprite.position = new Vec2(c.x, c.y + 170);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y + 200),
      t1_16
    ).fontSize = 18;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y + 225),
      t1_17 + t1_18
    ).fontSize = 18;

    initButtonHandler(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x - 120, c.y + 275),
      "Skip",
      GO_TO.SKIP_TUTORIAL
    );
    initButtonHandler(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x + 120, c.y + 275),
      "Try",
      GO_TO.LEVELT_1
    );

    this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {
      key: "levelMusic",
      loop: true,
      holdReference: true,
    });
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVELT_1:
          this.sceneManager.changeToScene(LevelT_1, {});
          break;
        case GO_TO.SKIP_TUTORIAL:
          this.sceneManager.changeToScene(Tutorial1_2, {});
          break;
      }
    }
  }
}

export class Tutorial1_2 extends Scene {
  loadScene(): void {
    this.load.spritesheet("blue_robot", "res/spritesheets/robots/robot_blue.json");
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVELT_2, GO_TO.SKIP_TUTORIAL]);
    this.addUILayer(TUTORIAL_LAYER);
    const c = this.viewport.getCenter().clone();
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 350),
      t2_1
    ).fontSize = 24;

    let blueRobotSprite1 = this.add.animatedSprite(
      "blue_robot",
      TUTORIAL_LAYER
    );
    blueRobotSprite1.animation.play(RobotAnimations.IDLE, true);
    blueRobotSprite1.position = new Vec2(c.x, c.y - 280);
    blueRobotSprite1.scale = new Vec2(0.4, 0.4);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 210),
      t2_2 + t2_3
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 170),
      t2_4
    ).fontSize = 24;

    let blueRobotSprite2 = this.add.animatedSprite(
      "blue_robot",
      TUTORIAL_LAYER
    );
    blueRobotSprite2.animation.play(RobotAnimations.FROZEN, true);
    blueRobotSprite2.position = new Vec2(c.x, c.y - 90);
    blueRobotSprite2.scale = new Vec2(0.4, 0.4);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 20),
      t2_5
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y + 20),
      t2_6
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y + 60),
      t2_7
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y + 100),
      t2_8
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y + 140),
      t2_9
    ).fontSize = 24;

    initButtonHandler(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x - 120, c.y + 275),
      "Skip",
      GO_TO.SKIP_TUTORIAL
    );
    initButtonHandler(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x + 120, c.y + 275),
      "Try",
      GO_TO.LEVELT_2
    );
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVELT_2:
          this.sceneManager.changeToScene(LevelT_2, {});
          break;
        case GO_TO.SKIP_TUTORIAL:
          this.sceneManager.changeToScene(Tutorial1_3, {});
          break;
      }
    }
  }
}

export class Tutorial1_3 extends Scene {
  loadScene(): void {
    this.load.spritesheet("blue_mouse", "res/spritesheets/robots/robot_mouse_blue.json");
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVELT_3, GO_TO.SKIP_TUTORIAL]);
    this.addUILayer(TUTORIAL_LAYER);
    const c = this.viewport.getCenter().clone();
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 350),
      t3_1
    ).fontSize = 24;

    let blueRobotSprite1 = this.add.animatedSprite(
      "blue_mouse",
      TUTORIAL_LAYER
    );
    blueRobotSprite1.animation.play(RobotMouseAnimations.IDLE, true);
    blueRobotSprite1.position = new Vec2(c.x, c.y - 280);
    blueRobotSprite1.scale = new Vec2(0.6, 0.6);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 210),
      t3_2
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 170),
      t3_3
    ).fontSize = 24;

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 130),
      t3_4
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 90),
      t3_5
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 50),
      t3_6
    ).fontSize = 24;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 10),
      t3_7
    ).fontSize = 24;

    initButtonHandler(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x - 120, c.y + 275),
      "Skip",
      GO_TO.SKIP_TUTORIAL
    );
    initButtonHandler(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x + 120, c.y + 275),
      "Try",
      GO_TO.LEVELT_3
    );
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVELT_3:
          this.sceneManager.changeToScene(LevelT_3, {});
          break;
        case GO_TO.SKIP_TUTORIAL:
          this.sceneManager.changeToScene(Tutorial1_4);
          break;
      }
    }
  }
}

export class Tutorial1_4 extends Scene {
  loadScene(): void {
    this.load.spritesheet("blue_statue", "res/spritesheets/robots/robot_statue_blue.json");
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVELT_4, GO_TO.SKIP_TUTORIAL]);
    this.addUILayer(TUTORIAL_LAYER);
    const c = this.viewport.getCenter().clone();
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 350),
      t4_1
    ).fontSize = 22;

    let blueRobotSprite1 = this.add.animatedSprite(
      "blue_statue",
      TUTORIAL_LAYER
    );
    blueRobotSprite1.animation.play(RobotStatueAnimations.IDLE, true);
    blueRobotSprite1.position = new Vec2(c.x, c.y - 280);
    blueRobotSprite1.scale = new Vec2(0.4, 0.4);

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 210),
      t4_2
    ).fontSize = 22;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 170),
      t4_3
    ).fontSize = 22;

    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 130),
      t4_4
    ).fontSize = 22;
    initLabel(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x, c.y - 90),
      t4_5
    ).fontSize = 22;

    initButtonHandler(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x - 120, c.y + 275),
      "Main Menu",
      GO_TO.SKIP_TUTORIAL
    );
    initButtonHandler(
      this,
      TUTORIAL_LAYER,
      new Vec2(c.x + 120, c.y + 275),
      "Try",
      GO_TO.LEVELT_4
    );
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVELT_4:
          this.sceneManager.changeToScene(LevelT_4, {});
          break;
        case GO_TO.SKIP_TUTORIAL:
          this.emitter.fireEvent(GameEventType.STOP_SOUND, {
            key: "levelMusic",
          });
          this.sceneManager.changeToScene(MainMenu, {});
          break;
      }
    }
  }
}
