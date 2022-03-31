import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../Wolfie2D/Timing/Timer";
import InventoryManager from "../game_system/InventoryManager";
import Healthpack from "../game_system/items/Healthpack";
import Item from "../game_system/items/Item";
import Weapon from "../game_system/items/Weapon";
import { Events, Names } from "../scene/Constants";
import BattlerAI from "./BattlerAI";

export default class PlayerController implements BattlerAI {
  // Tile Map
  tilemap: OrthogonalTilemap;

  // Fields from BattlerAI
  health: number;

  // The actual player sprite
  owner: AnimatedSprite;

  // Attack range
  range: number;

  // Current targeted enemy
  target: Vec2;

  // Used for swapping control between both players
  inputEnabled: boolean;

  // The inventory of the player
  inventory: InventoryManager;

  /** A list of items in the game world */
  private items: Array<Item>;

  // Movement
  private speed: number;

  private lookDirection: Vec2;
  private path: NavigationPath;

  private receiver: Receiver;

  initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
    this.owner = owner;
    this.owner.scale = new Vec2(0.3, 0.3);

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
    // this.receiver.subscribe(Events.SWAP_PLAYER);
  }

  activate(options: Record<string, any>): void {}

  handleEvent(event: GameEvent): void {
    // If our id matches this player, set boolean and update inventory UI
    // if (event.type === Events.SWAP_PLAYER) {
    //     if (event.data.get("id") === this.owner.id) {
    //         this.inputEnabled = true;
    //         this.inventory.setActive(true);
    //     }
    //     else {
    //         this.inputEnabled = false;
    //         this.inventory.setActive(false);
    //     }
    // }
  }

  update(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }

    if (this.inputEnabled && this.health > 0) {
      //Check right click
      if (Input.isMouseJustPressed(2)) {
        this.path = this.owner
          .getScene()
          .getNavigationManager()
          .getPath(
            Names.NAVMESH,
            this.owner.position,
            Input.getGlobalMousePosition(),
            true
          );
      }

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

      // WASD Movement

      let forwardAxis =
        (Input.isPressed("forward") || Input.isPressed("up") ? 1 : 0) +
        (Input.isPressed("backward") ? -1 : 0);
      let horizontalAxis =
        (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);

      if (
        (forwardAxis != 0 && horizontalAxis == 0) ||
        (forwardAxis == 0 && horizontalAxis != 0)
      ) {
        //   if (forwardAxis || horizontalAxis) {
        let movement = Vec2.UP.scaled(forwardAxis * this.speed);
        movement = movement.add(new Vec2(horizontalAxis * this.speed, 0));
        let newPos = this.owner.position.clone().add(movement.scaled(deltaT));
        this.path = this.owner
          .getScene()
          .getNavigationManager()
          .getPath(Names.NAVMESH, this.owner.position, newPos, true);

        let tileCoord = this.tilemap.getColRowAt(this.owner.position);
        tileCoord = new Vec2(tileCoord.x, tileCoord.y);
        let tile = this.tilemap.getTileAtRowCol(tileCoord);
        let tileWorldcoord = this.tilemap.getTileWorldPosition(tile);
        console.log(this.owner.position.toString());
        // console.log(tileWorldcoord.toString());
        console.log(`x=${tileCoord.x} y=${tileCoord.y}`);
      }
      if (Input.isPressed("forward")) {
        this.owner.animation.play("WALK_UP", false, null);
      }
      if (Input.isPressed("left")) {
        this.owner.animation.play("WALK_LEFT", false, null);
      }
      if (Input.isPressed("backward")) {
        this.owner.animation.play("WALK_DOWN", false, null);
      }
      if (Input.isPressed("right")) {
        this.owner.animation.play("WALK_RIGHT", false, null);
      }
    }

    //Move on path if selected
    if (this.path != null) {
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

  damage(damage: number): void {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.owner.setAIActive(false, {});
      this.owner.visible = false;
      this.owner.isCollidable = false;
    }
  }

  destroy() {}
}
