import GameLevel from "./GameLevel";

export class Room1 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    /*
            TODO: To conserve time we should do approach the design of the levels as how Zach did in HW5 where each level is its own class
                so in our case, each class would be a room, thus 24 rooms in total since we need 6 levels. I think this is a safer bet because
                the only time we can load resources is in a Scene class as far as I know. 

                Maybe we could have some sort of manager that is a Scene that has a collection of the all the levels. And it will 
                listen to an event such as NEXT_LEVEL and it will get the next level and change the scene. But then won't the manager 
                no longer work?

                Or maybe we can have a class that extends Game and then we can go from there. (It doesn't really work)
                Game has an update(deltaT) function but it will prevent the whole game from running if code is there.

                But it works which is good!
        */
    let bombJSONArray = [
      "res/data/bombs1_1.json",
      "res/data/bombs1_1var2.json",
    ];

    this.loadRandomBombsJSON(bombJSONArray);

    this.load.tilemap("level", "res/tilemaps/Level1_1.json"); // Load tile map
    this.load.object("start_end", "res/data/start_end1_1.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/enemy1_1.json"); // Load enemy info
    // this.load.object("bombData", "res/data/bombs1_1.json"); // Load bomb info
    this.load.object("itemData", "res/data/items.json"); // Load item info
    this.load.object("blockData", "res/data/blocks1_1.json"); // Load block info
  }

  startScene(): void {
    this.setName("1-1");
    super.startScene();
    this.setNextLvl(Room2);
    this.setCurrentRoom(Room1); // We need this in order for the room to be reset back to itself
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Room2 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    this.load.tilemap("level", "res/tilemaps/Level1_2.json"); // Load tile map
    this.load.object("start_end", "res/data/start_end1_2.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/enemy1_2.json"); // Load enemy info
    this.load.object("bombData", "res/data/bombs1_2.json"); // Load bomb info
    this.load.object("itemData", "res/data/items.json"); // Load item info
    this.load.object("blockData", "res/data/blocks1_2.json"); // Load block info
  }

  startScene(): void {
    this.setName("1-2");
    super.startScene();
    this.setNextLvl(Room3);
    this.setCurrentRoom(Room2);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Room3 extends GameLevel {
  loadScene(): void {
    this.loadMainResources();
    // Load resources (tilemap, audio, spritesheets)

    this.load.tilemap("level", "res/tilemaps/Level1_3.json"); // Load tile map
    this.load.object("start_end", "res/data/start_end1_3.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/enemy1_3.json"); // Load enemy info
    this.load.object("bombData", "res/data/bombs1_3.json"); // Load bomb info
    this.load.object("itemData", "res/data/items.json"); // Load item info
    this.load.object("blockData", "res/data/blocks1_3.json"); // Load block info
  }

  startScene(): void {
    this.setName("1-3");
    super.startScene();
    this.setNextLvl(Room4);
    this.setCurrentRoom(Room3);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}

export class Room4 extends GameLevel {
  loadScene(): void {
    // Load resources (tilemap, audio, spritesheets)
    this.loadMainResources();

    this.load.tilemap("level", "res/tilemaps/Level1_4.json"); // Load tile map
    this.load.object("start_end", "res/data/start_end1_4.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/enemy1_4.json"); // Load enemy info
    this.load.object("bombData", "res/data/bombs1_4.json"); // Load bomb info
    this.load.object("itemData", "res/data/items.json"); // Load item info
    this.load.object("blockData", "res/data/blocks1_4.json"); // Load block info
  }

  startScene(): void {
    this.setName("1-4");
    super.startScene();
    super.setNextLvl(null);
    this.setCurrentRoom(Room4);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}
