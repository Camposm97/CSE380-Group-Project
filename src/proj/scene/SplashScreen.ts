import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import { initButton } from "../ui/UIBuilder";
import { PlayerAnimations, RobotMouseAnimations } from "./Constants";
import MainMenu from "./MainMenu";

export default class SplashScreen extends Scene {
  loadScene(): void {
    this.load.image("logo", "res/sprites/Logo.png");
    this.load.spritesheet("rm_blue", "res/spritesheets/robots/robot_mouse_blue.json");
    this.load.spritesheet("prof", "res/spritesheets/mcbendorjee.json");
    this.load.audio("select", "res/sound/select.wav");
    this.load.tilemap("background", "res/tilemaps/tutorial/SplashScreenBackground.json");
    this.load.audio("menu", "res/music/CSE_380_Splash_Screen.mp3");
  }

  startScene(): void {
    // First, create a layer for it to go on
    this.addLayer("primary");

    // Center the viewport
    let c = this.viewport.getCenter().clone();

    let x = this.add.tilemap("background", new Vec2(1.34, 1.39));

    let sprite = this.add.sprite("logo", "primary");
    sprite.positionX = 610;
    sprite.positionY = 200;

    sprite.scale = new Vec2(0.75, 0.75);

    let profSprite = this.add.animatedSprite("prof", "primary");
    profSprite.scale = new Vec2(5.0, 5.0);
    profSprite.position = new Vec2(c.x / 2, c.y + 50);
    profSprite.animation.play(PlayerAnimations.IDLE_WHITE);

    sprite.scale = new Vec2(0.75, 0.75);

    let rm1 = this.add.animatedSprite("rm_blue", "primary");
    let rm2 = this.add.animatedSprite("rm_blue", "primary");
    let rm3 = this.add.animatedSprite("rm_blue", "primary");

    rm1.position = new Vec2(c.x + 300, c.y);
    rm2.position = new Vec2(c.x + 350, c.y + 50);
    rm3.position = new Vec2(c.x + 275, c.y + 75);

    rm1.animation.play(RobotMouseAnimations.IDLE)
    new Timer(250, () => {
      rm2.animation.play(RobotMouseAnimations.IDLE)
      new Timer(250, () => {
        rm3.animation.play(RobotMouseAnimations.IDLE)
      }, false).start()
    }, false).start() 

    let size = this.viewport.getHalfSize();
    this.viewport.setFocus(size);

    this.viewport.setZoomLevel(1);

    // Create a play button
    let startBtn = initButton(
      this,
      "primary",
      new Vec2(size.x, size.y),
      "Click to Start"
    );
    startBtn.size = new Vec2(250, 50);

    let flag = false;

    // When the play button is clicked, go to the next scene
    startBtn.onClick = () => {
      this.sceneManager.changeToScene(MainMenu, {}, this.sceneOptions);
      // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: 'select', loop: false})
    };
    startBtn.onEnter = () => {
      startBtn.fontSize = 32;
      startBtn.size = new Vec2(255, 55);
      if (!flag) {
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
          key: "select",
          loop: false,
        });
      }
      flag = true;
    };
    startBtn.onLeave = () => {
      startBtn.fontSize = 30;
      startBtn.size = new Vec2(250, 50);
      flag = false;
    };
  }

  unloadScene(): void {
    // The scene is being destroyed, so we can stop playing the song
    // this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "menu" });
    this.load.keepAudio("select");
    this.load.keepAudio("select_hover");
    this.load.keepAudio("menu");
  }
}
