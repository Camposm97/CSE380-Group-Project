import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import { Level6_1 } from "./Level6";

export class Level5_1 extends GameLevel {
  loadScene(): void {
    this.loadMainResources();

    this.load.tilemap("level", "res/tilemaps/level5/Level5_1.json"); // Load tile map
    this.load.object("start_end", "res/data/level5/start_end_5_1.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level5/enemy_5_1.json"); // Load enemy info
    this.load.object("bombData", "res/data/level5/bombs_5_1.json"); // Load bomb info
    this.load.object("blockData", "res/data/level5/blocks_5_1.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_5.mp3");
  }

  startScene(): void {
    this.setName("5-1");
    super.startScene();
    this.setNextLevel(Level5_2);
    this.setCurrentRoom(Level5_1);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level5_2 extends GameLevel {
  loadScene(): void {
    this.loadMainResources();
    this.load.tilemap("level", "res/tilemaps/level5/Level5_2.json"); // Load tile map
    this.load.object("start_end", "res/data/level5/start_end_5_2.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level5/enemy_5_2.json"); // Load enemy info
    this.load.object("bombData", "res/data/level5/bombs_5_2.json"); // Load bomb info
    this.load.object("blockData", "res/data/level5/blocks_5_2.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_5.mp3");
  }

  startScene(): void {
    this.setName("5-2");
    super.startScene();
    this.setPlayMusic(false);
    this.setNextLevel(Level5_3);
    this.setCurrentRoom(Level5_2);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level5_3 extends GameLevel {
  loadScene(): void {
    this.loadMainResources();
    this.load.tilemap("level", "res/tilemaps/level5/Level5_3.json"); // Load tile map
    this.load.object("start_end", "res/data/level5/start_end_5_3.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level5/enemy_5_3.json"); // Load enemy info
    this.load.object("bombData", "res/data/level5/bombs_5_3.json"); // Load bomb info
    this.load.object("blockData", "res/data/level5/blocks_5_3.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_5.mp3");
  }

  startScene(): void {
    this.setName("5-3");
    this.setPlayMusic(false);
    super.startScene();
    this.setNextLevel(Level5_4);
    this.setCurrentRoom(Level5_3);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level5_4 extends GameLevel {
  loadScene(): void {
    this.loadMainResources();
    this.load.tilemap("level", "res/tilemaps/level5/Level5_4.json"); // Load tile map
    this.load.object("start_end", "res/data/level5/start_end_5_4.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level5/enemy_5_4.json"); // Load enemy info
    this.load.object("bombData", "res/data/level5/bombs_5_4.json"); // Load bomb info
    this.load.object("blockData", "res/data/level5/blocks_5_4.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_5.mp3");
  }

  startScene(): void {
    this.setName("5-4");
    this.setLastLevel(true);
    this.setPlayMusic(false);
    super.startScene();
    super.setNextLevel(Level6_1);
    this.setCurrentRoom(Level5_4);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}
