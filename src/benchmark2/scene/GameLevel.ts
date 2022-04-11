import PlayerController from "../ai/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import { CoatColor, Control, Events, Names, RobotAction } from "./Constants";
import BlueRobotAI from "../ai/BlueRobotAI";
import WeaponType from "../game_system/items/weapon_types/WeaponType";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import Weapon from "../game_system/items/Weapon";
import Healthpack from "../game_system/items/Healthpack";
import InventoryManager from "../game_system/InventoryManager";
import Item from "../game_system/items/Item";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import BattleManager from "../game_system/BattleManager";
import BattlerAI from "../ai/BattlerAI";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Input from "../../Wolfie2D/Input/Input";
import GameOver from "./GameOver";
import ScoreTimer from "../game_system/ScoreTimer";
import Bomb from "../game_system/objects/Bomb";
import RobotAI from "../ai/RobotAI";
import MainMenu from "./MainMenu";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameLayerManager } from "../game_system/GameLayerManager";
import BlueMouseAI from "../ai/BlueMouseAI";
import BlueStatueAI from "../ai/BlueStatueAI";
import ProjectileAI from "../ai/ProjectileAI";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Block from "../game_system/objects/Block";
import Timer from "../../Wolfie2D/Timing/Timer";

export default abstract class GameLevel extends Scene {
  private name: string
  private currentScore: number;
  private timeLeft: number;
  private player: AnimatedSprite; // Player Sprite
  private enemies: Array<AnimatedSprite>; // List of Enemies
  private bombs: Array<Bomb>; // List of Bombs
  private blocks: Array<Block>; // List of Blocks
  private flags: Array<AnimatedSprite>; // List of Flags
  private walls: OrthogonalTilemap; // Wall Layer
  private graph: PositionGraph; // Nav Mesh
  private items: Array<Item>; // List of Items
  private battleManager: BattleManager;
  private lblHealth: Label;
  private lblTime: Label;
  private glm: GameLayerManager;
  private scoreTimer: ScoreTimer;
  private listeningEnemies: number; //number of enemies that listen for player movement events
  private nearestBomb: Bomb; //for detecting how close the player is to the nearest bomb
  private greenFlag: AnimatedSprite;
  private startNextLvl: boolean;
  private currentRoom: new (...args: any) => GameLevel;
  private nextRoom: new (...args: any) => GameLevel;

  // Create an object pool for our projectives
  private MAX_PROJECTILE_SIZE = 5;
  private projectiles: Array<AnimatedSprite> = new Array(
    this.MAX_PROJECTILE_SIZE
  );
  initScene(options: Record<string, any>): void {
    options.currentScore
      ? (this.currentScore = options.currentScore)
      : (this.currentScore = 0);
    this.timeLeft = options.timeLeft;
  }

  startScene() {
    // Add in the tilemap
    let tilemapLayers = this.add.tilemap("level", new Vec2(0.5, 0.5));

    // Get the wall layer
    this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

    // Set the viewport bounds to the tilemap
    let tilemapSize: Vec2 = this.walls.size.scaled(0.5);

    this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
    this.viewport.setZoomLevel(3);

    this.glm = new GameLayerManager(this); // ***INITIALIZES PRIMARY LAYER***

    // Create the battle manager
    this.battleManager = new BattleManager();

    this.initializeWeapons();

    // Initialize the items array - this represents items that are in the game world
    this.items = new Array();

    // Create the player
    this.initializePlayer();

    // Place the end level flag
    this.initializeGreenFlag();

    // Make the viewport follow the player
    this.viewport.follow(this.player);

    // Create the navmesh
    this.createNavmesh();

    //initialize the number of enemies listening for player movement to 0
    this.listeningEnemies = 0;

    // Initialize all enemies
    this.initializeEnemies();

    // Initalize all bombs
    this.initializeBombs();

    // Initaize all blocks
    this.initializeBlocks();

    // Initialize projectiles
    this.initializeProjectiles();
    this.glm.initHudLayer();
    this.glm.initPauseLayer();
    this.glm.initControlsLayer();
    this.glm.initRoomCompleteLayer();

    this.startNextLvl = false;
    this.nextRoom = null;

    // Send the player and enemies to the battle manager
    // this.battleManager.setPlayers([<BattlerAI>this.players[0]._ai, <BattlerAI>this.players[1]._ai]);
    this.battleManager.setPlayers([<PlayerController>this.player._ai]);
    this.battleManager.setEnemies(
      this.enemies.map((enemy) => <RobotAI>enemy._ai)
    );
    this.battleManager.setBlocks(this.blocks);

    // Subscribe to relevant events
    this.receiver.subscribe("enemyDied");
    this.receiver.subscribe(RobotAction.FIRE_PROJECTILE);
    this.receiver.subscribe(Events.PLACE_FLAG);
    this.receiver.subscribe(Events.UNLOAD_ASSET);
    this.receiver.subscribe(Events.PAUSE_GAME);
    this.receiver.subscribe(Events.RESET_ROOM);
    this.receiver.subscribe(Events.SHOW_CONTROLS);
    this.receiver.subscribe(Events.EXIT_GAME);
    this.receiver.subscribe(Events.LEVEL_END)
    this.receiver.subscribe(Events.ROOM_COMPLETE)

    this.initScoreTimer()
    this.glm.showFadeOut()
    // Spawn items into the world
    // this.spawnItems();
  }

