import PlayerController from "../ai/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import { CoatColor, Events, Names, Statuses } from "./Constants";
import EnemyAI from "../ai/EnemyAI";
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
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import GameOver from "./GameOver";
import AttackAction from "../ai/enemy_actions/AttackAction";
import Move from "../ai/enemy_actions/Move";
import Retreat from "../ai/enemy_actions/Retreat";
import GoapAction from "../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import GoapActionPlanner from "../../Wolfie2D/AI/GoapActionPlanner";
import Map from "../../Wolfie2D/DataTypes/Map";
import Berserk from "../ai/enemy_actions/Berserk";
import ScoreTimer from "../game_system/ScoreTimer";
import Bomb from "../game_system/objects/Bomb";
import RobotAI from "../ai/RobotAI";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Layer from "../../Wolfie2D/Scene/Layer";
import MainMenu from "./MainMenu";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameLayerManager } from "../game_system/GameLayerManager";
import BlueMouseAI from "../ai/BlueMouseAI";
import { RoomEndManager } from "../game_system/RoomEndManager";

export default class GameLevel extends Scene {
  private timeLeft: number
  private player: AnimatedSprite; // Player Sprite
  private enemies: Array<AnimatedSprite>; // List of Enemies
  private bombs: Array<Bomb>; // List of Bombs
  private flags: Array<AnimatedSprite>; // List of Flags
  private walls: OrthogonalTilemap; // Wall Layer
  private graph: PositionGraph; // Nav Mesh
  private items: Array<Item>; // List of Items
  private battleManager: BattleManager;
  private lblHealth: Label;
  private lblTime: Label;
  private glm: GameLayerManager
  private scoreTimer: ScoreTimer
  private listeningEnemies: number; //number of enemies that listen for player movement events

  initScene(options: Record<string, any>): void {
    this.timeLeft = options.timeLeft
  }

  loadScene() {
    // Load the player and enemy spritesheets
    this.load.spritesheet("player1", "res/spritesheets/mcbendorjee.json");
    this.load.spritesheet("slice", "res/spritesheets/slice.json");
    this.load.spritesheet("flag", "res/spritesheets/flag.json");
    this.load.spritesheet("blueRobot", "res/spritesheets/r_blue.json");
    this.load.spritesheet("blueMouse", "res/spritesheets/rm_blue.json");
    this.load.tilemap("level", "res/tilemaps/testRoom.json"); // Load tile map
    this.load.object("weaponData", "res/data/weaponData.json"); // Load scene info
    this.load.object("navmesh", "res/data/navmesh.json"); // Load nav mesh
    this.load.object("enemyData", "res/data/enemy.json"); // Load enemy info
    this.load.object("bombData", "res/data/bombs.json"); // Load bomb info
    this.load.object("itemData", "res/data/items.json"); // Load item info
    this.load.image("healthpack", "res/sprites/healthpack.png");
    this.load.image("inventorySlot", "res/sprites/inventory.png");
    this.load.image("knife", "res/sprites/knife.png");
    this.load.image("laserGun", "res/sprites/laserGun.png");
    this.load.image("pistol", "res/sprites/pistol.png");
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

    this.glm = new GameLayerManager(this) // ***INITIALIZES PRIMARY LAYER***

    // Create the battle manager
    this.battleManager = new BattleManager();

    this.initializeWeapons();

    // Initialize the items array - this represents items that are in the game world
    this.items = new Array();

    // Create the player
    this.initializePlayer();

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

    this.glm.initHudLayer()
    this.glm.initPauseLayer()
    this.glm.initControlsLayer()
    this.glm.initRoomCompleteLayer()

    this.initScoreTimer()

    // Send the player and enemies to the battle manager
    // this.battleManager.setPlayers([<BattlerAI>this.players[0]._ai, <BattlerAI>this.players[1]._ai]);
    this.battleManager.setPlayers([<BattlerAI>this.player._ai]);
    this.battleManager.setEnemies(
      this.enemies.map((enemy) => <RobotAI>enemy._ai)
    );

    // Subscribe to relevant events
    this.receiver.subscribe("enemyDied");
    this.receiver.subscribe(Events.PLACE_FLAG);
    this.receiver.subscribe(Events.UNLOAD_ASSET);
    this.receiver.subscribe(Events.PAUSE_GAME);
    this.receiver.subscribe(Events.RESET_ROOM);
    this.receiver.subscribe(Events.SHOW_CONTROLS);
    this.receiver.subscribe(Events.EXIT_GAME);

    // Spawn items into the world
    // this.spawnItems();
  }

