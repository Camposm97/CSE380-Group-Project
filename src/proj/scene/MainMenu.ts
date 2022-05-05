import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import { LEVEL_SAVE_DATA, MenuEvents } from "./Constants";
import {
  initButtonHandler,
  initLabel,
  initLevelSelectButton,
  initLock,
} from "../ui/UIBuilder";
import { RobotAnimations } from "./Constants";
import { Level1_1 } from "./Level1";
import { Level2_1 } from "./Level2";
import { Level3_1 } from "./Level3";
import { Level4_1 } from "./Level4";
import { Level5_1 } from "./Level5";
import { Level6_1 } from "./Level6";
import { Tutorial1_1 } from "./Tutorial";
import { Leaderboard } from "../game_system/Leaderboard";
import { LevelWriter } from "../game_system/LevelWriter";
import { LevelIntro1, LevelIntro2, LevelIntro3, LevelIntro4, LevelIntro5,LevelIntro6 } from "./LevelIntro";

export default class MainMenu extends Scene {
  private mainMenu: Layer;
  private levelSelect: Layer;
  private controls: Layer;
  private help: Layer;
  private leaderboard: Layer;

  loadScene(): void {
    this.load.spritesheet("r_blue", "res/spritesheets/robots/robot_blue.json");
    this.load.image("lock", "res/sprites/red_lock.png");
    this.load.image("Level 1", "res/tilemaps/level1/Level1_1.png");
    this.load.image("Level 2", "res/tilemaps/level2/Level2_1.png");
    this.load.image("Level 3", "res/tilemaps/level3/Level3_1.png");
    this.load.image("Level 4", "res/tilemaps/level4/Level4_1.png");
    this.load.image("Level 5", "res/tilemaps/level5/Level5_1.png");
    this.load.image("Level 6", "res/tilemaps/level6/Level6_1.png");
    this.load.audio("locked", "res/sound/bad_event.wav");
  }

