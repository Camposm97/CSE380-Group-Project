import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import { MenuEvents } from "./Constants";
import {
  initButtonHandler,
  initLabel,
  initLevelSelectButton,
  initLock,
} from "../ui/UIBuilder";
import { RobotAnimations } from "./Constants";
import { Tutorial1_1 } from "./Tutorial";
import { Leaderboard } from "../game_system/Leaderboard";
import { LU } from "../game_system/LevelUnlocker";
import {
  LevelIntro1,
  LevelIntro2,
  LevelIntro3,
  LevelIntro4,
  LevelIntro5,
  LevelIntro6,
} from "./LevelIntro";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Slider from "../../Wolfie2D/Nodes/UIElements/Slider";
import Color from "../../Wolfie2D/Utils/Color";
import AudioManager, { AudioChannelType } from "../../Wolfie2D/Sound/AudioManager";
import SoundSystem from "../game_system/SoundSystem";

export default class MainMenu extends Scene {
  private background: Layer;
  private mainMenu: Layer;
  private levelSelect: Layer;
  private controls: Layer;
  private settings: Layer
  private help: Layer;
  private leaderboard: Layer;

  loadScene(): void {
    this.load.spritesheet("r_blue", "res/spritesheets/robots/robot_blue.json");
    this.load.spritesheet("r_yellow", "res/spritesheets/robots/robot_yellow.json");
    this.load.spritesheet("r_red", "res/spritesheets/robots/robot_red.json");
    this.load.image("lock", "res/sprites/red_lock.png");
    this.load.image("Level 1_1", "res/tilemaps/level1/Level1_1_alt.png");
    // this.load.image("Level 1_2", "res/tilemaps/level1/Level1_2_alt.png");
    // this.load.image("Level 1_3", "res/tilemaps/level1/Level1_3_alt.png");
    // this.load.image("Level 1_4", "res/tilemaps/level1/Level1_4_alt.png");
    this.load.image("Level 2_1", "res/tilemaps/level2/Level2_1_alt.png");
    // this.load.image("Level 2_2", "res/tilemaps/level2/Level2_2_alt.png");
    // this.load.image("Level 2_3", "res/tilemaps/level2/Level2_3_alt.png");
    // this.load.image("Level 2_4", "res/tilemaps/level2/Level2_4_alt.png");
    this.load.image("Level 3_1", "res/tilemaps/level3/Level3_1.png");
    // this.load.image("Level 3_2", "res/tilemaps/level3/Level3_2.png");
    // this.load.image("Level 3_3", "res/tilemaps/level3/Level3_3.png");
    // this.load.image("Level 3_4", "res/tilemaps/level3/Level3_4.png");
    this.load.image("Level 4_1", "res/tilemaps/level4/Level4_1.png");
    // this.load.image("Level 4_2", "res/tilemaps/level4/Level4_2.png");
    // this.load.image("Level 4_3", "res/tilemaps/level4/Level4_3.png");
    // this.load.image("Level 4_4", "res/tilemaps/level4/Level4_4.png");
    this.load.image("Level 5_1", "res/tilemaps/level5/Level5_1.png");
    // this.load.image("Level 5_2", "res/tilemaps/level5/Level5_2.png");
    // this.load.image("Level 5_3", "res/tilemaps/level5/Level5_3.png");
    // this.load.image("Level 5_4", "res/tilemaps/level5/Level5_4.png");
    this.load.image("Level 6_1", "res/tilemaps/level6/Level6_1.png");
    // this.load.image("Level 6_2", "res/tilemaps/level6/Level6_2.png");
    // this.load.image("Level 6_3", "res/tilemaps/level6/Level6_3.png");
    // this.load.image("Level 6_4", "res/tilemaps/level6/Level6_4.png");
    this.load.image("dark_background", "res/sprites/dark_background.png");
    this.load.audio("locked", "res/sound/bad_event.wav");
  }

