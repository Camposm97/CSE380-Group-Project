import GameLevel from "./GameLevel";
import { Level1_1 } from "./Level1";
import { Tutorial1_2, Tutorial1_3, Tutorial1_4 } from "./Tutorial";

export class LevelT_1 extends GameLevel {
    loadScene(): void {
        this.loadMainResources()
        this.loadRandomBombsJSON(['res/data/tutorial/bombs_t_1.json'])
        this.load.tilemap("level", "res/tilemaps/tutorial/LevelT.json"); // Load tile map
        this.load.object("start_end", "res/data/tutorial/start_end_t_1.json"); //Load player and green flag coordinates
        this.load.object("enemyData", "res/data/tutorial/enemy_t_1.json"); // Load enemy info
        this.load.object("blockData", "res/data/tutorial/blocks_t_1.json"); // Load block info
    }

    startScene(): void {
        this.setName('T-1')
        this.setIsTutorial(true)
        super.startScene()
        this.setNextLevel(Tutorial1_2)
        this.setCurrentRoom(LevelT_1)
    }
    
    updateScene(deltaT: number): void {
        super.updateScene(deltaT)
    }
}

export class LevelT_2 extends GameLevel {
    loadScene(): void {
        this.loadMainResources()
        this.loadRandomBombsJSON(['res/data/tutorial/bombs_t_2.json']);
        this.load.tilemap("level", "res/tilemaps/tutorial/LevelT.json"); // Load tile map
        this.load.object("start_end", "res/data/tutorial/start_end_t_2.json"); //Load player and green flag coordinates
        this.load.object("enemyData", "res/data/tutorial/enemy_t_2.json"); // Load enemy info
        this.load.object("blockData", "res/data/tutorial/blocks_t_2.json"); // Load block info
    }

    startScene(): void {
        this.setName('T-2')
        this.setIsTutorial(true)
        super.startScene()
        this.setNextLevel(Tutorial1_3)
        this.setCurrentRoom(LevelT_2)
    }
    
    updateScene(deltaT: number): void {
        super.updateScene(deltaT)
    }
}

export class LevelT_3 extends GameLevel {
    loadScene(): void {
        this.loadMainResources()
        this.loadRandomBombsJSON(['res/data/tutorial/bombs_t_3.json'])
        this.load.tilemap("level", "res/tilemaps/tutorial/LevelT.json"); // Load tile map
        this.load.object("start_end", "res/data/tutorial/start_end_t_3.json"); //Load player and green flag coordinates
        this.load.object("enemyData", "res/data/tutorial/enemy_t_3.json"); // Load enemy info
        this.load.object("blockData", "res/data/tutorial/blocks_t_3.json"); // Load block info
    }

    startScene(): void {
        this.setName('T-3')
        this.setIsTutorial(true)
        super.startScene()
        this.setNextLevel(Tutorial1_4)
        this.setCurrentRoom(LevelT_3)
    }
    
    updateScene(deltaT: number): void {
        super.updateScene(deltaT)
    }
}

export class LevelT_4 extends GameLevel {
    loadScene(): void {
        this.loadMainResources()
        this.loadRandomBombsJSON(['res/data/tutorial/bombs_t_4.json']);
        this.load.tilemap("level", "res/tilemaps/tutorial/LevelT.json"); // Load tile map
        this.load.object("start_end", "res/data/tutorial/start_end_t_4.json"); //Load player and green flag coordinates
        this.load.object("enemyData", "res/data/tutorial/enemy_t_4.json"); // Load enemy info
        this.load.object("blockData", "res/data/tutorial/blocks_t_4.json"); // Load block info
    }

    startScene(): void {
        this.setName('T-4')
        this.setIsTutorial(true)
        super.startScene()
        this.setNextLevel(null)
        this.setCurrentRoom(LevelT_4)
    }
    
    updateScene(deltaT: number): void {
        super.updateScene(deltaT)
    }
}