import GameLevel from "./GameLevel";

export class Level6_1 extends GameLevel {
    loadScene(): void {
        // Load resources (tilemap, audio, spritesheets)
        this.loadMainResources();

        let bombJSONArray = [
            "res/data/bombs1_1.json",
            "res/data/bombs1_1var2.json",
        ];

        this.loadRandomBombsJSON(bombJSONArray);

        this.load.tilemap("level", "res/tilemaps/level6/Level6_1.json"); // Load tile map
        this.load.object("start_end", "res/data/start_end1_1.json"); //Load player and green flag coordinates
        this.load.object("enemyData", "res/data/enemy1_1.json"); // Load enemy info
        // this.load.object("bombData", "res/data/bombs1_1.json"); // Load bomb info
        this.load.object("itemData", "res/data/items.json"); // Load item info
        this.load.object("blockData", "res/data/blocks1_1.json"); // Load block info
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
      this.load.object("start_end", "res/data/start_end1_2.json"); //Load player and green flag coordinates
      this.load.object("enemyData", "res/data/enemy1_2.json"); // Load enemy info
      this.load.object("bombData", "res/data/bombs1_2.json"); // Load bomb info
      this.load.object("itemData", "res/data/items.json"); // Load item info
      this.load.object("blockData", "res/data/blocks1_2.json"); // Load block info
    }
  
    startScene(): void {
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
      this.loadMainResources();
      // Load resources (tilemap, audio, spritesheets)
  
      this.load.tilemap("level", "res/tilemaps/level6/Level6_3.json"); // Load tile map
      this.load.object("start_end", "res/data/start_end1_3.json"); //Load player and green flag coordinates
      this.load.object("enemyData", "res/data/enemy1_3.json"); // Load enemy info
      this.load.object("bombData", "res/data/bombs1_3.json"); // Load bomb info
      this.load.object("itemData", "res/data/items.json"); // Load item info
      this.load.object("blockData", "res/data/blocks1_3.json"); // Load block info
    }
  
    startScene(): void {
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
      this.load.object("start_end", "res/data/start_end1_4.json"); //Load player and green flag coordinates
      this.load.object("enemyData", "res/data/enemy1_4.json"); // Load enemy info
      this.load.object("bombData", "res/data/bombs1_4.json"); // Load bomb info
      this.load.object("itemData", "res/data/items.json"); // Load item info
      this.load.object("blockData", "res/data/blocks1_4.json"); // Load block info
    }
  
    startScene(): void {
      this.setName("6-4");
      super.startScene();
      super.setNextLevel(null);
      this.setCurrentRoom(Level6_4);
    }
  
    updateScene(deltaT: number): void {
      super.updateScene(deltaT);
    }
  }