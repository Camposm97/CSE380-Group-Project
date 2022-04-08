import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Names, RobotMouseAnimations } from "../scene/Constants";
import RobotAI from "./RobotAI";

export default class BlueMouseAI implements RobotAI {
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
  direction: number;
  listening: boolean;
  offState: boolean

  initializeAI(owner: AnimatedSprite, options?: Record<string, any>): void {
    this.owner = owner;
    this.listening = false;
    this.owner.scale = new Vec2(0.12, 0.12);
    this.time = 2000;
    this.speed = 120;
    this.mainBehavior = true;
    this.damage = 1;
    this.direction = 1;
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
    this.frozenTimer = new Timer(this.time)
    this.isFrozen = false;
    this.offState = false
  }

  hit(): void {
    if (!this.isFrozen) {
      this.isFrozen = true;
      this.frozenTimer.start(this.time);
      this.mainBehavior = !this.mainBehavior;
    }
  }

  collide(): void {
    if (!this.isFrozen) {
      this.direction *= -1;
    }
  }

  setPath() {
    let movement = null;
    let newPos = null;
    if (this.mainBehavior) { // left=1, right=-1
      movement = Vec2.LEFT.scaled(this.speed * this.direction);
      newPos = this.owner.position.clone().add(movement.scaled(this.deltaT));
      this.path = this.owner
        .getScene()
        .getNavigationManager()
        .getPath(Names.NAVMESH, this.owner.position, newPos, true);
    } else { // up=1, down=-1
      movement = Vec2.UP.scaled(this.speed * this.direction);
      newPos = this.owner.position.clone().add(movement.scaled(this.deltaT));
      this.path = this.owner
        .getScene()
        .getNavigationManager()
        .getPath(Names.NAVMESH, this.owner.position, newPos, true);
    }
    this.doAnimation()
  }
  
  /**
   * Plays an animation based on @param this.direction and @param this.mainBehavior
   */
  doAnimation() {
    if (this.isFrozen) {
      if (this.offState) {
        this.owner.animation.queue(RobotMouseAnimations.OFF, true)
      } else {
        this.owner.animation.playIfNotAlready(RobotMouseAnimations.DEATH, false)
        this.offState = true
      }
      return
    }
    switch (this.direction) {
      case -1: // right/up
        this.owner.animation.playIfNotAlready(this.mainBehavior ? RobotMouseAnimations.WALK_RIGHT : RobotMouseAnimations.WALK_DOWN, true)
        break;
      case 1: //left/down
        this.owner.animation.playIfNotAlready(this.mainBehavior ? RobotMouseAnimations.WALK_LEFT : RobotMouseAnimations.WALK_UP, true)
        break;
    }
  }

  destroy(): void {
    // throw new Error("Method not implemented.");
  }
  activate(options: Record<string, any>): void {
    // throw new Error("Method not implemented.");
  }
  handleEvent(event: GameEvent): void {}

  update(deltaT: number): void {
    this.deltaT = deltaT;

    if (this.frozenTimer.isStopped()) {
      this.isFrozen = false;
      this.offState = false
    }

    if (this.owner.isColliding) this.collide();

    if (this.isFrozen) {
      this.path = null;
      this.doAnimation()
    } else {
      this.setPath();
    }

    if (this.path != null && !this.isFrozen) {
      //Move on path if selected
      if (this.path.isDone()) {
        this.path = null;
      } else {
        this.owner.moveOnPath(this.speed * deltaT, this.path);
      }
    }
  }
}
