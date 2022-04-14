import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import BlueMouseAI from "../ai/BlueMouseAI";
import BlueRobotAI from "../ai/BlueRobotAI";
import BlueStatueAI from "../ai/BlueStatueAI";
import PlayerController from "../ai/PlayerController";
import ProjectileAI from "../ai/ProjectileAI";
import RobotAI from "../ai/RobotAI";
import { CoatColor, Events } from "../scene/Constants";
import GameLevel from "../scene/GameLevel";
import BattleManager from "./BattleManager";
import InventoryManager from "./InventoryManager";
import Healthpack from "./items/Healthpack";
import Item from "./items/Item";
import Weapon from "./items/Weapon";
import WeaponType from "./items/weapon_types/WeaponType";
import Block from "./objects/Block";
import Bomb from "./objects/Bomb";

export default class EntityManager {
  private scene: GameLevel;
  private player: AnimatedSprite;
  private enemies: Array<AnimatedSprite>;
  private bombs: Array<Bomb>;
  private blocks: Array<Block>;
  private flags: Array<AnimatedSprite>;
  private items: Array<Item>;
  private projectiles: Array<AnimatedSprite>;
  private greenFlag: AnimatedSprite;
  private nearestBomb: Bomb; //for detecting how close the player is to the nearest bomb
  private bm: BattleManager;
  private enemiesLeft: number;
  private emitter: Emitter;
  private MAX_BULLETS_SIZE = 5;

  constructor(scene: GameLevel) {
    this.scene = scene;
    this.items = new Array();
    this.emitter = new Emitter();
    this.bm = new BattleManager();
  }

  initGreenFlag(): void {
    this.greenFlag = this.scene.add.animatedSprite("greenFlag", "primary");
    let coord = this.scene.load.getObject("start_end").greenFlagPos;
    this.greenFlag.position = new Vec2(
      (coord[0] - 0.5) * 16,
      (coord[1] - 1.0) * 16
    );
    this.greenFlag.scale = new Vec2(1.0, 1.0);
    this.greenFlag.animation.play("IDLE");
    this.greenFlag.collisionShape = new AABB(
      this.greenFlag.position,
      new Vec2(0.8, 0.8)
    );
  }

  initWeapons(): void {
    let data = this.scene.load.getObject("weaponData");

    for (let i = 0; i < data.numWeapons; i++) {
      let x = data.weapons[i];
      let constr = RegistryManager.getRegistry("weaponTemplates").get(
        x.weaponType
      );
      let weaponType = new constr();
      weaponType.initialize(x);
      RegistryManager.getRegistry("weaponTypes").registerItem(
        x.name,
        weaponType
      );
    }
  }

  initWeapon(type: string): Weapon {
    let weaponType = <WeaponType>(
      RegistryManager.getRegistry("weaponTypes").get(type)
    );
    let sprite = this.scene.add.sprite(weaponType.spriteKey, "primary");
    return new Weapon(sprite, weaponType, this.bm);
  }

  initHealthpack(v: Vec2): void {
    let sprite = this.scene.add.sprite("healthpack", "primary");
    let healthpack = new Healthpack(sprite);
    healthpack.moveSprite(v);
    this.items.push(healthpack);
  }

  initItems(): void {
    // Get the item data
    let itemData = this.scene.load.getObject("itemData");

    for (let item of itemData.items) {
      if (item.type === "healthpack") {
        // Create a healthpack
        this.initHealthpack(
          new Vec2(item.position[0] / 2, item.position[1] / 2)
        );
      } else {
        // item.type is "weapon"
        let weapon = this.initWeapon(item.weaponType);
        weapon.moveSprite(new Vec2(item.position[0] / 2, item.position[1] / 2));
        this.items.push(weapon);
      }
    }
  }

  initPlayer(): void {
    let inv = new InventoryManager(
      this.scene,
      2,
      "inventorySlot",
      new Vec2(16, 16),
      4,
      "slots1",
      "items1"
    );
    let startingWeapon = this.initWeapon("knife");
    inv.addItem(startingWeapon);

    this.player = this.scene.add.animatedSprite("player1", "primary");
    let coord = this.scene.load.getObject("start_end").playerStartPos;
    this.player.position = new Vec2((coord[0] - 0.5) * 16, (coord[1] - 1) * 16);
    this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
    this.player.addAI(PlayerController, {
      speed: 100,
      health: 5,
      inventory: inv,
      items: this.items,
      inputEnabled: true,
      range: 75,
      tilemap: "Floor",
    });
    this.player.animation.play("IDLE_WHITE");
    (<PlayerController>this.player._ai).inventory.setActive(true);
  }

