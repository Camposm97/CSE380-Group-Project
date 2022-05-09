import Scene from "../../Wolfie2D/Scene/Scene";
import { initButtonHandler, initLabel } from "../ui/UIBuilder";
import { Level1_1 } from "./Level1";
import { Level2_1 } from "./Level2";
import { Level3_1 } from "./Level3";
import { Level4_1 } from "./Level4";
import { Level5_1 } from "./Level5";
import { Level6_1 } from "./Level6";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

const LEVEL_INTRO = "LEVEL_INTRO";
const enum GO_TO {
  LEVEL1_1 = "LEVEL1_1",
  LEVEL2_1 = "LEVEL2_1",
  LEVEL3_1 = "LEVEL3_1",
  LEVEL4_1 = "LEVEL4_1",
  LEVEL5_1 = "LEVEL5_1",
  LEVEL6_1 = "LEVEL6_1",
}
export class LevelIntro1 extends Scene {
  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL1_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string =
      "McBendorjee had just finished typing up the last few lines of the new";
    const LORE_2: string =
      "prototype of Wolfie2D. Written in nothing but C and ASM, with endless lines of code";
    const LORE_3: string =
      "and no comments, McBendorjee knew his CSE 420 class would replace CSE 320 as the";
    const LORE_4: string =
      "most difficult class in Stonybrook.   Social lives would be destroyed, GPAs halved,";
    const LORE_5: string =
      "piazza posts would go unanswered, and only the strong would survive";
    const LORE_6: string =
      "to tell the tale on reddit.  He took a deep breath and started to compile the program.";
    const LORE_7: string =
      'The process would take 30 minutes, "just like the good old days" he thought to himself.';
    const LORE_8: string =
      "Suddenly, McBendorjee felt a sharp pain and everything went black.";
    const LORE_9: string =
      "When he came to, he looked around and realized something had gone horribly wrong";
    const LORE_10: string =
      "He wasn't in his office anymore, he was in his own creation. He was inside Wolfie2D.";

    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 300),
      LORE_1
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 250),
      LORE_2
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 200),
      LORE_3
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 150),
      LORE_4
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 100),
      LORE_5
    ).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y - 50), LORE_6).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y), LORE_7).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y + 50), LORE_8).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 100),
      LORE_9
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 150),
      LORE_10
    ).fontSize = 28;
    initButtonHandler(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 275),
      "Start",
      GO_TO.LEVEL1_1
    );
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
      key: "levelMusic",
      loop: true,
      holdReference: true,
    });
  }
  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVEL1_1:
          this.sceneManager.changeToScene(Level1_1, {});
          break;
      }
    }
  }
}

export class LevelIntro2 extends Scene {
  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL2_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string = "Andrew write lore";
    const LORE_2: string = "Andrew write some lore";
    const LORE_3: string = "Andrew write more lore";
    const LORE_4: string = "Andrew write decent lore";
    const LORE_5: string = "Andrew write epic lore";
    const LORE_6: string = "Andrew write dramatic lore";
    const LORE_7: string = "Andrew write scary lore";
    const LORE_8: string = "Andrew write dnd lore";
    const LORE_9: string = "Andrew write mystic lore";
    const LORE_10: string = "Andrew write happy lore";

    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 300),
      LORE_1
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 250),
      LORE_2
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 200),
      LORE_3
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 150),
      LORE_4
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 100),
      LORE_5
    ).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y - 50), LORE_6).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y), LORE_7).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y + 50), LORE_8).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 100),
      LORE_9
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 150),
      LORE_10
    ).fontSize = 28;

    initButtonHandler(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 275),
      "Start",
      GO_TO.LEVEL2_1
    );
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
      key: "levelMusic",
      loop: true,
      holdReference: true,
    });
  }
  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVEL2_1:
          this.sceneManager.changeToScene(Level2_1, {});
          break;
      }
    }
  }
}

export class LevelIntro3 extends Scene {
  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL3_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string = "Andrew write lore";
    const LORE_2: string = "Andrew write some lore";
    const LORE_3: string = "Andrew write more lore";
    const LORE_4: string = "Andrew write decent lore";
    const LORE_5: string = "Andrew write epic lore";
    const LORE_6: string = "Andrew write dramatic lore";
    const LORE_7: string = "Andrew write scary lore";
    const LORE_8: string = "Andrew write dnd lore";
    const LORE_9: string = "Andrew write mystic lore";
    const LORE_10: string = "Andrew write happy lore";

    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 300),
      LORE_1
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 250),
      LORE_2
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 200),
      LORE_3
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 150),
      LORE_4
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 100),
      LORE_5
    ).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y - 50), LORE_6).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y), LORE_7).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y + 50), LORE_8).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 100),
      LORE_9
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 150),
      LORE_10
    ).fontSize = 28;

    initButtonHandler(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 275),
      "Start",
      GO_TO.LEVEL3_1
    );
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
      key: "levelMusic",
      loop: true,
      holdReference: true,
    });
  }
  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVEL3_1:
          this.sceneManager.changeToScene(Level3_1, {});
          break;
      }
    }
  }
}