  initScoreTimer(): void {
    if (this.timeLeft !== undefined) {
      this.scoreTimer = new ScoreTimer(this.timeLeft, this.timesUp, false)
    } else {
      this.scoreTimer = new ScoreTimer(300_000, this.timesUp, false)
    }
    this.scoreTimer.start();
  }

  timesUp(): void {
    this.sceneManager.changeToScene(GameOver, {win: false})
  }

  handleEvent(event: GameEvent): void {
    if (event.isType(Events.PAUSE_GAME)) {
      /*
        If there are no more enemies left in the room, and you pause, the pause button will crash the game.
        I don't think we have to worry about this too much since the room is cleared when there are no more enemies.
      */
      this.glm.showPause()
    }
    if (event.isType(Events.RESET_ROOM)) {
      /*
        TODO: When the room is reset, pass the previous timer so the player can't always reset and 
          be able to get the best score on all of his/her attempt
      */
      this.sceneManager.changeToScene(GameLevel, {timeLeft: this.scoreTimer.getTimeLeftInMillis()});
    }
    if (event.isType(Events.SHOW_CONTROLS)) {
      this.glm.showControls()
    }
    if (event.isType(Events.EXIT_GAME)) {
      this.sceneManager.changeToScene(MainMenu, {})
    }
    if (event.isType("healthpack")) {
      this.createHealthpack(event.data.get("position"));
    }
    if (event.isType("enemyDied")) {
      this.enemies = this.enemies.filter(
        (enemy) => enemy !== event.data.get("enemy")
      );
      this.battleManager.enemies = this.battleManager.enemies.filter(
        (enemy) => enemy !== <RobotAI>event.data.get("enemy")._ai
      );

      if (this.battleManager.enemies.length === 0) {
        this.viewport.setZoomLevel(1);
        this.viewport.disableZoom();
        this.sceneManager.changeToScene(GameOver, {
          win: true,
          timeLeft: this.scoreTimer.getTimeLeftInSeconds(),
        });
      }
    }
    if (event.isType(Events.PLACE_FLAG)) {
      let coord = event.data.get("coordinates");
      console.log(coord.toString());
      for (let bomb of this.bombs) {
        if (bomb && bomb.tileCoord.equals(coord)) {
          //TODO Add flag sprite here
          console.log("bomb found");

          if (!bomb.isFlagged) {
            console.log("flag placed");
            bomb.setIsFlaggedTrue();
            this.flags.push(this.add.animatedSprite("flag", "primary"));
            this.flags[this.flags.length - 1].position = new Vec2(
              (coord.x + 0.5) * 16,
              (coord.y + 1.0) * 16
            );
            this.flags[this.flags.length - 1].scale = new Vec2(0.5, 0.5);
            this.flags[this.flags.length - 1].animation.play("IDLE");
          }
        }
      }
    }
    if (event.isType(Events.UNLOAD_ASSET)) {
      let asset = this.sceneGraph.getNode(event.data.get("node"));
      asset.destroy();
    }
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent())
    }

    //handleCollisions for
    for (let enemy of this.enemies) {
      if (enemy && enemy.sweptRect) {
        if (this.player.sweptRect.overlaps(enemy.sweptRect)) {
          console.log("enemy hit player");
          (<PlayerController>this.player._ai).damage(
            (<RobotAI>enemy._ai).damage
          );
        }
        for (let bomb of this.bombs) {
          if (bomb && !bomb.isDestroyed) {
            if (enemy.sweptRect.overlaps(bomb.collisionBoundary)) {
              if ((<RobotAI>enemy._ai).listening) this.listeningEnemies--;
              enemy.destroy();
              this.enemies = this.enemies.filter(
                (currentEnemy) => currentEnemy !== enemy
              );
              this.battleManager.enemies = this.battleManager.enemies.filter(
                (currentEnemy) => currentEnemy !== enemy._ai
              );
              //TODO ADD BOMB EXPLOSION SPRITE AND REMOVE ANY FLAG SPRITE THAT HAS BEEN PLACED
              bomb.setIsDestroyedTrue();
            }
          }
        }
      }
    }
    //tell the playerAi no more enemies listening for events are left so it stops fireing movement events
    if (this.listeningEnemies === 0)
      (<PlayerController>this.player._ai).noMoreEnemies();

    // checks to see how close player is to bomb
    // changers sprite closer player gets to bom
    // gameover if player lands on bomb

    for (let bomb of this.bombs) {
      if (bomb && !bomb.isDestroyed) {
        if (this.player.collisionShape.overlaps(bomb.collisionBoundary)) {
          (<PlayerController>this.player._ai).health = 0;
        } else if (this.player.collisionShape.overlaps(bomb.innerBoundary)) {
          (<PlayerController>this.player._ai).setCoatColor(CoatColor.RED);
        } else if (this.player.collisionShape.overlaps(bomb.middleBoundary)) {
          (<PlayerController>this.player._ai).setCoatColor(CoatColor.BLUE);
        } else if (this.player.collisionShape.overlaps(bomb.outerBoundary)) {
          (<PlayerController>this.player._ai).setCoatColor(CoatColor.GREEN);
        } else
          (<PlayerController>this.player._ai).setCoatColor(CoatColor.WHITE);
      }
    }

    // check health of each player
    let health = (<BattlerAI>this.player._ai).health;

    //If both are dead, game over
    if (health <= 0) {
      this.viewport.setZoomLevel(1);
      this.viewport.disableZoom();
      this.sceneManager.changeToScene(GameOver, { win: false });
    }

    // Update health gui
    this.lblHealth.text = `HP: ${health}`;
    this.lblTime.text = `${this.scoreTimer.toString()}`;

    // Debug mode graph
    if (Input.isKeyJustPressed("g")) {
      this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
    }
    if (Input.isJustPressed('pause')) {
      this.emitter.fireEvent(Events.PAUSE_GAME, {})
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
    let inventory = new InventoryManager(this, 2, "inventorySlot", new Vec2(16, 16), 4, "slots1", "items1")
    let startingWeapon = this.createWeapon("knife");
    inventory.addItem(startingWeapon);
    // Create the players
    // this.players = Array(2);
    this.player = this.add.animatedSprite("player1", "primary");
    this.player.position.set(128, 128);
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

  initializeBombs() {
    // Get the bomb data
    const bombData = this.load.getObject("bombData");

    // Create an array of the bombdata and flags
    this.bombs = new Array(bombData.numBombs);
    this.flags = new Array(bombData.numBombs);

    console.log(bombData);

    for (let bomb of bombData.bombs) {
      this.bombs.push(new Bomb(new Vec2(bomb.position[0], bomb.position[1])));
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
        entity.position[0] / 2,
        entity.position[1] / 2
      );
      this.enemies[i].animation.play("IDLE");

      // Activate physics
      this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(9, 9)));

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
        default:
          break;
      }
    }
  }

  getPlayer(): AnimatedSprite {
    return this.player
  }

  setLblHealth(lbl: Label): void {
    this.lblHealth = lbl
  }

  setLblTime(lbl: Label): void {
    this.lblTime = lbl
  }
}
