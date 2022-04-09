import GameLevel from "../GameLevel";
import Room2 from "./Room2";

export default class Room1 extends GameLevel {
    loadScene(): void {
        // Load resources (tilemap, audio, spritesheets)
        this.load.spritesheet("player1", "res/spritesheets/mcbendorjee.json");
        this.load.spritesheet("slice", "res/spritesheets/slice.json");
        this.load.spritesheet("flag", "res/spritesheets/flag.json");
        this.load.spritesheet("blueRobot", "res/spritesheets/r_blue.json");
        this.load.spritesheet("blueMouse", "res/spritesheets/rm_blue.json");
        this.load.spritesheet("blueStatue", "res/spritesheets/rs_blue.json");
        this.load.spritesheet("projectile", "res/spritesheets/projectile.json");
        this.load.spritesheet("bomb", "res/spritesheets/explode.json");
        this.load.spritesheet("greenFlag", "res/spritesheets/green_flag.json");
        this.load.object("weaponData", "res/data/weaponData.json"); // Load scene info
        this.load.object("navmesh", "res/data/navmesh.json"); // Load nav mesh
        this.load.image("healthpack", "res/sprites/healthpack.png");
        this.load.image("inventorySlot", "res/sprites/inventory.png");
        this.load.image("knife", "res/sprites/knife.png");
        this.load.image("laserGun", "res/sprites/laserGun.png");
        this.load.image("pistol", "res/sprites/pistol.png");
        this.load.image("block", "res/sprites/block.png");
        this.load.audio("boom", "res/sound/explode.wav");

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
        this.load.tilemap("level", "res/tilemaps/testRoom.json"); // Load tile map
        this.load.object("start_end", "res/data/start_end.json"); //Load player and green flag coordinates
        this.load.object("enemyData", "res/data/enemy.json"); // Load enemy info
        this.load.object("bombData", "res/data/bombs.json"); // Load bomb info
        this.load.object("itemData", "res/data/items.json"); // Load item info
        this.load.object("blockData", "res/data/blocks.json"); // Load block info
    }

    startScene(): void {
        super.startScene()
        this.setNextLvl(Room2)
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}