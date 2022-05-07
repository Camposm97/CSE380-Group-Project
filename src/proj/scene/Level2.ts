import GameLevel from "./GameLevel";
import { Level3_1 } from "./Level3";

export class Level2_1 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    let enemyJSONArray = [
      "res/data/level2/enemy2_1.json",
      "res/data/level2/enemy2_1var2.json",
    ];

    this.loadRandomEnemysJSON(enemyJSONArray);

    this.load.object("bombData", "res/data/level2/bombs2_1.json"); // Load bomb info
    this.load.tilemap("level", "res/tilemaps/level2/Level2_1_alt.json"); // Load tile map
    this.load.object("start_end", "res/data/level2/start_end2_1.json"); //Load player and green flag coordinates
    // this.load.object("enemyData", "res/data/level2/enemy2_1.json"); // Load enemy info
    this.load.object("blockData", "res/data/level2/blocks2_1.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_2.mp3"); // Load Music info
  }

  startScene(): void {
    this.setName("2-1");
    super.startScene();
    this.setNextLevel(Level2_2);
    this.setCurrentRoom(Level2_1); // We need this in order for the room to be reset back to itself
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level2_2 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    this.load.tilemap("level", "res/tilemaps/level2/Level2_2.json"); // Load tile map
    this.load.object("start_end", "res/data/level2/start_end2_2.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level2/enemy2_2.json"); // Load enemy info
    this.load.object("bombData", "res/data/level2/bombs2_2.json"); // Load bomb info
    this.load.object("blockData", "res/data/level2/blocks2_2.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_2.mp3"); // Load Music info
  }

  startScene(): void {
    this.setPlayMusic(false); //so music doesn't loop
    this.setName("2-2");
    super.startScene();
    this.setNextLevel(Level2_3);
    this.setCurrentRoom(Level2_2);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level2_3 extends GameLevel {
  loadScene(): void {
    this.loadMainResources();
    // Load resources (tilemap, audio, spritesheets)

    this.load.tilemap("level", "res/tilemaps/level2/Level2_3.json"); // Load tile map
    this.load.object("start_end", "res/data/level2/start_end2_3.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level2/enemy2_3.json"); // Load enemy info
    this.load.object("bombData", "res/data/level2/bombs2_3.json"); // Load bomb info
    this.load.object("blockData", "res/data/level2/blocks2_3.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_2.mp3"); // Load Music info
  }

  startScene(): void {
    this.setPlayMusic(false); //so music doesn't loop
    this.setName("2-3");
    super.startScene();
    this.setNextLevel(Level2_4);
    this.setCurrentRoom(Level2_3);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level2_4 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    this.load.tilemap("level", "res/tilemaps/level2/Level2_4.json"); // Load tile map
    this.load.object("start_end", "res/data/level2/start_end2_4.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level2/enemy2_4.json"); // Load enemy info
    this.load.object("bombData", "res/data/level2/bombs2_4.json"); // Load bomb info
    this.load.object("blockData", "res/data/level2/blocks2_4.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_2.mp3"); // Load Music info
  }

  startScene(): void {
    this.setLastLevel(true);
    this.setPlayMusic(false);
    this.setName("2-4");
    super.startScene();
    super.setNextLevel(Level3_1);
    this.setCurrentRoom(Level2_4);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}
