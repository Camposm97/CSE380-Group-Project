import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import { Level2_1 } from "./Level2";
import { Level5_1 } from "./Level5";

export class Level1_1 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    let bombJSONArray = [
      "res/data/level1/bombs1_1.json",
      "res/data/level1/bombs1_1var2.json",
    ];

    this.loadRandomBombsJSON(bombJSONArray);

    this.load.tilemap("level", "res/tilemaps/level1/Level1_1_alt.json"); // Load tile map
    this.load.object("start_end", "res/data/level1/start_end1_1.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level1/enemy1_1.json"); // Load enemy info
    this.load.object("blockData", "res/data/level1/blocks1_1.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_1.mp3"); // Load Music info
  }

  startScene(): void {
    this.setName("1-1");
    super.startScene();
    this.setNextLevel(Level1_2);
    this.setCurrentRoom(Level1_1); // We need this in order for the room to be reset back to itself
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level1_2 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    this.load.tilemap("level", "res/tilemaps/level1/Level1_2.json"); // Load tile map
    this.load.object("start_end", "res/data/level1/start_end1_2.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level1/enemy1_2.json"); // Load enemy info
    this.load.object("bombData", "res/data/level1/bombs1_2.json"); // Load bomb info
    this.load.object("blockData", "res/data/level1/blocks1_2.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_1.mp3"); // Load Music info
  }

  startScene(): void {
    this.setPlayMusic(false); //so music doesn't loop
    this.setName("1-2");
    super.startScene();
    this.setNextLevel(Level1_3);
    this.setCurrentRoom(Level1_2);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level1_3 extends GameLevel {
  loadScene(): void {
    this.loadMainResources();
    // Load resources (tilemap, audio, spritesheets)

    this.load.tilemap("level", "res/tilemaps/level1/Level1_3.json"); // Load tile map
    this.load.object("start_end", "res/data/level1/start_end1_3.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level1/enemy1_3.json"); // Load enemy info
    this.load.object("bombData", "res/data/level1/bombs1_3.json"); // Load bomb info
    this.load.object("blockData", "res/data/level1/blocks1_3.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_1.mp3"); // Load Music info
  }

  startScene(): void {
    this.setPlayMusic(false); //so music doesn't loop
    this.setName("1-3");
    super.startScene();
    this.setNextLevel(Level1_4);
    this.setCurrentRoom(Level1_3);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level1_4 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    this.load.tilemap("level", "res/tilemaps/level1/Level1_4.json"); // Load tile map
    this.load.object("start_end", "res/data/level1/start_end1_4.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level1/enemy1_4.json"); // Load enemy info
    this.load.object("bombData", "res/data/level1/bombs1_4.json"); // Load bomb info
    this.load.object("blockData", "res/data/level1/blocks1_4.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_1.mp3"); // Load Music info
  }

  startScene(): void {
    this.setLastLevel(true);
    this.setPlayMusic(false);
    this.setName("1-4");
    super.startScene();
    super.setNextLevel(Level2_1); // TODO - Go to Level2_1
    this.setCurrentRoom(Level1_4);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}
