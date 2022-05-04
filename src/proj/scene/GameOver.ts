import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import MainMenu from "./MainMenu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import { initButton, initLabel } from "../ui/UIBuilder";
import { Level2_1 } from "./Level2";
import { getCookie, setCookie } from "../game_system/Cookies";
import { SAVE_DATA } from "./Constants";

export default class GameOver extends Scene {
  private currentScore: number;
  private win: boolean;
  private timeLeft: number;
  private isTutorial: boolean;
  private nextLvl: new (...args: any) => GameLevel;
  private lastLevel: boolean; //is this the last room of the level

  initScene(options: Record<string, any>): void {
    this.currentScore = options.currentScore ? options.currentScore : 0;
    this.win = options.win;
    this.timeLeft = options.timeLeft ? options.timeLeft : 0;
    this.nextLvl = options.nextLvl;
    this.isTutorial = options.isTutorial;
    if (options.lastLevel !== undefined) this.lastLevel = options.lastLevel;
  }

  loadScene(): void {
    this.load.audio("lose", "res/sound/lose.wav");
  }

  startScene() {
    const MAIN_LAYER = "MAIN_LAYER";
    const ctr = this.viewport.getCenter().clone();
    this.addUILayer(MAIN_LAYER);
    const lblStatus = <Label>this.add.uiElement(
      UIElementType.LABEL,
      MAIN_LAYER,
      {
        position: new Vec2(ctr.x, ctr.y),
        text: "Game Over",
      }
    );
    lblStatus.textColor = Color.WHITE;

    let btOk = initButton(
      this,
      MAIN_LAYER,
      new Vec2(ctr.x, ctr.y + 300),
      "Main Menu"
    );
    btOk.onClick = () => this.sceneManager.changeToScene(MainMenu, {});

    let lblScore = initLabel(
      this,
      MAIN_LAYER,
      new Vec2(ctr.x, ctr.y + 50),
      `High Score: ${this.timeLeft + this.currentScore}`
    );

    if (this.win) {
      if (this.isTutorial) { // We're in a tutorial! :o
        lblStatus.text = "Tutorial Complete!";
        lblScore.text = "";
        if (this.nextLvl) {
          btOk.text = "Next Tutorial";
          btOk.onClick = () =>
            this.sceneManager.changeToScene(this.nextLvl, {
              currentScore: this.currentScore + this.timeLeft,
            });
        } else {
          this.emitter.fireEvent(GameEventType.STOP_SOUND, {
            key: "levelMusic",
          });
        }
      } else { // We're in the real game :)
        lblStatus.text = "You win!";
        if (this.lastLevel) {
          let str = getCookie(SAVE_DATA)
          let o = {
            lock2: true, lock3: true, lock4: true, lock5: true, lock6: true
          }
          if (str) {
            o = JSON.parse(str)
          }
          switch (this.nextLvl.name) {
            case 'Level2_1':
              o.lock2 = false
              break
            case 'Level3_1':
              o.lock3 = false
              break
            case 'Level4_1':
              o.lock4 = false
              break
            case 'Level5_1':
              o.lock5= false
              break
            case 'Level6_1':
              o.lock6 = false
              break
          }
          setCookie(SAVE_DATA, JSON.stringify(o))
          this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "levelMusic" });
        }
        if (this.nextLvl) {
          btOk.text = "Next Room";
          btOk.onClick = () =>
            this.sceneManager.changeToScene(this.nextLvl, {
              currentScore: this.currentScore + this.timeLeft,
            });
        } else {
          this.emitter.fireEvent(GameEventType.STOP_SOUND, {
            key: "levelMusic",
          });
        }
      }
    } else {
      this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "levelMusic" });
      if (this.isTutorial) {
        lblStatus.text = "Tutorial Failed";
        lblScore.text = "";
      }
      // let tf = <TextInput> this.add.uiElement(UIElementType.TEXT_INPUT, MAIN_LAYER, {position: new Vec2(ctr.x, ctr.y+100)})
      // tf.size = new Vec2(230, 40)
      // tf.fontSize = 24
      // tf.setHAlign('center')
      // tf.onClick = () => tf.text = ''
      this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
        key: "lose",
        loop: false,
        holdReference: false,
      });
    }
  }
}