export class LevelIntro4 extends Scene {
  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL4_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string = "Andrew write lore";
    const LORE_2: string = "Andrew write some lore";
    const LORE_3: string = "Andrew write more lore";
    const LORE_4: string = "Andrew write decent lore";
    const LORE_5: string = "Andrew write epic lore";
    const LORE_6: string = "Andrew write dramatic lore";
    const LORE_7: string = "Andrew write scary lore";
    const LORE_8: string = "Andrew write dnd lore";
    const LORE_9: string = "Andrew write mystic lore";
    const LORE_10: string = "Andrew write happy lore";

    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 300),
      LORE_1
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 250),
      LORE_2
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 200),
      LORE_3
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 150),
      LORE_4
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 100),
      LORE_5
    ).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y - 50), LORE_6).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y), LORE_7).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y + 50), LORE_8).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 100),
      LORE_9
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 150),
      LORE_10
    ).fontSize = 28;

    initButtonHandler(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 275),
      "Start",
      GO_TO.LEVEL4_1
    );
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
      key: "levelMusic",
      loop: true,
      holdReference: true,
    });
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVEL4_1:
          this.sceneManager.changeToScene(Level4_1, {});
          break;
      }
    }
  }
}

export class LevelIntro5 extends Scene {
  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL5_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string = "Andrew write lore";
    const LORE_2: string = "Andrew write some lore";
    const LORE_3: string = "Andrew write more lore";
    const LORE_4: string = "Andrew write decent lore";
    const LORE_5: string = "Andrew write epic lore";
    const LORE_6: string = "Andrew write dramatic lore";
    const LORE_7: string = "Andrew write scary lore";
    const LORE_8: string = "Andrew write dnd lore";
    const LORE_9: string = "Andrew write mystic lore";
    const LORE_10: string = "Andrew write happy lore";

    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 300),
      LORE_1
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 250),
      LORE_2
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 200),
      LORE_3
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 150),
      LORE_4
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 100),
      LORE_5
    ).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y - 50), LORE_6).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y), LORE_7).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y + 50), LORE_8).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 100),
      LORE_9
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 150),
      LORE_10
    ).fontSize = 28;

    initButtonHandler(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 275),
      "Start",
      GO_TO.LEVEL5_1
    );
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
      key: "levelMusic",
      loop: true,
      holdReference: true,
    });
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVEL5_1:
          this.sceneManager.changeToScene(Level5_1, {});
          break;
      }
    }
  }
}

export class LevelIntro6 extends Scene {
  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL6_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string = "Andrew write lore";
    const LORE_2: string = "Andrew write some lore";
    const LORE_3: string = "Andrew write more lore";
    const LORE_4: string = "Andrew write decent lore";
    const LORE_5: string = "Andrew write epic lore";
    const LORE_6: string = "Andrew write dramatic lore";
    const LORE_7: string = "Andrew write scary lore";
    const LORE_8: string = "Andrew write dnd lore";
    const LORE_9: string = "Andrew write mystic lore";
    const LORE_10: string = "Andrew write happy lore";

    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 300),
      LORE_1
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 250),
      LORE_2
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 200),
      LORE_3
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 150),
      LORE_4
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y - 100),
      LORE_5
    ).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y - 50), LORE_6).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y), LORE_7).fontSize = 28;
    initLabel(this, LEVEL_INTRO, new Vec2(c.x, c.y + 50), LORE_8).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 100),
      LORE_9
    ).fontSize = 28;
    initLabel(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 150),
      LORE_10
    ).fontSize = 28;

    initButtonHandler(
      this,
      LEVEL_INTRO,
      new Vec2(c.x, c.y + 275),
      "Start",
      GO_TO.LEVEL6_1
    );
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
      key: "levelMusic",
      loop: true,
      holdReference: true,
    });
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let e = this.receiver.getNextEvent();
      switch (e.type) {
        case GO_TO.LEVEL6_1:
          this.sceneManager.changeToScene(Level6_1, {});
          break;
      }
    }
  }
}
