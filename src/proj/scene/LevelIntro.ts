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
  private currentScore: number

  initScene(options: Record<string, any>): void {
    this.currentScore = options.currentScore ? options.currentScore : 0
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL2_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string =
      "McBendorjee gave a sigh of relief, his game was more difficult than he thought it would be.";
    const LORE_2: string =
      "Thankfully he only made two levels and knew he should be done with this nightmare soon.";
    const LORE_3: string =
      "The next level he made was based off of his experiences in college. Since he went to ";
    const LORE_4: string =
      "Stonybrook, his only experiences were studying in the library and sleeping 4 hours";
    const LORE_5: string =
      "a night in his dorm.  McBendorjee made sure his classes would uphold this Stonybrook";
    const LORE_6: string =
      "tradition.  McBendorjee needed to beat this level fast so he could make sure his";
    const LORE_7: string = "students had the same college experience he had.";
    const LORE_8: string = "";
    const LORE_9: string = "";
    const LORE_10: string = "";

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
          this.sceneManager.changeToScene(Level2_1, {currentScore: this.currentScore});
          break;
      }
    }
  }
}

export class LevelIntro3 extends Scene {
  private currentScore: number

  initScene(options: Record<string, any>): void {
    this.currentScore = options.currentScore ? options.currentScore : 0
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL3_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string =
      "McBendorjee had beaten his two levels, surely he must be freed from Wolife2D by now.";
    const LORE_2: string =
      'But to his horror, he realized there was a third level. "How could this be possible?"';
    const LORE_3: string =
      "It looked like he was in some kind of a lab, but who could have possibly created it?";
    const LORE_4: string =
      "Was it a student who broke into his lab? Was Wolfie2D becoming sentient?";
    const LORE_5: string =
      "Or was McBendorjee's own conciousness creating the levels as he played?";
    const LORE_6: string = "";
    const LORE_7: string = "";
    const LORE_8: string = "";
    const LORE_9: string = "";
    const LORE_10: string = "";

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
          this.sceneManager.changeToScene(Level3_1, {currentScore: this.currentScore});
          break;
      }
    }
  }
}

export class LevelIntro4 extends Scene {
  private currentScore: number

  initScene(options: Record<string, any>): void {
    this.currentScore = options.currentScore ? options.currentScore : 0
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL4_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string =
      '"How many levels are left?" It seems there was no end in sight."';
    const LORE_2: string =
      "Was McBendorjee doomed to be stuck in Wolfie2D forever?";
    const LORE_3: string =
      "He looked around and noticed the next level was much more peaceful.";
    const LORE_4: string =
      "It reminded him of the time he ate some brownies his college roommates had made him.";
    const LORE_5: string =
      "The brownies made time go slow, food taste amazing, and video games felt like they";
    const LORE_6: string =
      "did when he was a kid.  McBendorjee had never felt such peace since then until now.";
    const LORE_7: string = "";
    const LORE_8: string = "";
    const LORE_9: string = "";
    const LORE_10: string = "";

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
          this.sceneManager.changeToScene(Level4_1, {currentScore: this.currentScore});
          break;
      }
    }
  }
}

export class LevelIntro5 extends Scene {
  private currentScore: number

  initScene(options: Record<string, any>): void {
    this.currentScore = options.currentScore ? options.currentScore : 0
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL5_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string =
      "The peace that McBendorjee had started to feel began to slip away again.";
    const LORE_2: string =
      "It was slowly replaced by fear and anxiety.  It was the same fear and";
    const LORE_3: string =
      "anxiety he felt when he had 3 assignments due all at once and there";
    const LORE_4: string =
      "was no time to complete them.  McBendorjee suddenly felt an overwhelming";
    const LORE_5: string =
      "sense of guilt.  He realized that he had become the monster he feared as";
    const LORE_6: string =
      "a student.  He had grown cold and apathetic to plight of his students.";
    const LORE_7: string =
      "Was this all punishment for the unnecessary amount of work he assigned?";
    const LORE_8: string = "Did he even deserve to be free from Wolife2D";
    const LORE_9: string = "";
    const LORE_10: string = "";

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
          this.sceneManager.changeToScene(Level5_1, {currentScore: this.currentScore});
          break;
      }
    }
  }
}

export class LevelIntro6 extends Scene {
  private currentScore: number

  initScene(options: Record<string, any>): void {
    this.currentScore = options.currentScore ? options.currentScore : 0
  }

  startScene(): void {
    this.receiver.subscribe([GO_TO.LEVEL6_1]);
    this.addUILayer(LEVEL_INTRO);
    const c = this.viewport.getCenter().clone();

    const LORE_1: string =
      "McBendorjee now knew he no option but to keep pressing forward.";
    const LORE_2: string =
      "He had been through hell playing through his own creation, but with";
    const LORE_3: string =
      "it came a newfound determination to change.  He no longer would put";
    const LORE_4: string =
      "students through what he went through.  He vowed if he survived this";
    const LORE_5: string =
      "he would make sure his classes were fair, and students could enjoy";
    const LORE_6: string =
      "an education and a social life.  He would end the vicious cycle of";
    const LORE_7: string = "suffering, he just had one more level.";
    const LORE_8: string = "Or at least that's what he hoped.";
    const LORE_9: string = "";
    const LORE_10: string = "";

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
          this.sceneManager.changeToScene(Level6_1, {currentScore: this.currentScore});
          break;
      }
    }
  }
}
