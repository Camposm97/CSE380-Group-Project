import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Control, Names, RobotAnimations } from "../scene/Constants";
import RobotAI from "./RobotAI";
import Receiver from "../../Wolfie2D/Events/Receiver";
import { PlayerAction } from "../scene/Constants";
import Input from "../../Wolfie2D/Input/Input";

export default class BlueRobotAI implements RobotAI {
  projectile: boolean;
  owner: AnimatedSprite;
  //whether or not robot is frozen
  isFrozen: boolean;
  //how long robot is frozen for
  frozenTimer: Timer;
  //whether or not robot is using primary or secondary behavior
  mainBehavior: boolean;
  damage: number;
  speed: number;
  private deltaT: number;
  private path: NavigationPath;

  time: number;

  listening: boolean;

  initializeAI(owner: AnimatedSprite, options?: Record<string, any>): void {
    this.owner = owner;
    this.listening = true;
    this.projectile = false;
    this.owner.scale = new Vec2(0.125, 0.125);
    this.time = 5000;
    this.speed = 100;
    this.mainBehavior = true;
    this.damage = 1;
    this.isFrozen = false;

    if (options) {
      if (options.behavior === "secondary") {
        this.mainBehavior = false;
      }
      if (options.time) {
        this.time = options.time;
      }
      if (options.damage) {
        this.damage = options.damage;
      }
    }

    this.frozenTimer = new Timer(this.time, () => {
      this.isFrozen = false
      this.owner.animation.play(RobotAnimations.IDLE, true, null)
    }, false);
  }

  hit(): void {
    if (!this.isFrozen) {
      this.isFrozen = true;
      this.owner.animation.play(RobotAnimations.DAMAGE, false, null)
      this.frozenTimer.start(this.time);
      this.mainBehavior = !this.mainBehavior;
    }
  }

  destroy(): void {
    // throw new Error("Method not implemented.");
  }
  activate(options: Record<string, any>): void {
    // throw new Error("Method not implemented.");
  }

  handleEvent(event: GameEvent): void {
    // throw new Error("Method not implemented.");
  }

  move(): void {
    let forwardAxis =
      (Input.isPressed("forward") || Input.isPressed("up") ? 1 : 0) +
      (Input.isPressed("backward") ? -1 : 0);
    let horizontalAxis =
      (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
    if (this.mainBehavior) {
      forwardAxis *= -1;
      horizontalAxis *= -1;
    }

    if ((forwardAxis != 0 && horizontalAxis == 0) || (forwardAxis == 0 && horizontalAxis != 0)) {
      let movement = Vec2.UP.scaled(forwardAxis * this.speed);
      movement = movement.add(new Vec2(horizontalAxis * this.speed, 0));
      let newPos = this.owner.position
        .clone()
        .add(movement.scaled(this.deltaT));
      this.path = this.owner
        .getScene()
        .getNavigationManager()
        .getPath(Names.NAVMESH, this.owner.position, newPos, true);

      // If there is any movement, override idle animation
      if (Input.isPressed(Control.FORWARD)) {
        this.mainBehavior ? 
        this.owner.animation.playIfNotAlready(RobotAnimations.WALK_DOWN, true, null) :
        this.owner.animation.playIfNotAlready(RobotAnimations.WALK_UP, true, null)
      }
      if (Input.isPressed(Control.LEFT)) {
        this.mainBehavior ? 
        this.owner.animation.playIfNotAlready(RobotAnimations.WALK_RIGHT, true, null) :
        this.owner.animation.playIfNotAlready(RobotAnimations.WALK_LEFT, true, null)

      }
      if (Input.isPressed(Control.BACKWARD)) {
        this.mainBehavior ? 
        this.owner.animation.playIfNotAlready(RobotAnimations.WALK_UP, true, null) :
        this.owner.animation.playIfNotAlready(RobotAnimations.WALK_DOWN, true, null)
      }
      if (Input.isPressed(Control.RIGHT)) {
        this.mainBehavior ? 
        this.owner.animation.playIfNotAlready(RobotAnimations.WALK_LEFT, true, null) :
        this.owner.animation.playIfNotAlready(RobotAnimations.WALK_RIGHT, true, null)
      }
    } else {
      this.owner.animation.playIfNotAlready(RobotAnimations.IDLE, true, null)
    }
  }
  update(deltaT: number): void {
    this.deltaT = deltaT;

    if (this.isFrozen) {
      this.owner.animation.queue(RobotAnimations.FROZEN, true, null)
      this.path = null
    } else {
      this.move()
    }

    if (this.path != null && !this.isFrozen) {
      //Move on path if selected
      this.path.isDone() ? this.path = null : this.owner.moveOnPath(this.speed * deltaT, this.path)
    }
  }
}
