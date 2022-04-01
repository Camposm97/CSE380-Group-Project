import PlayerController from "../ai/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import { Events, Names, Statuses } from "./Constants";
import EnemyAI from "../ai/EnemyAI";
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

export default class GameLevel extends Scene {
  // The player
  // private players: Array<AnimatedSprite>;
  private player: AnimatedSprite;

  // A list of enemies
  private enemies: Array<AnimatedSprite>;

  // A list of bombs
  private bombs: Array<Bomb>;

  // The wall layer of the tilemap to use for bullet visualization
  private walls: OrthogonalTilemap;

  // The position graph for the navmesh
  private graph: PositionGraph;

  // A list of items in the scene
  private items: Array<Item>;

  // The battle manager for the scene
  private battleManager: BattleManager;

  // Player health
  private healthDisplays: Array<Label>;
  private lblTime: Label;

  private scoreTimer: ScoreTimer;

  loadScene() {
    // Load the player and enemy spritesheets
    this.load.spritesheet("player1", "res/spritesheets/professor.json");
    this.load.spritesheet("player2", "res/spritesheets/professor.json");

    this.load.spritesheet("gun_enemy", "res/spritesheets/gun_enemy.json");
    this.load.spritesheet("knife_enemy", "res/spritesheets/knife_enemy.json");
    this.load.spritesheet(
      "custom_enemy1",
      "res/spritesheets/custom_enemy1.json"
    );
    this.load.spritesheet(
      "custom_enemy2",
      "res/spritesheets/custom_enemy2.json"
    );

    this.load.spritesheet("slice", "res/spritesheets/slice.json");
    this.load.spritesheet("flag", "res/spritesheets/flag.json");

    // Load the tilemap
    // Change this file to be your own tilemap
    this.load.tilemap("level", "res/tilemaps/testRoom.json"); // Load my tile map

    // Load the scene info
    this.load.object("weaponData", "res/data/weaponData.json");

    // Load the nav mesh
    this.load.object("navmesh", "res/data/navmesh.json");

    // Load in the enemy info
    this.load.object("enemyData", "res/data/enemy.json");

    // Load in the bomb info
    this.load.object("bombData", "res/data/bombs.json");

    // Load in item info
    this.load.object("itemData", "res/data/items.json");

    // Load the healthpack sprite
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

    this.addLayer("primary", 10);

    // Create the battle manager
    this.battleManager = new BattleManager();

    this.initializeWeapons();

    // Initialize the items array - this represents items that are in the game world
    this.items = new Array();

    // Create the player
    this.initializePlayer();

    // Make the viewport follow the player
    // this.viewport.follow(this.players[0]);
    this.viewport.follow(this.player);

    // Zoom in to a reasonable level
    // this.viewport.enableZoom(); // Disable Zoom
    this.viewport.setZoomLevel(3);

    // Create the navmesh
    this.createNavmesh();

    // Initialize all enemies
    this.initializeEnemies();

    // Initalize all bombs
    this.initializeBombs();

    // Send the player and enemies to the battle manager
    // this.battleManager.setPlayers([<BattlerAI>this.players[0]._ai, <BattlerAI>this.players[1]._ai]);
    this.battleManager.setPlayers([<BattlerAI>this.player._ai]);
    this.battleManager.setEnemies(
      this.enemies.map((enemy) => <BattlerAI>enemy._ai)
    );

    // Subscribe to relevant events
    this.receiver.subscribe("healthpack");
    this.receiver.subscribe("enemyDied");
    this.receiver.subscribe(Events.UNLOAD_ASSET);

    // Spawn items into the world
    this.spawnItems();

    // Add a UI for health
    this.addUILayer("health");

    this.healthDisplays = new Array(2);
    this.healthDisplays[0] = <Label>this.add.uiElement(
      UIElementType.LABEL,
      "health",
      // {position: new Vec2(70, 16), text: "Health: " + (<BattlerAI>this.players[0]._ai).health});
      {
        position: new Vec2(70, 20),
        text: "HP: " + (<BattlerAI>this.player._ai).health,
      }
    );
    this.healthDisplays[0].textColor = Color.WHITE;

    // this.healthDisplays[1] = <Label>this.add.uiElement(UIElementType.LABEL, "health",
    //     {position: new Vec2(70, 32), text: "Health: " + (<BattlerAI>this.players[1]._ai).health});
    // this.healthDisplays[1].textColor = Color.WHITE;

    this.lblTime = <Label>this.add.uiElement(UIElementType.LABEL, "health", {
      position: new Vec2(350, 15),
      text: "",
    });
    this.lblTime.textColor = Color.WHITE;

    this.scoreTimer = new ScoreTimer(
      300_000,
      () => {
        this.sceneManager.changeToScene(GameOver, { win: false });
      },
      false
    );
    this.scoreTimer.start();
  }

  updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      let event = this.receiver.getNextEvent();

      if (event.isType("healthpack")) {
        this.createHealthpack(event.data.get("position"));
      }
      if (event.isType("enemyDied")) {
        this.enemies = this.enemies.filter(
          (enemy) => enemy !== event.data.get("enemy")
        );
        this.battleManager.enemies = this.battleManager.enemies.filter(
          (enemy) => enemy !== <BattlerAI>event.data.get("enemy")._ai
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
      if (event.isType(Events.UNLOAD_ASSET)) {
        let asset = this.sceneGraph.getNode(event.data.get("node"));
        asset.destroy();
      }
    }

    // checks to see how close player is to bomb
    // changers sprite closer player gets to bom
    // gameover if player lands on bomb

    for (let bomb of this.bombs) {
      if (bomb) {
        if (this.player.collisionShape.overlaps(bomb.collisionBoundary)) {
          console.log("boom");
          (<PlayerController>this.player._ai).health = 0;
        } else if (this.player.collisionShape.overlaps(bomb.innerBoundary)) {
          console.log("1");
        } else if (this.player.collisionShape.overlaps(bomb.middleBoundary)) {
          console.log("2");
        } else if (this.player.collisionShape.overlaps(bomb.outerBoundary)) {
          console.log("3");
        }
      }
    }

    // check health of each player
    let health = (<BattlerAI>this.player._ai).health;
    // let health1 = (<BattlerAI>this.players[0]._ai).health;
    // let health2 = (<BattlerAI>this.players[1]._ai).health;

    //If both are dead, game over
    // if(health1 <= 0 && health2 <= 0){
    if (health <= 0) {
      this.viewport.setZoomLevel(1);
      this.viewport.disableZoom();
      this.sceneManager.changeToScene(GameOver, { win: false });
    }

    // update closest enemy of each player
    let closetEnemy1 = this.getClosestEnemy(
      this.player.position,
      (<PlayerController>this.player._ai).range
    );
    // let closetEnemy2 = this.getClosestEnemy(this.players[1].position, (<PlayerController>this.players[1]._ai).range);

    (<PlayerController>this.player._ai).target = closetEnemy1;
    // (<PlayerController>this.players[1]._ai).target = closetEnemy2;

    // Update health gui
    this.healthDisplays[0].text = "Health: " + health;
    // this.healthDisplays[1].text = "Health: " + health2;
    this.lblTime.text = `${this.scoreTimer.toString()}`;

    // Debug mode graph
    if (Input.isKeyJustPressed("g")) {
      this.getLayer("graph").setHidden(!this.getLayer("graph").isHidden());
    }

    // //Swap characters
    // if(Input.isKeyJustPressed("z")){
    //     this.emitter.fireEvent(Events.SWAP_PLAYER, {id: this.players[0].id});
    //     this.viewport.follow(this.players[0]);
    // }
    // // Swap characters
    // if(Input.isKeyJustPressed("x")){
    //     this.emitter.fireEvent(Events.SWAP_PLAYER, {id: this.players[1].id});
    //     this.viewport.follow(this.players[1]);
    // }
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
    this.player.position.set(4 * 16, 32 * 16);
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

    // inventory = new InventoryManager(this, 2, "inventorySlot", new Vec2(16, 32), 4, "slots2", "items2");
    // startingWeapon = this.createWeapon("weak_pistol");
    // inventory.addItem(startingWeapon);

    //Second player is ranged based, long range and starts with pistol
    // this.players[1] = this.add.animatedSprite("player2", "primary");
    // this.players[1].position.set(5*16, 4*16);
    // this.players[1].addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    // this.players[1].addAI(PlayerController,
    //     {
    //         speed: 100,
    //         health: 15,
    //         inventory: inventory,
    //         items: this.items,
    //         inputEnabled: false,
    //         range: 100,
    //         tilemap: 'Floor'
    //     });
    // this.players[1].animation.play("IDLE");

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

    // Create an array of the bombdata
    this.bombs = new Array(bombData.numBombs);

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

    let actionsGun = [
      new Retreat(
        1,
        [Statuses.LOW_HEALTH, Statuses.CAN_RETREAT],
        [Statuses.REACHED_GOAL],
        { retreatDistance: 150 }
      ),
      new Berserk(
        2,
        [Statuses.LOW_HEALTH, Statuses.CAN_BERSERK],
        [Statuses.REACHED_GOAL],
        {}
      ),
      new AttackAction(4, [Statuses.IN_RANGE], [Statuses.REACHED_GOAL]),
      new Move(3, [], [Statuses.IN_RANGE], { inRange: 100 }),
    ];
    let actionsKnife = [
      new Berserk(
        1,
        [Statuses.LOW_HEALTH, Statuses.CAN_BERSERK],
        [Statuses.REACHED_GOAL],
        {}
      ),
      new Move(2, [], [Statuses.IN_RANGE], { inRange: 20 }),
      new AttackAction(3, [Statuses.IN_RANGE], [Statuses.REACHED_GOAL]),
      new Retreat(
        4,
        [Statuses.LOW_HEALTH, Statuses.CAN_RETREAT],
        [Statuses.REACHED_GOAL],
        { retreatDistance: 150 }
      ),
    ];
    let actionsCustom1 = [
      new AttackAction(1, [Statuses.IN_RANGE], [Statuses.REACHED_GOAL]),
      new Move(2, [], [Statuses.IN_RANGE], { inRange: 100 }),
      new Retreat(
        3,
        [Statuses.LOW_HEALTH, Statuses.CAN_RETREAT],
        [Statuses.REACHED_GOAL],
        { retreatDistance: 150 }
      ),
      new Berserk(4, [Statuses.CAN_BERSERK], [Statuses.REACHED_GOAL], {}),
    ];
    let actionsCustom2 = [
      new Berserk(1, [Statuses.CAN_BERSERK], [Statuses.REACHED_GOAL], {}),
      new Retreat(
        2,
        [Statuses.LOW_HEALTH, Statuses.CAN_RETREAT],
        [Statuses.REACHED_GOAL],
        { retreatDistance: 150 }
      ),
      new AttackAction(3, [Statuses.IN_RANGE], [Statuses.REACHED_GOAL]),
      new Move(4, [], [Statuses.IN_RANGE], { inRange: 100 }),
    ];

    let gunPlans = this.generateGoapPlans(
      actionsGun,
      [
        Statuses.IN_RANGE,
        Statuses.LOW_HEALTH,
        Statuses.CAN_BERSERK,
        Statuses.CAN_RETREAT,
      ],
      Statuses.REACHED_GOAL
    );
    let knifePlans = this.generateGoapPlans(
      actionsKnife,
      [
        Statuses.IN_RANGE,
        Statuses.LOW_HEALTH,
        Statuses.CAN_BERSERK,
        Statuses.CAN_RETREAT,
      ],
      Statuses.REACHED_GOAL
    );
    let customPlans1 = this.generateGoapPlans(
      actionsCustom1,
      [
        Statuses.IN_RANGE,
        Statuses.LOW_HEALTH,
        Statuses.CAN_BERSERK,
        Statuses.CAN_RETREAT,
      ],
      Statuses.REACHED_GOAL
    );
    let customPlans2 = this.generateGoapPlans(
      actionsCustom2,
      [
        Statuses.IN_RANGE,
        Statuses.LOW_HEALTH,
        Statuses.CAN_BERSERK,
        Statuses.CAN_RETREAT,
      ],
      Statuses.REACHED_GOAL
    );
    this.testGoapPlans(gunPlans, knifePlans, customPlans1, customPlans2);

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
      this.enemies[i].addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

      if (entity.route) {
        entity.route = entity.route.map((index: number) =>
          this.graph.getNodePosition(index)
        );
      }

      if (entity.guardPosition) {
        entity.guardPosition = new Vec2(
          entity.guardPosition[0] / 2,
          entity.guardPosition[1] / 2
        );
      }

      /*initalize status and actions for each enemy. This can be edited if you want your custom enemies to start out with
            different statuses, but dont remove these statuses for the original two enemies*/
      let statusArray: Array<string> = [
        Statuses.CAN_RETREAT,
        Statuses.CAN_BERSERK,
      ];

      //Vary weapon type and choose actions
      let weapon;
      let actions;
      let range;

      switch (entity.type) {
        case "gun_enemy":
          weapon = this.createWeapon("weak_pistol");
          actions = actionsGun;
          range = 100;
          break;
        case "knife_enemy":
          weapon = this.createWeapon("knife");
          actions = actionsKnife;
          range = 20;
          break;
        case "custom_enemy1": // ADD CODE HERE
          weapon = this.createWeapon("laserGun");
          actions = actionsCustom1;
          range = 100;
          break;
        case "custom_enemy2": // ADD CODE HERE
          weapon = this.createWeapon("pistol");
          actions = actionsCustom2;
          range = 500;
          break;
      }

      let enemyOptions = {
        defaultMode: entity.mode,
        patrolRoute: entity.route, // This only matters if they're a patroller
        guardPosition: entity.guardPosition, // This only matters if they're a guard
        health: entity.health,
        player1: this.player,
        // player2: this.players[1],
        weapon: weapon,
        goal: Statuses.REACHED_GOAL,
        status: statusArray,
        actions: actions,
        inRange: range,
      };

      this.enemies[i].addAI(EnemyAI, enemyOptions);
    }
  }

  powerset(array: Array<string>): Array<Array<string>> {
    return array.reduce((a, v) => a.concat(a.map((r) => [v].concat(r))), [[]]);
  }

  /**
   * This function takes all possible actions and all possible statuses, and generates a list of all possible combinations and statuses
   * and the actions that are taken when run through the GoapActionPlanner.
   */
  generateGoapPlans(
    actions: Array<GoapAction>,
    statuses: Array<string>,
    goal: string
  ): string {
    let planner = new GoapActionPlanner();
    // Get all possible status combinations
    let statusComboinations = this.powerset(statuses);
    let map = new Map<String>();
    //console.log(statusComboinations.toString());

    for (let s of statusComboinations) {
      // Get plan
      let plan = planner.plan(goal, actions, s, null);
      let givenStatuses = "Given: ";
      s.forEach((v) => (givenStatuses = givenStatuses + v + ", "));

      map.add(givenStatuses, plan.toString());
    }

    return map.toString();
  }

  /**
   * Use this function to test and verify that your created plans are correct. Note that you should only start using this function once you're ready to
   * test your berserk action for the existing gun and knife enemies. Your custom enemies can be added whenever they're ready,
   * your tests will pass if you leave the arguments for both null.
   */
  testGoapPlans(
    gunPlans: string,
    knifePlans: string,
    customPlan1: string,
    customPlan2: string
  ) {
    let expectedKnifeResult =
      `Given:  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: LOW_HEALTH,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: LOW_HEALTH, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_BERSERK,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_BERSERK, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_BERSERK, LOW_HEALTH,  -> Top -> (Berserk)\n` +
      `Given: CAN_BERSERK, LOW_HEALTH, IN_RANGE,  -> Top -> (Berserk)\n` +
      `Given: CAN_RETREAT,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_RETREAT, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, LOW_HEALTH,  -> Top -> (Retreat)\n` +
      `Given: CAN_RETREAT, LOW_HEALTH, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, LOW_HEALTH,  -> Top -> (Berserk)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, LOW_HEALTH, IN_RANGE,  -> Top -> (Berserk)\n`;

    let expectedGunResult =
      `Given:  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: LOW_HEALTH,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: LOW_HEALTH, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_BERSERK,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_BERSERK, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_BERSERK, LOW_HEALTH,  -> Top -> (Berserk)\n` +
      `Given: CAN_BERSERK, LOW_HEALTH, IN_RANGE,  -> Top -> (Berserk)\n` +
      `Given: CAN_RETREAT,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_RETREAT, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, LOW_HEALTH,  -> Top -> (Retreat)\n` +
      `Given: CAN_RETREAT, LOW_HEALTH, IN_RANGE,  -> Top -> (Retreat)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK,  -> Top -> (Move) -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, IN_RANGE,  -> Top -> (AttackAction)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, LOW_HEALTH,  -> Top -> (Retreat)\n` +
      `Given: CAN_RETREAT, CAN_BERSERK, LOW_HEALTH, IN_RANGE,  -> Top -> (Retreat)\n`;

    console.assert(gunPlans === expectedGunResult, {
      errorMsg:
        "Your created gun enemy plan does not match the expected behavior patterns",
    });

    console.assert(knifePlans === expectedKnifeResult, {
      errorMsg:
        "Your created knife enemy plan does not match the expected behavior patterns",
    });

    if (customPlan1 !== null) {
      console.assert(customPlan1 !== expectedGunResult, {
        errorMsg:
          "Your first custom plan has the same behavior as the gun enemy",
      });
      console.assert(customPlan1 !== expectedKnifeResult, {
        errorMsg:
          "Your first custom plan has the same behavior as the knife enemy",
      });
    }

    if (customPlan2 !== null) {
      console.assert(customPlan2 !== expectedGunResult, {
        errorMsg:
          "Your second custom plan has the same behavior as the gun enemy",
      });
      console.assert(customPlan2 !== expectedKnifeResult, {
        errorMsg:
          "Your second custom plan has the same behavior as the knife enemy",
      });
      if (customPlan1 !== null)
        console.assert(customPlan2 !== customPlan1, {
          errorMsg: "Both of your custom plans have the same behavior",
        });
    }
  }
}
