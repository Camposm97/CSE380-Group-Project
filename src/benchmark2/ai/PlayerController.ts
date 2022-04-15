import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import InventoryManager from "../game_system/InventoryManager";
import Healthpack from "../game_system/items/Healthpack";
import Item from "../game_system/items/Item";
import {
  Events,
  Names,
  PlayerAction,
  PlayerAnimations,
  CoatColor,
} from "../scene/Constants";
import BattlerAI from "./BattlerAI";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Timer from "../../Wolfie2D/Timing/Timer";2
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

export default class PlayerController implements BattlerAI {
  // Tile Map
  private tilemap: OrthogonalTilemap;

  // Fields from BattlerAI
  public health: number;

  // The actual player sprite
  public owner: AnimatedSprite;

  // Attack range
  public range: number;

  // Current targeted enemy
  public target: Vec2;

  // Used for swapping control between both players
  private inputEnabled: boolean;

  // The inventory of the player
  public inventory: InventoryManager;

  /** A list of items in the game world */
  private items: Array<Item>;

  public coatColor: string;
  private overrideIdle: Boolean;

  // Movement
  public speed: number;
  public lookDirection: Vec2;
  private path: NavigationPath;
  private receiver: Receiver;
  private emitter: Emitter;
  private iFrame: boolean;
  private iFrameTimer: Timer;

  //Bomb Detection
  public nearBomb: boolean;

  //Used to make movement more fluid
  private previousDirection: Vec2;
  private twoButtonsPressed: boolean;
  private previousAxis: string;

  initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
    this.owner = owner;
    this.owner.scale = new Vec2(0.5, 0.5);
    this.owner.setCollisionShape(
      new AABB(this.owner.position, new Vec2(4.5, 4.5))
    );

    this.iFrameTimer = new Timer(5000);

    this.nearBomb = false;

    this.tilemap = this.owner
      .getScene()
      .getTilemap(options.tilemap) as OrthogonalTilemap;

    this.lookDirection = Vec2.ZERO;
    this.speed = options.speed;
    this.health = options.health;
    this.inputEnabled = options.inputEnabled;
    this.range = options.range;

    this.items = options.items;
    this.inventory = options.inventory;

    this.receiver = new Receiver();
    this.receiver.subscribe(Events.OVERRIDE_IDLE);
    this.emitter = new Emitter();
    this.coatColor = CoatColor.WHITE;

    this.owner.tweens.add('death', {
      startDelay: 0,
      duration: 3000,
      effects: [
        {
          property: TweenableProperties.alpha,
          start: 1,
          end: 0,
          ease: EaseFunctionType.IN_OUT_QUAD,
        },
      ],
      onEnd: Events.PLAYER_DIED,
    });
    // //allign bombHitBox with player sprites feet
    // let bombHitBoxCenter = new Vec2(
    //   this.owner.position.x - 0.8,
    //   this.owner.position.y - 0.8
    // );