  initBlocks(): void {
    // Get the block data
    const blockData = this.scene.load.getObject("blockData");

    // Create an array of the blockdata
    this.blocks = new Array(blockData.numBlocks);

    for (let i = 0; i < blockData.numBlocks; i++) {
      let blockSprite = this.scene.add.sprite("block", "primary");
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

  initBombs(): void {
    // Get the bomb data
    const bombData = this.scene.load.getObject("bombData");

    // Create an array of the bombdata and flags
    this.bombs = new Array(bombData.numBombs);
    // this.flags = new Array(bombData.numBombs);

    for (let i = 0; i < bombData.numBombs; i++) {
      let bombSprite = this.scene.add.animatedSprite("bomb", "primary");
      let flagSprite = this.scene.add.animatedSprite("flag", "primary");
      this.bombs[i] = new Bomb(
        new Vec2(
          bombData.bombs[i].position[0] - 1,
          bombData.bombs[i].position[1] - 1
        ),
        bombSprite,
        flagSprite
      );
      this.bombs[i].hide();
    }
  }

  initEnemies(): void {
    // Get the enemy data
    const enemyData = this.scene.load.getObject("enemyData");

    // Create an enemies array
    this.enemies = new Array(enemyData.numEnemies);

    // Initialize the enemies
    for (let i = 0; i < enemyData.numEnemies; i++) {
      let entity = enemyData.enemies[i];
      // Create an enemy
      this.enemies[i] = this.scene.add.animatedSprite(entity.type, "primary");
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
          // this.listeningEnemies++;
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

  initProjectiles(): void {
    this.projectiles = new Array(this.MAX_BULLETS_SIZE);
    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i] = this.scene.add.animatedSprite(
        "projectile",
        "primary"
      );

      this.projectiles[i].visible = false;

      // Add AI to our projectile
      this.projectiles[i].addAI(ProjectileAI, { velocity: new Vec2(0, 0) });
    }
  }

  spawnProjectile(position: Vec2, velocity: Vec2): void {
    // Find the first viable bullet
    let projectile: AnimatedSprite = null;

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
      projectile.position = position;
      projectile.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));
      (<ProjectileAI>projectile._ai).activate(velocity);
      projectile.animation.play("IDLE");
    }
  }

  initBattleManager(): void {
    this.bm.setPlayers([<PlayerController>this.player._ai]);
    this.bm.setEnemies(this.enemies.map((enemy) => <RobotAI>enemy._ai));
    this.bm.setBlocks(this.blocks);
  }

  handleCollisions(): void {
    for (let enemy of this.enemies) {
      if (enemy && enemy.sweptRect) {
        if (this.player.sweptRect.overlaps(enemy.sweptRect)) {
          let r = <RobotAI> enemy._ai
          if (!r.isFrozen) {
            (<PlayerController>this.player._ai).damage(
              (<RobotAI>enemy._ai).damage
            );
          }
        }
      }
      for (let bomb of this.bombs) {
        if (bomb && !bomb.isDestroyed) {
          if (
            enemy &&
            enemy.sweptRect &&
            enemy.sweptRect.overlaps(bomb.collisionBoundary)
          ) {
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
            this.bm.enemies = this.bm.enemies.filter(
              (currentEnemy) => currentEnemy !== enemy._ai
            );
            //TODO REMOVE ANY FLAG SPRITE THAT HAS BEEN PLACED
            bomb.setIsDestroyedTrue();
          }
        }
      }
    }
  }

  mouseCollision(deltaT: number): void {
    for (let enemy of this.enemies) {
      if (enemy._ai instanceof BlueMouseAI) {
        console.log('i find mouse')
        let bm = <BlueMouseAI> enemy._ai
        if (bm.owner.sweptRect.overlaps(this.player.sweptRect)) {
          let v = new Vec2(
            ((<PlayerController>this.player._ai).speed / 2) *
              (<PlayerController>this.player._ai).lookDirection.x,
            ((<PlayerController>this.player._ai).speed / 2) *
              (<PlayerController>this.player._ai).lookDirection.y *
              -1
          );
          v.scale(deltaT)
          bm.push(v)
        }
      }
    }
  }

  blockCollision(deltaT: number): void {
    for (let block of this.blocks) {
      if (block.owner.sweptRect.overlaps(this.player.sweptRect)) {
        let blockVec = new Vec2(
          ((<PlayerController>this.player._ai).speed / 2) *
            (<PlayerController>this.player._ai).lookDirection.x,
          ((<PlayerController>this.player._ai).speed / 2) *
            (<PlayerController>this.player._ai).lookDirection.y *
            -1
        );
        blockVec.scale(deltaT);
        block.push(blockVec);
      }
    }
  }

  placeFlag(flagPlaceHitBox: AABB): void {
    for (let bomb of this.bombs) {
      if (bomb && flagPlaceHitBox.overlaps(bomb.collisionBoundary)) {
        if (!bomb.isFlagged || !bomb.isDestroyed) {
          bomb.setIsFlaggedTrue();
        }
      }
    }
  }

  projectileCollision(): void {
    for (let i = 0; i < this.projectiles.length; i++) {
      if (this.projectiles[i] && this.projectiles[i].isColliding) {
        this.projectiles[i].visible = false;
        // this.projectiles[i].removePhysics();
      }
    }
  }

  //Once the player is near a bomb, we see how close to the bomb that player is
  bombCollision(): void {
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

  handlePlayerBombCollision(): void {
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
  }

  playerReachedGoal(): boolean {
    return (
      this.enemies.length === 0 &&
      this.player.collisionShape.overlaps(this.greenFlag.collisionShape)
    );
  }

  getPlayer(): AnimatedSprite {
    return this.player;
  }
}
