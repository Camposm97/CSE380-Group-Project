import Ending from "./Ending";
import GameLevel from "./GameLevel";

export class Level6_1 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();
    this.load.tilemap("level", "res/tilemaps/level6/Level6_1.json"); // Load tile map
    this.load.object("start_end", "res/data/level6/start_end_6_1.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level6/enemy_6_1.json"); // Load enemy info
    this.load.object("bombData", "res/data/level6/bombs_6_1.json"); // Load bomb info
    this.load.object("blockData", "res/data/level6/blocks_6_1.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_6.mp3"); // Load Music info
  }

  startScene(): void {
    this.setName("6-1");
    super.startScene();
    this.setNextLevel(Level6_2);
    this.setCurrentRoom(Level6_1); // We need this in order for the room to be reset back to itself
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level6_2 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();
    this.load.tilemap("level", "res/tilemaps/level6/Level6_2.json"); // Load tile map
    this.loadRandomStartEndJSON(['res/data/level6/start_end_6_2_1.json', 'res/data/level6/start_end_6_2_2.json'])
    this.load.object("enemyData", "res/data/level6/enemy_6_2.json"); // Load enemy info
    this.load.object("bombData", "res/data/level6/bombs_6_2.json"); // Load bomb info
    this.load.object("blockData", "res/data/level6/blocks_6_2.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_6.mp3"); // Load Music info
  }

  startScene(): void {
    this.setPlayMusic(false); //so music doesn't loop
    this.setName("6-2");
    super.startScene();
    this.setNextLevel(Level6_3);
    this.setCurrentRoom(Level6_2);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level6_3 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();
    this.load.tilemap("level", "res/tilemaps/level6/Level6_3.json"); // Load tile map
    this.load.object("start_end", "res/data/level6/start_end_6_3.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/level6/enemy_6_3.json"); // Load enemy info
    this.load.object("bombData", "res/data/level6/bombs_6_3.json"); // Load bomb info
    this.load.object("blockData", "res/data/level6/blocks_6_3.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_6.mp3"); // Load Music info
  }

  startScene(): void {
    this.setPlayMusic(false); //so music doesn't loop
    this.setName("6-3");
    super.startScene();
    this.setNextLevel(Level6_4);
    this.setCurrentRoom(Level6_3);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Level6_4 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();
    this.load.tilemap("level", "res/tilemaps/level6/Level6_4.json"); // Load tile map
    this.loadRandomStartEndJSON(['res/data/level6/start_end_6_4_1.json', 'res/data/level6/start_end_6_4_2.json'])
    this.load.object("enemyData", "res/data/level6/enemy_6_4.json"); // Load enemy info
    this.load.object("bombData", "res/data/level6/bombs_6_4.json"); // Load bomb info
    this.load.object("blockData", "res/data/level6/blocks_6_4.json"); // Load block info
    this.load.audio("levelMusic", "res/music/CSE_380_Level_6.mp3"); // Load Music info
  }

  startScene(): void {
    this.setPlayMusic(false); //so music doesn't loop
    this.setName("6-4");
    this.setLastLevel(true);
    super.startScene();
    super.setNextLevel(Ending);
    this.setCurrentRoom(Level6_4);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}
