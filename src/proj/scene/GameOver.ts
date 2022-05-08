import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import { initButton, initLabel } from "../ui/UIBuilder";
import Receiver from "../../Wolfie2D/Events/Receiver";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import { Leaderboard } from "../game_system/Leaderboard";
import { LevelUnlocker, LU } from "../game_system/LevelUnlocker";
import { PlayerAnimations } from "./Constants";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";

export default class GameOver extends Scene {
  private currentScore: number;
  private win: boolean;
  private timeLeft: number;
  private isTutorial: boolean;
  private nextLvl: new (...args: any) => GameLevel;
  private lastLevel: boolean; //is this the last room of the level
  private r: Receiver;

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
    this.load.spritesheet("mcbendorjee", "res/spritesheets/mcbendorjee.json");
    this.load.audio("gameOver", "res/music/CSE_380_Game_Over.mp3"); // Load Music info
    this.load.audio("victory", "res/music/CSE_380_victory.mp3"); // Load Music info
  }

  startScene() {
    this.r = new Receiver();
    const MAIN_LAYER = "MAIN_LAYER";
    const c = this.viewport.getCenter().clone();
    this.addUILayer(MAIN_LAYER);
    const lblStatus = initLabel(
      this,
      MAIN_LAYER,
      c.clone().add(new Vec2(0, -300)),
      "Game Over"
    );
    lblStatus.fontSize = 48;
    const btOk = initButton(
      this,
      MAIN_LAYER,
      new Vec2(c.x, c.y + 300),
      "Main Menu"
    );
    const lblScore = initLabel(
      this,
      MAIN_LAYER,
      new Vec2(c.x, c.y - 200),
      `High Score: ${this.timeLeft + this.currentScore}`
    );

    let prof = this.add.animatedSprite("mcbendorjee", MAIN_LAYER);
    prof.position = c.clone();
    prof.scale = new Vec2(4, 4);

    if (this.win) {
      prof.animation.play(PlayerAnimations.HAPPY);
      if (this.isTutorial) {
        // We're in a tutorial and we won! :o
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
        if (this.lastLevel) {
          this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
            key: "victory",
            loop: false,
            holdReference: true,
          });

          btOk.onClick = () => {
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {
              key: "victory",
            });
            this.sceneManager.changeToScene(MainMenu, {});
          };
        }
      } else {
        // We're in the real game and we won :)
        lblStatus.text = "You win!";
        if (this.lastLevel) {
          this.emitter.fireEvent(GameEventType.STOP_SOUND, {
            key: "levelMusic",
          });
        }
        if (this.nextLvl) {
          // If there is a next level, update level save data
          LU.unlockLevel(this.nextLvl.name);

          if (this.lastLevel) {
            // Check if this is the last room of the level
            lblStatus.text = "Level Complete!";
            btOk.text = "Next Level";
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
              key: "victory",
              loop: false,
              holdReference: true,
            });
            switch (
              this.nextLvl.name // Check if the next level is 'Ending'
            ) {
              case "Ending":
                btOk.text = "Ending";
                break;
            }
          } else {
            btOk.text = "Next Room";
          }
          btOk.onClick = () => {
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {
              key: "victory",
            });
            this.sceneManager.changeToScene(this.nextLvl, {
              currentScore: this.currentScore + this.timeLeft,
            });
          };
        } else {
          this.emitter.fireEvent(GameEventType.STOP_SOUND, {
            key: "levelMusic",
          });
        }
      }
    } else {
      // Player has lost
      prof.animation.play(PlayerAnimations.CRY);

      this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "levelMusic" });
      this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
        key: "gameOver",
        loop: false,
        holdReference: true,
      });

      let tfName: TextInput = undefined;
      if (this.isTutorial) {
        lblStatus.text = "Tutorial Failed";
        lblScore.text = "";
      } else {
        tfName = <TextInput>this.add.uiElement(
          UIElementType.TEXT_INPUT,
          MAIN_LAYER,
          {
            position: new Vec2(c.x, c.y - 150),
          }
        );
        tfName.text = "Your Name Here";
        tfName.size = new Vec2(230, 40);
        tfName.fontSize = 24;
        tfName.setHAlign("center");
        tfName.onClick = () => (tfName.text = "");
      }
      btOk.onClick = () => {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {
          key: "gameOver",
        });
        if (tfName) {
          let name = tfName.text;
          if (name) {
            let leaderboard = new Leaderboard();
            leaderboard.add(name, this.currentScore);
          }
        }
        this.sceneManager.changeToScene(MainMenu, {});
      };
      this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
        key: "lose",
        loop: false,
        holdReference: false,
      });
    }
  }

  updateScene(deltaT: number): void {
    while (this.r.hasNextEvent()) {
      let event = this.r.getNextEvent();
      switch (event.type) {
      }
    }
  }
}