    // this.bombHitBox = new AABB(bombHitBoxCenter, new Vec2(8, 8));
    this.twoButtonsPressed = false;
    this.previousDirection = new Vec2(0, 0);
    this.previousAxis = "none";
  }

  activate(options: Record<string, any>): void {}

  handleEvent(event: GameEvent): void {
    if (event.type === Events.OVERRIDE_IDLE) {
      this.overrideIdle = !this.overrideIdle;
    }
  }

  update(deltaT: number): void {
    if (this.iFrameTimer.isStopped()) this.iFrame = false;

    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }

    if (this.inputEnabled && this.health > 0) {
      // Check for slot change
      if (Input.isJustPressed("slot1")) {
        this.inventory.changeSlot(0);
      } else if (Input.isJustPressed("slot2")) {
        this.inventory.changeSlot(1);
      }

      if (Input.isJustPressed("pickup")) {
        // Check if there is an item to pick up
        for (let item of this.items) {
          if (this.owner.collisionShape.overlaps(item.sprite.boundary)) {
            // We overlap it, try to pick it up
            // MC - Use healthpack as you pick it up.
            if (item instanceof Healthpack && item.sprite.visible) {
              item.use(this.owner);
              item.sprite.visible = false;
            } else {
              this.inventory.addItem(item);
            }
            break;
          }
        }
      }

      if (Input.isJustPressed("drop")) {
        // Check if we can drop our current item
        let item = this.inventory.removeItem();

        if (item) {
          // Move the item from the ui to the gameworld
          item.moveSprite(this.owner.position, "primary");

          // Add the item to the list of items
          this.items.push(item);
        }
      }

      if (Input.isJustPressed("panic")) {
        this.emitter.fireEvent(Events.RESET_ROOM, {});
      }

      // WASD Movement
      if (!this.owner.animation.isPlaying(PlayerAnimations.DAMAGE)) {
        this.handleMovement(deltaT);
      }

      this.handleAttack();

      if (Input.isMouseJustPressed(2) || Input.isKeyJustPressed("f")) {
        let center = new Vec2(this.owner.position.x, this.owner.position.y);
        let offSet = new Vec2(this.lookDirection.x, this.lookDirection.y * -1);
        offSet.scale(16);
        center.add(offSet);
        this.emitter.fireEvent(Events.PLACE_FLAG, {
          flagPlaceHitBox: new AABB(center, new Vec2(16, 16)),
        });
      }

      if (this.path != null) {
        //Move on path if selected
        if (this.path.isDone()) {
          this.path = null;
        } else {
          this.owner.moveOnPath(this.speed * deltaT, this.path);
          // this.owner.rotation = Vec2.UP.angleToCCW(this.path.getMoveDirection(this.owner));
        }
      } else {
        //Target an enemy and attack
        if (this.target != null) {
          let item = this.inventory.getItem();
          this.lookDirection = this.owner.position.dirTo(this.target);

          // If there is an item in the current slot, use it
          if (item) {
            item.use(this.owner, "player", this.lookDirection);
            // this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection);

            if (item instanceof Healthpack) {
              // Destroy the used healthpack
              this.inventory.removeItem();
              item.sprite.visible = false;
            }
          }
        }
      }
    }
  }

  doAnimation(action: PlayerAction): void {
    switch (action) {
      case PlayerAction.IDLE:
        if (!this.overrideIdle) {
          this.owner.animation.playIfNotAlready(
            `${action}_${this.coatColor}`,
            true,
            null
          );
        }
        break;
      case PlayerAction.WALK_UP:
      case PlayerAction.WALK_DOWN:
      case PlayerAction.WALK_RIGHT:
      case PlayerAction.WALK_LEFT:
        this.overrideIdle = false;
        this.owner.animation.playIfNotAlready(
          `${action}_${this.coatColor}`,
          true,
          null
        );
        break;
      case PlayerAction.LOOK_UP:
      case PlayerAction.LOOK_DOWN:
      case PlayerAction.LOOK_RIGHT:
      case PlayerAction.LOOK_LEFT:
        this.overrideIdle = true;
        this.owner.animation.play(`${action}_${this.coatColor}`, false, null);
        break;
      case PlayerAction.DAMAGE:
        this.overrideIdle = true;
        this.owner.animation.play(
          PlayerAnimations.DAMAGE,
          false,
          Events.OVERRIDE_IDLE
        );
        break;
    }
  }

  damage(damage: number): void {
    if (!this.iFrame) {
      this.health -= damage;
      this.doAnimation(PlayerAction.DAMAGE);
      if (this.health <= 0) {
        this.health = 0
        this.owner.setAIActive(false, {})
        this.owner.isCollidable = false
        this.owner.tweens.play('death')
      }
      this.iFrame = true;
      this.iFrameTimer.start();
    }
  }

  died(): boolean {
    return this.health <= 0;
  }

  handleMovement(deltaT: number): void {
    let forwardAxis = 0;
    let horizontalAxis = 0;

    if (
      Input.isJustPressed("forward") ||
      Input.isJustPressed("up") ||
      Input.isJustPressed("backward")
    ) {
      this.previousAxis = "foward";
    }
    if (Input.isJustPressed("left") || Input.isJustPressed("right")) {
      this.previousAxis = "horizontal";
    }

    if (
      Input.isPressed("forward") ||
      Input.isPressed("up") ||
      Input.isPressed("backward")
    ) {
      if (
        this.previousAxis !== "horizontal" ||
        (!Input.isPressed("left") && !Input.isPressed("right"))
      ) {
        forwardAxis =
          (Input.isPressed("forward") || Input.isPressed("up") ? 1 : 0) +
          (Input.isPressed("backward") ? -1 : 0);
        this.previousAxis = "foward";
      }
    }
    if (Input.isPressed("left") || Input.isPressed("right")) {
      if (
        this.previousAxis !== "foward" ||
        (!Input.isPressed("forward") &&
          !Input.isPressed("up") &&
          !Input.isPressed("backward"))
      ) {
        horizontalAxis =
          (Input.isPressed("left") ? -1 : 0) +
          (Input.isPressed("right") ? 1 : 0);
        this.previousAxis = "horizontal";
      }
    }
    if (
      (forwardAxis != 0 && horizontalAxis == 0) ||
      (forwardAxis == 0 && horizontalAxis != 0)
    ) {
      let movement = Vec2.UP.scaled(forwardAxis * this.speed);
      movement = movement.add(new Vec2(horizontalAxis * this.speed, 0));
      let newPos = this.owner.position.clone().add(movement.scaled(deltaT));
      this.path = this.owner
        .getScene()
        .getNavigationManager()
        .getPath(Names.NAVMESH, this.owner.position, newPos, true);

      // let tileCoord = this.tilemap.getColRowAt(this.owner.position);
      // tileCoord = new Vec2(tileCoord.x, tileCoord.y);
      // let tile = this.tilemap.getTileAtRowCol(tileCoord);
      // let tileWorldcoord = this.tilemap.getTileWorldPosition(tile);
      // console.log(this.owner.position.toString());
      // console.log(tileWorldcoord.toString());
      // console.log(`x=${tileCoord.x} y=${tileCoord.y}`);

      // If there is any movement, override idle animation
      if (Input.isPressed("forward")) {
        this.doAnimation(PlayerAction.WALK_UP);
        // if (this.enemiesLeft) this.emitter.fireEvent(PlayerAction.WALK_UP);
        this.lookDirection.y = 1;
        this.lookDirection.x = 0;
      }
      if (Input.isPressed("left")) {
        this.doAnimation(PlayerAction.WALK_LEFT);
        // if (this.enemiesLeft) this.emitter.fireEvent(PlayerAction.WALK_LEFT);
        this.lookDirection.y = 0;
        this.lookDirection.x = -1;
      }
      if (Input.isPressed("backward")) {
        this.doAnimation(PlayerAction.WALK_DOWN);
        // if (this.enemiesLeft) this.emitter.fireEvent(PlayerAction.WALK_DOWN);
        this.lookDirection.y = -1;
        this.lookDirection.x = 0;
      }
      if (Input.isPressed("right")) {
        this.doAnimation(PlayerAction.WALK_RIGHT);
        // if (this.enemiesLeft) this.emitter.fireEvent(PlayerAction.WALK_RIGHT);
        this.lookDirection.y = 0;
        this.lookDirection.x = 1;
      }
    } else {
      this.doAnimation(PlayerAction.IDLE);
    }
  }

  handleAttack(): void {
    // handles attacking
    if (Input.isMouseJustPressed() || Input.isJustPressed("attack")) {
      let item = this.inventory.getItem();
      if (item === null) return;
      switch (this.lookDirection.x) {
        case 1:
          // console.log("attack right");
          this.doAnimation(PlayerAction.LOOK_RIGHT);
          this.inventory
            .getItem()
            .use(this.owner, "player", this.lookDirection);
          break;
        case -1:
          // console.log("attack left");
          this.doAnimation(PlayerAction.LOOK_LEFT);
          this.inventory
            .getItem()
            .use(this.owner, "player", this.lookDirection);
          break;
      }
      switch (this.lookDirection.y) {
        case 1:
          // console.log("attack up");
          this.doAnimation(PlayerAction.LOOK_UP);
          this.inventory.getItem().use(this.owner, "player", new Vec2(0, -1));
          break;
        case -1:
          // console.log("attack down");
          this.doAnimation(PlayerAction.LOOK_DOWN);
          this.inventory.getItem().use(this.owner, "player", new Vec2(0, 1));
          break;
      }
    }
  }

  setCoatColor(color: string) {
    this.coatColor = color;
  }

  destroy() {
    this.owner.visible = false;
    this.owner.setCollisionShape(new AABB(new Vec2(10, 10), new Vec2(1, 1)));
  }
}
