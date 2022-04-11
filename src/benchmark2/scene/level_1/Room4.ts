import GameLevel from "../GameLevel";

export default class Room4 extends GameLevel {
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

    this.load.tilemap("level", "res/tilemaps/Level1_4.json"); // Load tile map
    this.load.object("start_end", "res/data/start_end1_4.json"); //Load player and green flag coordinates
    this.load.object("enemyData", "res/data/enemy1_4.json"); // Load enemy info
    this.load.object("bombData", "res/data/bombs1_4.json"); // Load bomb info
    this.load.object("itemData", "res/data/items.json"); // Load item info
    this.load.object("blockData", "res/data/blocks1_4.json"); // Load block info
  }

  startScene(): void {
    super.startScene();
    super.setNextLvl(null);
    this.setCurrentRoom(Room4);
  }

  updateScene(deltaT: number): void {
    super.updateScene(deltaT);
  }
}