  initializeGreenFlag() {
    this.greenFlag = this.add.animatedSprite("greenFlag", "primary");
    let coord = this.load.getObject("start_end").greenFlagPos;
    this.greenFlag.position = new Vec2(
      (coord[0] - 0.5) * 16,
      (coord[1] - 1.0) * 16
    );
    this.greenFlag.scale = new Vec2(0.5, 0.5);
    this.greenFlag.animation.play("IDLE");
    this.greenFlag.collisionShape = new AABB(
      this.greenFlag.position,
      new Vec2(0.8, 0.8)
    );
    console.log(this.greenFlag);
  }

  initScoreTimer(): void {
    let aux = () => this.handleLoseCondition(0);
    if (this.timeLeft !== undefined) {
      this.scoreTimer = new ScoreTimer(this.timeLeft, aux, false);
    } else {
      this.scoreTimer = new ScoreTimer(300_000, aux, false);
    }
    this.scoreTimer.start();
  }

  initializeProjectiles(): void {
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i] = this.add.animatedSprite("projectile", "primary");
      this.projectiles[i].visible = false;

      // Add AI to our projectile
      this.projectiles[i].addAI(ProjectileAI, { velocity: new Vec2(0, 0) });
    }
  }

  spawnProjectile(position: Vec2, velocity: Vec2): void {
    // Find the first viable bullet
    let projectile: AnimatedSprite = null;
    let randomNum = Math.random();

    for (let p of this.projectiles) {
      if (!p.visible) {
        // We found a dead projectile
        projectile = p;
        break;
      }
    }

    if (projectile !== null) {
      // Spawn a projectile
      projectile.visible = true;
      projectile.position = position.add(new Vec2(0, -64));
      (<ProjectileAI>projectile._ai).start_velocity = velocity;
      projectile.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    }
  }

  setCurrentRoom(room: new (...args: any) => GameLevel): void {
    this.currentRoom = room;
  }

  handleEvent(event: GameEvent): void {
    switch (event.type) {
      case Events.PAUSE_GAME:
        if (this.glm.showPause()) {
          this.scoreTimer.pause();
        } else {
          this.scoreTimer.start(this.scoreTimer.getTimeLeftInMillis());
        }
        break;
      case Events.RESET_ROOM:
        this.glm.hideAllAndZoomOut();
        this.sceneManager.changeToScene(this.currentRoom, {
          timeLeft: this.scoreTimer.getTimeLeftInMillis(),
        });
        break;
      case Events.SHOW_CONTROLS:
        this.glm.showControls();
        break;
      case Events.EXIT_GAME:
        this.sceneManager.changeToScene(MainMenu, {});
        break;
      case Events.ROOM_COMPLETE:
        console.log('room complete!!!')
        new Timer(3000, () => {
          this.glm.showFadeIn()
        }, false).start();
        break;
      case Events.LEVEL_END:
        this.viewport.setZoomLevel(1);
          this.sceneManager.changeToScene(GameOver, {
            currentScore: this.currentScore,
            win: true,
            timeLeft: this.scoreTimer.getTimeLeftInSeconds(),
            nextLvl: this.nextRoom,
          })
        break;
      case "healthpack":
        this.createHealthpack(event.data.get("position"));
        break;
      case "enemyDied":
        this.enemies = this.enemies.filter(
          (enemy) => enemy !== event.data.get("enemy")
        );
        this.battleManager.enemies = this.battleManager.enemies.filter(
          (enemy) => enemy !== <RobotAI>event.data.get("enemy")._ai
        );
        break;
      case Events.PLACE_FLAG:
        let coord = event.data.get("coordinates");
        for (let bomb of this.bombs) {
          if (bomb && bomb.tileCoord.equals(coord)) {
            if (!bomb.isFlagged) {
              bomb.setIsFlaggedTrue();
              this.flags.push(this.add.animatedSprite("flag", "primary"));
              this.flags[this.flags.length - 1].position = new Vec2(
                (coord.x + 0.5) * 16,
                coord.y * 16
              );
              this.flags[this.flags.length - 1].scale = new Vec2(0.5, 0.5);
              this.flags[this.flags.length - 1].animation.play("IDLE");
            }
          }
        }
        if (event.isType(RobotAction.FIRE_PROJECTILE)) {
          this.spawnProjectile(
            event.data.get("position"),
            event.data.get("velocity")
          );
        }
        break;
      case Events.UNLOAD_ASSET:
        let asset = this.sceneGraph.getNode(event.data.get("node"));
        asset.destroy();
        break;
    }
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }

    //handleCollisions for
    for (let enemy of this.enemies) {
      if (enemy && enemy.sweptRect) {
        if (this.player.sweptRect.overlaps(enemy.sweptRect)) {
          (<PlayerController>this.player._ai).damage(
            (<RobotAI>enemy._ai).damage
          );
        }
        for (let bomb of this.bombs) {
          if (bomb && !bomb.isDestroyed) {
            if (
              enemy &&
              enemy.sweptRect &&
              enemy.sweptRect.overlaps(bomb.collisionBoundary)
            ) {
              if ((<RobotAI>enemy._ai).listening) this.listeningEnemies--;
              bomb.explode();
              this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
                key: "boom",
                loop: false,
                holdReference: false,
              });

              enemy.destroy();
              this.enemies = this.enemies.filter(
                (currentEnemy) => currentEnemy !== enemy
              );
              this.battleManager.enemies = this.battleManager.enemies.filter(
                (currentEnemy) => currentEnemy !== enemy._ai
              );
              //TODO REMOVE ANY FLAG SPRITE THAT HAS BEEN PLACED
              bomb.setIsDestroyedTrue();
            }
          }
        }
      }
    }

    if (
      this.enemies.length === 0 &&
      this.player.collisionShape.overlaps(this.greenFlag.collisionShape)
    ) {
      if (!this.startNextLvl) {
        this.glm.showRoomComplete();
      }
      this.startNextLvl = true;
    }

    // checks to see how close player is to bomb
    // changers sprite closer player gets to bom
    // gameover if player lands on bomb

    if (!(<PlayerController>this.player._ai).nearBomb) {
      (<PlayerController>this.player._ai).setCoatColor(CoatColor.WHITE);
      for (let bomb of this.bombs) {
        if (bomb && !bomb.isDestroyed) {
          if (this.player.collisionShape.overlaps(bomb.outerBoundary)) {
            this.nearestBomb = bomb;
            (<PlayerController>this.player._ai).nearBomb = true;
          }
        }
      }
    }

    if ((<PlayerController>this.player._ai).nearBomb) {
      this.bombCollision();
    }
    let health = (<BattlerAI>this.player._ai).health;
    this.handleLoseCondition(health);
    this.updateHUD(health);
    this.handleInput();
  }

  //Once the player is near a bomb, we see how close to the bomb that player is
  bombCollision() {
    if (
      this.player.collisionShape.overlaps(this.nearestBomb.collisionBoundary)
    ) {
      (<PlayerController>this.player._ai).health = 0;
    } else if (
      this.player.collisionShape.overlaps(this.nearestBomb.innerBoundary)
    ) {
      (<PlayerController>this.player._ai).setCoatColor(CoatColor.RED);
    } else if (
      this.player.collisionShape.overlaps(this.nearestBomb.middleBoundary)
    ) {
      (<PlayerController>this.player._ai).setCoatColor(CoatColor.BLUE);
    } else if (
      this.player.collisionShape.overlaps(this.nearestBomb.outerBoundary)
    ) {
      (<PlayerController>this.player._ai).setCoatColor(CoatColor.GREEN);
    } else (<PlayerController>this.player._ai).nearBomb = false;
  }

  handleLoseCondition(health: number): void {
    if (health <= 0) {
      // If {health} <= 0, Game Over!
      this.viewport.setZoomLevel(1);
      this.viewport.disableZoom();
      this.sceneManager.changeToScene(GameOver, { win: false });
    }
  }

  updateHUD(health: number): void {
    this.lblHealth.text = `HP: ${health}`;
    this.lblTime.text = `${this.scoreTimer.toString()}`;
  }

  handleInput(): void {
    // Debug mode graph
    if (Input.isKeyJustPressed("g")) {
      this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
    }
    /*
      If we're transitioning to the next level, disable the pause button
    */
    if (!this.startNextLvl) { 
      if (Input.isJustPressed(Control.PAUSE)) {
        this.emitter.fireEvent(Events.PAUSE_GAME, {});
      }
    }
  }

  getClosestEnemy(playerPos: Vec2, range: number): Vec2 {
    let closetDistance: number = Number.POSITIVE_INFINITY;
    let closetEnemy: Vec2 = null;
    for (let enemy of this.enemies) {
      let distance = Math.sqrt(
        Math.pow(enemy.position.x - playerPos.x, 2) +
          Math.pow(enemy.position.y - playerPos.y, 2)
      );
      if (distance <= range) {
        if (distance < closetDistance) {
          closetDistance = distance;
          closetEnemy = enemy.position;
        }
      }
    }
    return closetEnemy;
  }

  /**
   * Handles item spawning from items.json
   */
  spawnItems(): void {
    // Get the item data
    let itemData = this.load.getObject("itemData");

    for (let item of itemData.items) {
      if (item.type === "healthpack") {
        // Create a healthpack
        this.createHealthpack(
          new Vec2(item.position[0] / 2, item.position[1] / 2)
        );
      } else {
        // item.type is "weapon"
        let weapon = this.createWeapon(item.weaponType);
        weapon.moveSprite(new Vec2(item.position[0] / 2, item.position[1] / 2));
        this.items.push(weapon);
      }
    }
  }

  /**
   *
   * Creates and returns a new weapon
   * @param type The weaponType of the weapon, as a string
   */
  createWeapon(type: string): Weapon {
    let weaponType = <WeaponType>(
      RegistryManager.getRegistry("weaponTypes").get(type)
    );

    let sprite = this.add.sprite(weaponType.spriteKey, "primary");

    return new Weapon(sprite, weaponType, this.battleManager);
  }

  /**
   * Creates a healthpack at a certain position in the world
   * @param position
   */
  createHealthpack(position: Vec2): void {
    let sprite = this.add.sprite("healthpack", "primary");
    let healthpack = new Healthpack(sprite);
    healthpack.moveSprite(position);
    this.items.push(healthpack);
  }

  /**
   * Initalizes all weapon types based of data from weaponData.json
   */
  initializeWeapons(): void {
    let weaponData = this.load.getObject("weaponData");

    for (let i = 0; i < weaponData.numWeapons; i++) {
      let weapon = weaponData.weapons[i];

      // Get the constructor of the prototype
      let constr = RegistryManager.getRegistry("weaponTemplates").get(
        weapon.weaponType
      );

      // Create a weapon type
      let weaponType = new constr();

      // Initialize the weapon type
      weaponType.initialize(weapon);

      // Register the weapon type
      RegistryManager.getRegistry("weaponTypes").registerItem(
        weapon.name,
        weaponType
      );
    }
  }

  /**
   * Initializes Player's position and starting items
   */
  initializePlayer(): void {
    // Create the inventory
    let inventory = new InventoryManager(
      this,
      2,
      "inventorySlot",
      new Vec2(16, 16),
      4,
      "slots1",
      "items1"
    );
    let startingWeapon = this.createWeapon("knife");
    inventory.addItem(startingWeapon);
    // Create the players
    // this.players = Array(2);
    this.player = this.add.animatedSprite("player1", "primary");
    let coord = this.load.getObject("start_end").playerStartPos;
    this.player.position = new Vec2((coord[0] - 0.5) * 16, (coord[1] - 1) * 16);
    this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    //First player is melee based, starts off with a knife and is short ranged
    this.player.addAI(PlayerController, {
      speed: 100,
      health: 5,
      inventory: inventory,
      items: this.items,
      inputEnabled: true,
      range: 75,
      tilemap: "Floor",
    });
    this.player.animation.play("IDLE_WHITE");

    //Set inventory UI highlight
    (<PlayerController>this.player._ai).inventory.setActive(true);
    // (<PlayerController>this.players[1]._ai).inventory.setActive(false);
  }

  createNavmesh(): void {
    // Add a layer to display the graph
    let gLayer = this.addLayer("graph");
    gLayer.setHidden(true);

    let navmeshData = this.load.getObject("navmesh");

    // Create the graph
    this.graph = new PositionGraph();

    // Add all nodes to our graph
    for (let node of navmeshData.nodes) {
      this.graph.addPositionedNode(new Vec2(node[0] / 2, node[1] / 2));
      this.add.graphic(GraphicType.POINT, "graph", {
        position: new Vec2(node[0] / 2, node[1] / 2),
      });
    }

    // Add all edges to our graph
    for (let edge of navmeshData.edges) {
      this.graph.addEdge(edge[0], edge[1]);
      this.add.graphic(GraphicType.LINE, "graph", {
        start: this.graph.getNodePosition(edge[0]),
        end: this.graph.getNodePosition(edge[1]),
      });
    }

    // Set this graph as a navigable entity
    let navmesh = new Navmesh(this.graph);

    this.navManager.addNavigableEntity(Names.NAVMESH, navmesh);
  }

  initializeBlocks(): void {
    // Get the block data
    const blockData = this.load.getObject("blockData");

    // Create an array of the blockdata
    this.blocks = new Array(blockData.numBlocks);

    for (let i = 0; i < blockData.numBlocks; i++) {
      let blockSprite = this.add.sprite("block", "primary");
      this.blocks[i] = new Block(
        new Vec2(
          blockData.blocks[i].position[0] - 1,
          blockData.blocks[i].position[1] - 1
        ),
        blockSprite
      );
      this.blocks[i].owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    }
  }

  initializeBombs(): void {
    // Get the bomb data
    const bombData = this.load.getObject("bombData");

    // Create an array of the bombdata and flags
    this.bombs = new Array(bombData.numBombs);
    this.flags = new Array(bombData.numBombs);

    for (let i = 0; i < bombData.numBombs; i++) {
      let bombSprite = this.add.animatedSprite("bomb", "primary");
      this.bombs[i] = new Bomb(
        new Vec2(
          bombData.bombs[i].position[0] - 1,
          bombData.bombs[i].position[1] - 1
        ),
        bombSprite
      );
      this.bombs[i].hide();
    }
  }

  initializeEnemies() {
    // Get the enemy data
    const enemyData = this.load.getObject("enemyData");

    // Create an enemies array
    this.enemies = new Array(enemyData.numEnemies);

    // Initialize the enemies
    for (let i = 0; i < enemyData.numEnemies; i++) {
      let entity = enemyData.enemies[i];
      // Create an enemy
      this.enemies[i] = this.add.animatedSprite(entity.type, "primary");
      this.enemies[i].position.set(
        entity.position[0] * 16,
        entity.position[1] * 16
      );
      this.enemies[i].animation.play("IDLE");

      // Activate physics
      this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

      let enemyOptions = {
        behavior: entity.behavior,
        time: entity.time,
        damage: entity.damage,
      };

      //TODO TRY AND FIND A WAY TO MAP STRINGS TO ROBOT AI CLASS TYPES
      //ADD MORE AI TYPES ONCE THEY ARE MADE
      switch (entity.ai) {
        case "BlueRobotAI":
          this.enemies[i].addAI(BlueRobotAI, enemyOptions);
          this.listeningEnemies++;
          break;
        case "BlueMouseAI":
          this.enemies[i].addAI(BlueMouseAI, enemyOptions);
          break;
        case "BlueStatueAI":
          this.enemies[i].addAI(BlueStatueAI, enemyOptions);
          break;
        default:
          break;
      }
    }
  }

  getName(): string {
    return this.name
  }

  setName(name: string) {
    this.name = name
  }

  setNextLvl(nextLvl: new (...args: any) => GameLevel): void {
    this.nextRoom = nextLvl;
  }

  getPlayer(): AnimatedSprite {
    return this.player;
  }

  setLblHealth(lbl: Label): void {
    this.lblHealth = lbl;
  }

  setLblTime(lbl: Label): void {
    this.lblTime = lbl;
  }
}
