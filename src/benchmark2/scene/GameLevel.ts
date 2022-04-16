import PlayerController from "../ai/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import { Control, Events, Names, RobotAction } from "./Constants";
import BattlerAI from "../ai/BattlerAI";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Input from "../../Wolfie2D/Input/Input";
import GameOver from "./GameOver";
import ScoreTimer from "../game_system/ScoreTimer";
import MainMenu from "./MainMenu";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameLayerManager } from "../game_system/GameLayerManager";
import Timer from "../../Wolfie2D/Timing/Timer";
import EntityManager from "../game_system/EntityManager";

export default abstract class GameLevel extends Scene {
  private name: string;
  private currentScore: number;
  private timeLeft: number;
  private walls: OrthogonalTilemap; // Wall Layer
  private graph: PositionGraph; // Nav Mesh
  private lblHealth: Label;
  private lblTime: Label;
  private glm: GameLayerManager;
  private em: EntityManager;
  private scoreTimer: ScoreTimer;
  private gameOver: boolean;
  private currentRoom: new (...args: any) => GameLevel;
  private nextRoom: new (...args: any) => GameLevel;

  // Create an object pool for our projectives
  private MAX_PROJECTILE_SIZE = 5;
  private projectiles: Array<AnimatedSprite> = new Array(
    this.MAX_PROJECTILE_SIZE
  );

  //this will be loaded in every single level, allows level classes to be abstracted out
  loadMainResources(): void {
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
    this.load.audio('rs_freeze', 'res/sound/rs_freeze.wav')
    this.load.audio('rm_freeze', 'res/sound/rm_freeze.wav')
    this.load.audio('r_freeze', 'res/sound/r_freeze.wav')
    this.load.audio('flag_place', 'res/sound/flag_place.wav')
    this.load.audio('damage', 'res/sound/damage.wav')
  }

  loadLevelFromFolder(levelName: string): void {
    // let items = fs.readdirSync(levelName);
    // console.log(items);
    // fs.readdirSync("res/" + levelName).forEach((file) => {
    //   console.log(file);
    // });
  }

  //allows for randomization of bomb layout
  loadRandomBombsJSON(pathArray: string[]): void {
    this.load.object(
      "bombData",
      pathArray[Math.floor(Math.random() * pathArray.length)]
    );
  }

  //allows for randomization of enemy layout
  loadRandomEnemysJSON(pathArray: string[]): void {
    this.load.object(
      "enemyData",
      pathArray[Math.floor(Math.random() * pathArray.length)]
    );
  }

  //allows for randomization of block layout
  loadRandomBlocksJSON(pathArray: string[]): void {
    this.load.object(
      "blockData",
      pathArray[Math.floor(Math.random() * pathArray.length)]
    );
  }

  //allows for randomization of player start and level end positions
  loadRandomStartEndJSON(pathArray: string[]): void {
    this.load.object(
      "start_end",
      pathArray[Math.floor(Math.random() * pathArray.length)]
    );
  }

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

    this.em = new EntityManager(this);

    // this.initializeWeapons();
    this.em.initWeapons();

    // Create the player
    this.em.initPlayer();

    // Place the end level flag
    this.em.initGreenFlag();

    // Make the viewport follow the player
    this.viewport.follow(this.em.getPlayer());

    // Create the navmesh
    this.createNavmesh();

    //initialize the number of enemies listening for player movement to 0

    // Initialize all enemies
    this.em.initEnemies();

    // Initalize all bombs
    this.em.initBombs();

    // Initaize all blocks
    this.em.initBlocks();

    // Initialize projectiles
    this.em.initProjectiles();
    this.glm.initHudLayer();
    this.glm.initPauseLayer();
    this.glm.initControlsLayer();
    this.glm.initRoomCompleteLayer();

    this.gameOver = false;
    this.nextRoom = null;
    this.em.initBattleManager();

    // Subscribe to relevant events
    this.receiver.subscribe("enemyDied");
    this.receiver.subscribe(RobotAction.FIRE_PROJECTILE);
    this.receiver.subscribe(Events.PLACE_FLAG);
    this.receiver.subscribe(Events.UNLOAD_ASSET);
    this.receiver.subscribe(Events.PAUSE_GAME);
    this.receiver.subscribe(Events.RESET_ROOM);
    this.receiver.subscribe(Events.SHOW_CONTROLS);
    this.receiver.subscribe(Events.EXIT_GAME);
    this.receiver.subscribe(Events.LEVEL_END);
    this.receiver.subscribe(Events.ROOM_COMPLETE);
    this.receiver.subscribe(Events.PLAYER_DIED)

    this.initScoreTimer();
    this.glm.showFadeOut();
  }

  initScoreTimer(): void {
    let aux = () => (<PlayerController> this.em.getPlayer()._ai).kill()
    if (this.timeLeft !== undefined) {
      this.scoreTimer = new ScoreTimer(this.timeLeft, aux, false);
    } else {
      this.scoreTimer = new ScoreTimer(300_000, aux, false);
    }
    this.scoreTimer.start();
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
          currentScore: this.currentScore,
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
        new Timer(
          3000,
          () => {
            this.glm.showFadeIn();
          },
          false
        ).start();
        break;
      case Events.LEVEL_END:
        this.viewport.setZoomLevel(1);
        this.sceneManager.changeToScene(GameOver, {
          win: true,
          currentScore: this.currentScore,
          timeLeft: this.scoreTimer.getTimeLeftInSeconds(),
          nextLvl: this.nextRoom,
        });
        break;
      case Events.PLAYER_DIED:
        this.glm.showFadeIn()
        new Timer(1000, () => {
          this.glm.hideAllAndZoomOut()
          this.sceneManager.changeToScene(GameOver, { win: false, currentScore: this.currentScore });
        }, false).start()
                
        break;
      case Events.PLACE_FLAG:
        this.em.placeFlag(event.data.get("flagPlaceHitBox"));
        break;
      case RobotAction.FIRE_PROJECTILE:
        this.em.spawnProjectile(
          event.data.get("position"),
          event.data.get("velocity")
        );
        break;
      case Events.PROJECTILE_UNLOAD:
        this.sceneGraph.getNode(event.data.get("id")).visible = false;
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

    this.em.handleEnemyCollisions()
    this.em.handleCollidables(deltaT)

    if (this.em.playerReachedGoal()) {
      if (!this.gameOver) {
        this.scoreTimer.pause();
        this.glm.showRoomComplete();
      }
      this.gameOver = true;
    }

    this.em.handlePlayerCoatColor();
    this.em.handleBlockCollision(deltaT);

    if ((<PlayerController>this.em.getPlayer()._ai).nearBomb) {
      this.em.handlePlayerBombCollision();
    }
    this.em.handleProjectileCollision();
    this.updateHUD();
    this.handleInput();
  }

  updateHUD(): void {
    let health = (<BattlerAI>this.em.getPlayer()._ai).health;
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
    if (!this.gameOver) {
      if (Input.isJustPressed(Control.PAUSE)) {
        this.emitter.fireEvent(Events.PAUSE_GAME, {});
      }
    }
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

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  setNextLvl(nextLvl: new (...args: any) => GameLevel): void {
    this.nextRoom = nextLvl;
  }

  getPlayer(): AnimatedSprite {
    return this.em.getPlayer();
  }

  setLblHealth(lbl: Label): void {
    this.lblHealth = lbl;
  }

  setLblTime(lbl: Label): void {
    this.lblTime = lbl;
  }
}