  startScene(): void {
    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "levelMusic" });
    let center = this.viewport.getCenter().clone();
    this.initMainMenuScene(center);
    this.initLevelSelectScene(center);
    this.initControlScene(center);
    this.initHelpScene(center);
    this.initLeaderboardScene(center);

    // Subscribe to the button events
    this.receiver.subscribe(MenuEvents.MENU);
    this.receiver.subscribe(MenuEvents.NEW_GAME);
    this.receiver.subscribe(MenuEvents.HOW_TO_PLAY);
    this.receiver.subscribe(MenuEvents.LEVEL_SELECT);
    this.receiver.subscribe(MenuEvents.LOAD_LVL_1);
    this.receiver.subscribe(MenuEvents.LOAD_LVL_2);
    this.receiver.subscribe(MenuEvents.LOAD_LVL_3);
    this.receiver.subscribe(MenuEvents.LOAD_LVL_4);
    this.receiver.subscribe(MenuEvents.LOAD_LVL_5);
    this.receiver.subscribe(MenuEvents.LOAD_LVL_6);
    this.receiver.subscribe(MenuEvents.CONTROLS);
    this.receiver.subscribe(MenuEvents.HELP);
    this.receiver.subscribe(MenuEvents.LEADERBOARD);
  }

  initMainMenuScene(v: Vec2): void {
    this.mainMenu = this.addUILayer("mainMenu");
    let c = this.viewport.getCenter().clone();
    const layer = "mainMenu";
    initButtonHandler(
      this,
      layer,
      new Vec2(v.x, v.y - 225),
      "How to Play",
      MenuEvents.HOW_TO_PLAY
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(v.x, v.y - 150),
      "New Game",
      MenuEvents.NEW_GAME
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(v.x, v.y - 75),
      "Level Select",
      MenuEvents.LEVEL_SELECT
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(v.x, v.y),
      "Controls",
      MenuEvents.CONTROLS
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(v.x, v.y + 75),
      "Help",
      MenuEvents.HELP
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(v.x, v.y + 150),
      "Leaderboard",
      MenuEvents.LEADERBOARD
    );

    let r1 = this.add.animatedSprite("r_blue", layer);
    r1.animation.play(RobotAnimations.DANCE, true);
    r1.position = new Vec2(c.x - 300, c.y);
    let r2 = this.add.animatedSprite("r_blue", layer);
    r2.animation.play(RobotAnimations.DANCE, true);
    r2.position = new Vec2(c.x + 300, c.y);
  }

  initLevelSelectScene(center: Vec2): void {
    // Level Select Boards Scene
    const LAYER = "levelSelect";
    this.levelSelect = this.addUILayer(LAYER);
    this.levelSelect.setHidden(true);

    // Level Select Header
    initLabel(
      this,
      "levelSelect",
      new Vec2(center.x, center.y - 300),
      "Level Select"
    );

    //  Level Select - Buttons
    initLevelSelectButton(
      this,
      LAYER,
      new Vec2(center.x - 200, center.y - 150),
      "Level 1",
      MenuEvents.LOAD_LVL_1
    );
    let bt2 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(center.x, center.y - 150),
      "Level 2",
      MenuEvents.LOAD_LVL_2
    );
    let bt3 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(center.x + 200, center.y - 150),
      "Level 3",
      MenuEvents.LOAD_LVL_3
    );
    let bt4 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(center.x - 200, center.y + 100),
      "Level 4",
      MenuEvents.LOAD_LVL_4
    );
    let bt5 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(center.x, center.y + 100),
      "Level 5",
      MenuEvents.LOAD_LVL_5
    );
    let bt6 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(center.x + 200, center.y + 100),
      "Level 6",
      MenuEvents.LOAD_LVL_6
    );

    let lw = new LevelWriter();
    if (lw.isLevel2Locked()) initLock(this, LAYER, bt2);
    if (lw.isLevel3Locked()) initLock(this, LAYER, bt3);
    if (lw.isLevel4Locked()) initLock(this, LAYER, bt4);
    if (lw.isLevel5Locked()) initLock(this, LAYER, bt5);
    if (lw.isLevel6Locked()) initLock(this, LAYER, bt6);

    // let str = localStorage.getItem(LEVEL_SAVE_DATA)
    // Check if str is undefined.
    // if (str) { // Determine which levels to unlock and lock
    //   let saveData = JSON.parse(str)
    //   if (saveData.lock2) {
    //     initLock(this, LAYER, bt2)
    //   }
    //   if (saveData.lock3) {
    //     initLock(this, LAYER, bt3)
    //   }
    //   if (saveData.lock4) {
    //     initLock(this, LAYER, bt4)
    //   }
    //   if (saveData.lock5) {
    //     initLock(this, LAYER, bt5)
    //   }
    //   if (saveData.lock6) {
    //     initLock(this, LAYER, bt6)
    //   }
    // } else { // lock all levels
    //   initLock(this, LAYER, bt2)
    //   initLock(this, LAYER, bt3)
    //   initLock(this, LAYER, bt4)
    //   initLock(this, LAYER, bt5)
    //   initLock(this, LAYER, bt6)
    // }

    // Create back button
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(center.x, center.y + 250),
      "Back",
      MenuEvents.MENU
    );
  }

  initControlScene(center: Vec2): void {
    this.controls = this.addUILayer("controls");
    this.controls.setHidden(true);
    initLabel(this, "controls", new Vec2(center.x, center.y - 300), "Controls");
    initLabel(
      this,
      "controls",
      new Vec2(center.x, center.y - 200),
      "ESC - pause the game"
    );
    initLabel(
      this,
      "controls",
      new Vec2(center.x, center.y - 150),
      "P - panic button, resets the room to its original state"
    );
    initLabel(
      this,
      "controls",
      new Vec2(center.x, center.y - 100),
      "F - to place flag"
    );
    initLabel(
      this,
      "controls",
      new Vec2(center.x, center.y - 50),
      "W/Up-Arrow to move up"
    );
    initLabel(
      this,
      "controls",
      new Vec2(center.x, center.y),
      "A/Left-Arrow to move left"
    );
    initLabel(
      this,
      "controls",
      new Vec2(center.x, center.y + 50),
      "S/Down-Arrow to move down"
    );
    initLabel(
      this,
      "controls",
      new Vec2(center.x, center.y + 100),
      "D/Right-Arrow to move right"
    );
    initLabel(
      this,
      "controls",
      new Vec2(center.x, center.y + 150),
      "Space/Left-Click to attack"
    );
    initButtonHandler(
      this,
      "controls",
      new Vec2(center.x, center.y + 250),
      "Back",
      MenuEvents.MENU
    );
    // Scene has started, so start playing music
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
      key: "menu",
      loop: true,
      holdReference: true,
    });
  }

  initHelpScene(center: Vec2) {
    // Controls Scene
    this.help = this.addUILayer("help");
    this.help.setHidden(true);
    initLabel(this, "help", new Vec2(center.x, center.y - 350), "Help");

    const strAbout1 = "Developed by Andrew Ojeda, Michael Campos, and Tuyen Vo";
    const strAbout2 =
      "Professor McBendorjee was busy trying to recreate the Wolfie 2D engine";
    const strAbout3 =
      "from scratch using nothing but C and MIPs for his CSE 420 class,";
    const strAbout4 =
      "when he accidentally forgot to give a character array a null pointer reference.";
    const strAbout5 =
      "This led to a catastrophic chain of events that culminated in Professor McBendorjee";
    const strAbout6 =
      "getting his own conscience written into the main character sprite.";
    const strAbout7 =
      "Now he will have to brave the Al robots he was creating to escape Wolfie 2D or be forever stuck.";
    const strAbout8 =
      "Cheat Codes: invincible, skip, showAllBombs, unlock-all-levels, 1, 2, 3, 4, 5, 6";

    const lblAbout1 = initLabel(
      this,
      "help",
      new Vec2(center.x, center.y - 250),
      strAbout1
    );
    const lblAbout2 = initLabel(
      this,
      "help",
      new Vec2(center.x, center.y - 150),
      strAbout2
    );
    const lblAbout3 = initLabel(
      this,
      "help",
      new Vec2(center.x, center.y - 100),
      strAbout3
    );
    const lblAbout4 = initLabel(
      this,
      "help",
      new Vec2(center.x, center.y - 50),
      strAbout4
    );
    const lblAbout5 = initLabel(
      this,
      "help",
      new Vec2(center.x, center.y - 5),
      strAbout5
    );
    const lblAbout6 = initLabel(
      this,
      "help",
      new Vec2(center.x, center.y + 50),
      strAbout6
    );
    const lblAbout7 = initLabel(
      this,
      "help",
      new Vec2(center.x, center.y + 100),
      strAbout7
    );
    const lblAbout8 = initLabel(
      this,
      "help",
      new Vec2(center.x, center.y + 150),
      strAbout8
    );

    const FONT_SIZE = 24;
    lblAbout1.fontSize = FONT_SIZE;
    lblAbout2.fontSize = FONT_SIZE;
    lblAbout3.fontSize = FONT_SIZE;
    lblAbout4.fontSize = FONT_SIZE;
    lblAbout5.fontSize = FONT_SIZE;
    lblAbout6.fontSize = FONT_SIZE;
    lblAbout7.fontSize = FONT_SIZE;
    lblAbout8.fontSize = FONT_SIZE;

    // About - Back Button
    initButtonHandler(
      this,
      "help",
      new Vec2(center.x, center.y + 250),
      "Back",
      MenuEvents.MENU
    );
  }

  initLeaderboardScene(center: Vec2): void {
    // Leader Boards Scene
    const LAYER = "leaderboard";
    this.leaderboard = this.addUILayer(LAYER);
    this.leaderboard.setHidden(true);

    // Leader Boards Header
    initLabel(this, LAYER, new Vec2(center.x, center.y - 300), "Leaderboard");
    initLabel(this, LAYER, new Vec2(center.x - 300, center.y - 200), "Name");
    initLabel(
      this,
      LAYER,
      new Vec2(center.x + 300, center.y - 200),
      "High Score"
    );

    let lb = new Leaderboard();
    lb.display(this, LAYER, center);

    // Leader Boards - Back Button
    initButtonHandler(
      this,
      LAYER,
      new Vec2(center.x, center.y + 250),
      "Back",
      MenuEvents.MENU
    );
  }

  updateScene() {
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();
      switch (event.type) {
        case MenuEvents.MENU:
          this.mainMenu.setHidden(false);
          this.help.setHidden(true);
          this.controls.setHidden(true);
          this.leaderboard.setHidden(true);
          this.levelSelect.setHidden(true);
          break;
        case MenuEvents.HOW_TO_PLAY:
          this.sceneManager.changeToScene(Tutorial1_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.NEW_GAME:
          this.sceneManager.changeToScene(LevelIntro1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LEVEL_SELECT:
          this.mainMenu.setHidden(true);
          this.levelSelect.setHidden(false);
          break;
        case MenuEvents.LEVEL_LOCKED:
          console.log("hello world!!!!");
          break;
        case MenuEvents.LOAD_LVL_1:
          this.sceneManager.changeToScene(Level1_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_2:
          this.sceneManager.changeToScene(Level2_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_3:
          this.sceneManager.changeToScene(Level3_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_4:
          this.sceneManager.changeToScene(Level4_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_5:
          this.sceneManager.changeToScene(Level5_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_6:
          this.sceneManager.changeToScene(Level6_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.CONTROLS:
          this.mainMenu.setHidden(true);
          this.controls.setHidden(false);
          break;
        case MenuEvents.HELP:
          this.help.setHidden(false);
          this.mainMenu.setHidden(true);
          break;
        case MenuEvents.LEADERBOARD:
          this.leaderboard.setHidden(false);
          this.mainMenu.setHidden(true);
          break;
      }
    }
  }
}
