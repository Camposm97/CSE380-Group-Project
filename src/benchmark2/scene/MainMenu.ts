import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import { initButtonHandler, initLabel } from "../ui/UIBuilder";
import { RobotAnimations } from "./Constants";
import { Level1_1 } from "./Level1";
import { Level2_1 } from "./Level2";
import { Level3_1 } from "./Level3";
import { Level4_1 } from "./Level4";
import { Level5_1 } from "./Level5";
import { Level6_1 } from "./Level6";
import { Tutorial1_1 } from "./Tutorial";

enum MENU_EVENT {
  MENU = "menu",
  NEW_GAME = "new_game",
  LEVEL_SELECT = "level_select",
  CONTROLS = "controls",
  HELP = "about",
  LEADERBOARD = "leaderboard",
  LOAD_LVL_1 = "load_lvl_1",
  LOAD_LVL_2 = "load_lvl_2",
  LOAD_LVL_3 = "load_lvl_3",
  LOAD_LVL_4 = "load_lvl_4",
  LOAD_LVL_5 = "load_lvl_5",
  LOAD_LVL_6 = "load_lvl_6",
  HOW_TO_PLAY = "HOW_TO_PLAY",
}

export default class MainMenu extends Scene {
  private mainMenu: Layer;
  private levelSelect: Layer;
  private controls: Layer;
  private help: Layer;
  private leaderboard: Layer;

  loadScene(): void {
    this.load.spritesheet('r_blue', 'res/spritesheets/r_blue.json')
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
    this.receiver.subscribe(MENU_EVENT.MENU);
    this.receiver.subscribe(MENU_EVENT.NEW_GAME);
    this.receiver.subscribe(MENU_EVENT.HOW_TO_PLAY);
    this.receiver.subscribe(MENU_EVENT.LEVEL_SELECT);
    this.receiver.subscribe(MENU_EVENT.LOAD_LVL_1);
    this.receiver.subscribe(MENU_EVENT.LOAD_LVL_2);
    this.receiver.subscribe(MENU_EVENT.LOAD_LVL_3);
    this.receiver.subscribe(MENU_EVENT.LOAD_LVL_4);
    this.receiver.subscribe(MENU_EVENT.LOAD_LVL_5);
    this.receiver.subscribe(MENU_EVENT.LOAD_LVL_6);
    this.receiver.subscribe(MENU_EVENT.CONTROLS);
    this.receiver.subscribe(MENU_EVENT.HELP);
    this.receiver.subscribe(MENU_EVENT.LEADERBOARD);
  }

  initMainMenuScene(v: Vec2): void {
    this.mainMenu = this.addUILayer("mainMenu");
    let c = this.viewport.getCenter().clone()
    const layer = "mainMenu";
    initButtonHandler(this, layer, new Vec2(v.x, v.y - 225), "How to Play", MENU_EVENT.HOW_TO_PLAY);
    initButtonHandler(this, layer, new Vec2(v.x, v.y - 150), "New Game", MENU_EVENT.NEW_GAME);
    initButtonHandler(this, layer, new Vec2(v.x, v.y - 75), "Level Select", MENU_EVENT.LEVEL_SELECT);
    initButtonHandler(this, layer, new Vec2(v.x, v.y), "Controls", MENU_EVENT.CONTROLS);
    initButtonHandler(this, layer, new Vec2(v.x, v.y + 75), "Help", MENU_EVENT.HELP);
    initButtonHandler(this, layer, new Vec2(v.x, v.y + 150), "Leaderboard", MENU_EVENT.LEADERBOARD);

    let r1 = this.add.animatedSprite('r_blue', layer)
    r1.animation.play(RobotAnimations.IDLE, true)
    r1.position = new Vec2(c.x-300, c.y)
    let r2 = this.add.animatedSprite('r_blue', layer)
    r2.animation.play(RobotAnimations.IDLE, true)
    r2.position = new Vec2(c.x+300, c.y)
  }