  startScene(): void {
    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "levelMusic" });
    this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: 'endingMusic' })
    let center = this.viewport.getCenter().clone();
    this.initBackground(center);
    this.initMainMenuScene(center);
    this.initLevelSelectScene(center);
    this.initControlScene(center);
    this.initSettings(center)
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
    this.receiver.subscribe(MenuEvents.SETTINGS)
    this.receiver.subscribe(MenuEvents.HELP);
    this.receiver.subscribe(MenuEvents.LEADERBOARD);
  }

  initBackground(c: Vec2): void {
    const LAYER = "background";
    this.background = this.addUILayer(LAYER);
    const NUM_OF_ROOMS = 23;
    let x = Math.round(Math.random() * NUM_OF_ROOMS);
    x = Math.round(Math.random() * 5)
    console.log(`x=${x}`);
    let img, scaleX, scaleY;
    switch (x) {
      case 0:
        img = this.add.sprite("Level 1_1", LAYER);
        img.position = c;
        scaleX = img.size.x / this.viewport.getView().x + 0.05;
        scaleY = img.size.y / this.viewport.getView().y - 0.05;
        img.scale = new Vec2(scaleX, scaleY);
        break;
      case 1:
        img = this.add.sprite("Level 2_1", LAYER);
        img.position = c;
        scaleX = img.size.x / this.viewport.getView().x + 0.05;
        scaleY = img.size.y / this.viewport.getView().y - 0.05;
        img.scale = new Vec2(scaleX, scaleY);
        break;
      case 2:
        img = this.add.sprite("Level 3_1", LAYER);
        img.position = c;
        scaleX = img.size.x / this.viewport.getView().x - 0.15;
        scaleY = img.size.y / this.viewport.getView().y - 1.35;
        img.scale = new Vec2(scaleX, scaleY);
        break;
      case 3:
        img = this.add.sprite("Level 4_1", LAYER);
        img.position = c;
        scaleX = img.size.x / this.viewport.getView().x - 0.15;
        scaleY = img.size.y / this.viewport.getView().y - 1.35;
        img.scale = new Vec2(scaleX, scaleY);
        break;
      case 4:
        img = this.add.sprite("Level 5_1", LAYER);
        img.position = c;
        scaleX = img.size.x / this.viewport.getView().x - 0.15;
        scaleY = img.size.y / this.viewport.getView().y - 0.05;
        img.scale = new Vec2(scaleX, scaleY);
        break;
      case 5:
        img = this.add.sprite("Level 6_1", LAYER);
        img.position = c;
        scaleX = img.size.x / this.viewport.getView().x - 0.15;
        scaleY = img.size.y / this.viewport.getView().y - 0.05;
        img.scale = new Vec2(scaleX, scaleY);
        break;
    }
    // switch (x) {
    //   // Level 1
    //   case 0:
    //     img = this.add.sprite("Level 1_1", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x + 0.05;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 1:
    //     img = this.add.sprite("Level 1_2", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x + 0.05;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 2:
    //     img = this.add.sprite("Level 1_3", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x + 0.05;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 3:
    //     img = this.add.sprite("Level 1_4", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x + 0.05;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   // Level 2
    //   case 4:
    //     img = this.add.sprite("Level 2_1", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x + 0.05;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 5:
    //     img = this.add.sprite("Level 2_2", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x + 0.05;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 6:
    //     img = this.add.sprite("Level 2_3", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x + 0.05;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 7:
    //     img = this.add.sprite("Level 2_4", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x + 0.05;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   // Lvel 3
    //   case 8:
    //     img = this.add.sprite("Level 3_1", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 1.35;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 9:
    //     img = this.add.sprite("Level 3_2", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 1.35;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 10:
    //     img = this.add.sprite("Level 3_3", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 1.35;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 11:
    //     img = this.add.sprite("Level 3_4", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 1.35;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   // Level 4
    //   case 12:
    //     img = this.add.sprite("Level 4_1", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 1.35;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 13:
    //     img = this.add.sprite("Level 4_2", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 1.35;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 14:
    //     img = this.add.sprite("Level 4_3", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 1.35;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 15:
    //     img = this.add.sprite("Level 4_4", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 1.35;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   // Level 5
    //   case 16:
    //     img = this.add.sprite("Level 5_1", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 17:
    //     img = this.add.sprite("Level 5_2", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 18:
    //     img = this.add.sprite("Level 5_3", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 19:
    //     img = this.add.sprite("Level 5_4", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   // Level 6
    //   case 20:
    //     img = this.add.sprite("Level 6_1", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 21:
    //     img = this.add.sprite("Level 6_2", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 22:
    //     img = this.add.sprite("Level 6_3", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    //   case 23:
    //     img = this.add.sprite("Level 6_4", LAYER);
    //     img.position = c;
    //     scaleX = img.size.x / this.viewport.getView().x - 0.15;
    //     scaleY = img.size.y / this.viewport.getView().y - 0.05;
    //     img.scale = new Vec2(scaleX, scaleY);
    //     break;
    // }
  }

  initMainMenuScene(c: Vec2): void {
    this.mainMenu = this.addUILayer("mainMenu");
    const layer = "mainMenu";
    initButtonHandler(
      this,
      layer,
      new Vec2(c.x, c.y - 225),
      "How to Play",
      MenuEvents.HOW_TO_PLAY
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(c.x, c.y - 150),
      "New Game",
      MenuEvents.NEW_GAME
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(c.x, c.y - 75),
      "Level Select",
      MenuEvents.LEVEL_SELECT
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(c.x, c.y),
      "Controls",
      MenuEvents.CONTROLS
    );
    initButtonHandler(this, layer, new Vec2(c.x, c.y+75), 'Settings', MenuEvents.SETTINGS)
    initButtonHandler(
      this,
      layer,
      new Vec2(c.x, c.y+150),
      "Help",
      MenuEvents.HELP
    );
    initButtonHandler(
      this,
      layer,
      new Vec2(c.x, c.y+225),
      "Leaderboard",
      MenuEvents.LEADERBOARD
    );

    let r1, r2;
    let r = Math.round(Math.random() * 2);
    switch (r) {
      case 0:
        r1 = this.add.animatedSprite("r_blue", layer);
        r1.animation.play(RobotAnimations.DANCE, true);
        r1.position = new Vec2(c.x - 300, c.y);
        r2 = this.add.animatedSprite("r_blue", layer);
        r2.animation.play(RobotAnimations.DANCE, true);
        r2.position = new Vec2(c.x + 300, c.y);
        break;
      case 1:
        r1 = this.add.animatedSprite("r_yellow", layer);
        r1.animation.play(RobotAnimations.DANCE, true);
        r1.position = new Vec2(c.x - 300, c.y);
        r2 = this.add.animatedSprite("r_yellow", layer);
        r2.animation.play(RobotAnimations.DANCE, true);
        r2.position = new Vec2(c.x + 300, c.y);
        break;
      case 2:
        r1 = this.add.animatedSprite("r_red", layer);
        r1.animation.play(RobotAnimations.DANCE, true);
        r1.position = new Vec2(c.x - 300, c.y);
        r2 = this.add.animatedSprite("r_red", layer);
        r2.animation.play(RobotAnimations.DANCE, true);
        r2.position = new Vec2(c.x + 300, c.y);
        break;
    }
  }

  initLevelSelectScene(c: Vec2): void {
    // Level Select Boards Scene
    const LAYER = "levelSelect";
    this.levelSelect = this.addUILayer(LAYER);
    this.levelSelect.setHidden(true);

    let bg = this.add.sprite("dark_background", LAYER);
    bg.position = c;
    let scaleX = bg.size.x / this.viewport.getView().x - 0.15;
    let scaleY = bg.size.y / this.viewport.getView().y - 0.05;
    bg.scale = new Vec2(scaleX, scaleY);

    // Level Select Header
    initLabel(this, "levelSelect", new Vec2(c.x, c.y - 300), "Level Select");

    //  Level Select - Buttons
    initLevelSelectButton(
      this,
      LAYER,
      new Vec2(c.x - 200, c.y - 150),
      "Level 1_1",
      MenuEvents.LOAD_LVL_1
    );
    let bt2 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(c.x, c.y - 150),
      "Level 2_1",
      MenuEvents.LOAD_LVL_2
    );
    let bt3 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(c.x + 200, c.y - 150),
      "Level 3_1",
      MenuEvents.LOAD_LVL_3
    );
    let bt4 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(c.x - 200, c.y + 100),
      "Level 4_1",
      MenuEvents.LOAD_LVL_4
    );
    let bt5 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(c.x, c.y + 100),
      "Level 5_1",
      MenuEvents.LOAD_LVL_5
    );
    let bt6 = initLevelSelectButton(
      this,
      LAYER,
      new Vec2(c.x + 200, c.y + 100),
      "Level 6_1",
      MenuEvents.LOAD_LVL_6
    );

    if (LU.isLevel2Locked()) initLock(this, LAYER, bt2);
    if (LU.isLevel3Locked()) initLock(this, LAYER, bt3);
    if (LU.isLevel4Locked()) initLock(this, LAYER, bt4);
    if (LU.isLevel5Locked()) initLock(this, LAYER, bt5);
    if (LU.isLevel6Locked()) initLock(this, LAYER, bt6);

    // Create back button
    initButtonHandler(
      this,
      "levelSelect",
      new Vec2(c.x, c.y + 250),
      "Back",
      MenuEvents.MENU
    );
  }

  initControlScene(c: Vec2): void {
    this.controls = this.addUILayer("controls");
    this.controls.setHidden(true);

    let bg = this.add.sprite("dark_background", "controls");
    bg.position = c;
    let scaleX = bg.size.x / this.viewport.getView().x - 0.15;
    let scaleY = bg.size.y / this.viewport.getView().y - 0.05;
    bg.scale = new Vec2(scaleX, scaleY);

    initLabel(this, "controls", new Vec2(c.x, c.y - 300), "Controls");
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y - 200),
      "ESC - pause the game"
    ).fontSize = 28;
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y - 160),
      "P - panic button, resets the room to its original state"
    ).fontSize = 28;
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y - 120),
      "F - to place flag"
    ).fontSize = 28;
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y - 80),
      "W/Up-Arrow to move up"
    ).fontSize = 28;
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y - 40),
      "A/Left-Arrow to move left"
    ).fontSize = 28;
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y),
      "S/Down-Arrow to move down"
    ).fontSize = 28;
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y + 40),
      "D/Right-Arrow to move right"
    ).fontSize = 28;
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y + 80),
      "Space/Left-Click to attack"
    ).fontSize = 28;
    initLabel(
      this,
      "controls",
      new Vec2(c.x, c.y + 120),
      "M - push/pull"
    ).fontSize = 28;
    initButtonHandler(
      this,
      "controls",
      new Vec2(c.x, c.y + 250),
      "Back",
      MenuEvents.MENU
    );

    // Scene has started, so start playing music
    this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {
      key: "menu",
      loop: true,
      holdReference: true,
    });
  }

  initSettings(c: Vec2): void {
    const LAYER = 'settings'
    this.settings = this.addUILayer(LAYER)
    this.settings.setHidden(true)

    let bg = this.add.sprite("dark_background", LAYER);
    bg.position = c;
    let scaleX = bg.size.x / this.viewport.getView().x - 0.15;
    let scaleY = bg.size.y / this.viewport.getView().y - 0.05;
    bg.scale = new Vec2(scaleX, scaleY);

    initLabel(this, LAYER, new Vec2(c.x, c.y - 300), "Settings");

    let ss = SoundSystem.get()
    let sfxSlider: Slider = <Slider> this.add.uiElement(UIElementType.SLIDER, LAYER, 
      {
        value: ss.getSFXVolume(),
        position: new Vec2(c.x,c.y-150)
      })
    sfxSlider.onValueChange = () => ss.setSFXVolume(sfxSlider.getValue())
    sfxSlider.size = new Vec2(750, 50)
    sfxSlider.nibSize = new Vec2(20,20)
    sfxSlider.sliderColor = Color.WHITE
    initLabel(this, LAYER, new Vec2(c.x - (sfxSlider.size.x / 2) - 75, sfxSlider.position.y), 'SFX')

    let musicSlider: Slider = <Slider> this.add.uiElement(UIElementType.SLIDER, LAYER, 
      {
        value: ss.getMusicVolume(),
        position: new Vec2(c.x,c.y-50)
      })
    musicSlider.onValueChange = () => ss.setMusicVolume(musicSlider.getValue())
    musicSlider.size = new Vec2(750, 50)
    musicSlider.nibSize = new Vec2(20,20)
    musicSlider.sliderColor = Color.WHITE
    initLabel(this, LAYER, new Vec2(c.x - (musicSlider.size.x / 2) - 75, musicSlider.position.y), 'Music')

    initButtonHandler(
      this,
      LAYER,
      new Vec2(c.x, c.y + 250),
      "Back",
      MenuEvents.MENU
    );
  }

  initHelpScene(c: Vec2) {
    // Controls Scene
    this.help = this.addUILayer("help");
    this.help.setHidden(true);

    let bg = this.add.sprite("dark_background", "help");
    bg.position = c;
    let scaleX = bg.size.x / this.viewport.getView().x - 0.15;
    let scaleY = bg.size.y / this.viewport.getView().y - 0.05;
    bg.scale = new Vec2(scaleX, scaleY);

    initLabel(this, "help", new Vec2(c.x, c.y - 300), "Help");

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
      "Cheat Codes: invincible, skip, showBombs, unlockAll, end";

    const lblAbout1 = initLabel(
      this,
      "help",
      new Vec2(c.x, c.y - 250),
      strAbout1
    );
    const lblAbout2 = initLabel(
      this,
      "help",
      new Vec2(c.x, c.y - 150),
      strAbout2
    );
    const lblAbout3 = initLabel(
      this,
      "help",
      new Vec2(c.x, c.y - 100),
      strAbout3
    );
    const lblAbout4 = initLabel(
      this,
      "help",
      new Vec2(c.x, c.y - 50),
      strAbout4
    );
    const lblAbout5 = initLabel(
      this,
      "help",
      new Vec2(c.x, c.y - 5),
      strAbout5
    );
    const lblAbout6 = initLabel(
      this,
      "help",
      new Vec2(c.x, c.y + 50),
      strAbout6
    );
    const lblAbout7 = initLabel(
      this,
      "help",
      new Vec2(c.x, c.y + 100),
      strAbout7
    );
    const lblAbout8 = initLabel(
      this,
      "help",
      new Vec2(c.x, c.y + 150),
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
      new Vec2(c.x, c.y + 250),
      "Back",
      MenuEvents.MENU
    );
  }

  initLeaderboardScene(c: Vec2): void {
    // Leader Boards Scene
    const LAYER = "leaderboard";
    this.leaderboard = this.addUILayer(LAYER);
    this.leaderboard.setHidden(true);

    let bg = this.add.sprite("dark_background", LAYER);
    bg.position = c;
    let scaleX = bg.size.x / this.viewport.getView().x - 0.15;
    let scaleY = bg.size.y / this.viewport.getView().y - 0.05;
    bg.scale = new Vec2(scaleX, scaleY);

    // Leader Boards Header
    initLabel(this, LAYER, new Vec2(c.x, c.y - 300), "Leaderboard");
    initLabel(this, LAYER, new Vec2(c.x - 300, c.y - 200), "Name");
    initLabel(this, LAYER, new Vec2(c.x + 300, c.y - 200), "High Score");

    let lb = new Leaderboard();
    lb.display(this, LAYER, c);

    // Leader Boards - Back Button
    initButtonHandler(
      this,
      LAYER,
      new Vec2(c.x, c.y + 250),
      "Back",
      MenuEvents.MENU
    );
  }

  updateScene() {
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();
      switch (event.type) {
        case MenuEvents.MENU:
          this.background.setHidden(false);
          this.mainMenu.setHidden(false);
          this.help.setHidden(true);
          this.controls.setHidden(true);
          this.leaderboard.setHidden(true);
          this.levelSelect.setHidden(true);
          this.settings.setHidden(true)
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
          this.background.setHidden(true);
          this.mainMenu.setHidden(true);
          this.levelSelect.setHidden(false);
          this.settings.setHidden(true)
          break;
        case MenuEvents.LOAD_LVL_1:
          this.sceneManager.changeToScene(LevelIntro1, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_2:
          this.sceneManager.changeToScene(LevelIntro2, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_3:
          this.sceneManager.changeToScene(LevelIntro3, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_4:
          this.sceneManager.changeToScene(LevelIntro4, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_5:
          this.sceneManager.changeToScene(LevelIntro5, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.LOAD_LVL_6:
          this.sceneManager.changeToScene(LevelIntro6, {});
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
          break;
        case MenuEvents.CONTROLS:
          this.background.setHidden(true);
          this.mainMenu.setHidden(true);
          this.controls.setHidden(false);
          this.settings.setHidden(true)
          break;
        case MenuEvents.SETTINGS:
          this.settings.setHidden(false)
          this.background.setHidden(true)
          this.leaderboard.setHidden(true)
          this.mainMenu.setHidden(true)
          this.controls.setHidden(true)
          break;
        case MenuEvents.HELP:
          this.background.setHidden(true);
          this.help.setHidden(false);
          this.mainMenu.setHidden(true);
          this.settings.setHidden(true)
          break;
        case MenuEvents.LEADERBOARD:
          this.background.setHidden(true);
          this.leaderboard.setHidden(false);
          this.mainMenu.setHidden(true);
          this.settings.setHidden(true)
          break;
      }
    }
  }
}