  initLevelSelectScene(center: Vec2): void {
    // Level Select Boards Scene
    this.levelSelect = this.addUILayer("levelSelect");
    this.levelSelect.setHidden(true);

    // Level Select Header
    initLabel(
      this,
      "levelSelect",
      new Vec2(center.x, center.y - 300),
      "Level Select"
    );

    //  Level Select - Buttons
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(center.x - 200, center.y - 150),
      "Level 1",
      MENU_EVENT.LOAD_LVL_1
    );
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(center.x - 200, center.y - 50),
      "Level 2",
      MENU_EVENT.LOAD_LVL_2
    );
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(center.x - 200, center.y + 50),
      "Level 3",
      MENU_EVENT.LOAD_LVL_3
    );
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(center.x + 200, center.y - 150),
      "Level 4",
      MENU_EVENT.LOAD_LVL_4
    );
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(center.x + 200, center.y - 50),
      "Level 5",
      MENU_EVENT.LOAD_LVL_5
    );
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(center.x + 200, center.y + 50),
      "Level 6",
      MENU_EVENT.LOAD_LVL_6
    );
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(center.x, center.y + 250),
      "Back",
      MENU_EVENT.MENU
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
      "Shift/Right-Click to place flag"
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
      MENU_EVENT.MENU
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
      MENU_EVENT.MENU
    );
  }

  initLeaderboardScene(center: Vec2): void {
    // Leader Boards Scene
    this.leaderboard = this.addUILayer("leaderboard");
    this.leaderboard.setHidden(true);

    // Leader Boards Header
    initLabel(
      this,
      "leaderboard",
      new Vec2(center.x, center.y - 300),
      "Leaderboard"
    );
    initLabel(
      this,
      "leaderboard",
      new Vec2(center.x - 300, center.y - 200),
      "Name"
    );
    initLabel(
      this,
      "leaderboard",
      new Vec2(center.x + 300, center.y - 200),
      "High Score"
    );

    // Leader Boards - Back Button
    initButtonHandler(
      this,
      "leaderboard",
      new Vec2(center.x, center.y + 250),
      "Back",
      MENU_EVENT.MENU
    );
  }

  updateScene() {
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();
      switch (event.type) {
        case MENU_EVENT.MENU:
          this.mainMenu.setHidden(false);
          this.help.setHidden(true);
          this.controls.setHidden(true);
          this.leaderboard.setHidden(true);
          this.levelSelect.setHidden(true);
          break;
        case MENU_EVENT.HOW_TO_PLAY:
          this.sceneManager.changeToScene(Tutorial1_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MENU_EVENT.NEW_GAME:
          this.sceneManager.changeToScene(Level1_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MENU_EVENT.LEVEL_SELECT:
          this.mainMenu.setHidden(true);
          this.levelSelect.setHidden(false);
          break;
        case MENU_EVENT.LOAD_LVL_1:
          this.sceneManager.changeToScene(Level1_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MENU_EVENT.LOAD_LVL_2:
          this.sceneManager.changeToScene(Level2_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MENU_EVENT.LOAD_LVL_3:
          this.sceneManager.changeToScene(Level3_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MENU_EVENT.LOAD_LVL_4:
          this.sceneManager.changeToScene(Level4_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MENU_EVENT.LOAD_LVL_5:
          this.sceneManager.changeToScene(Level5_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MENU_EVENT.LOAD_LVL_6:
          this.sceneManager.changeToScene(Level6_1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MENU_EVENT.CONTROLS:
          this.mainMenu.setHidden(true);
          this.controls.setHidden(false);
          break;
        case MENU_EVENT.HELP:
          this.help.setHidden(false);
          this.mainMenu.setHidden(true);
          break;
        case MENU_EVENT.LEADERBOARD:
          this.leaderboard.setHidden(false);
          this.mainMenu.setHidden(true);
          break;
      }
    }
  }
}
