import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Shape from "../../Wolfie2D/DataTypes/Shapes/Shape";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Receiver from "../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Events, Names, RobotMouseAnimations } from "../scene/Constants";
import RobotAI from "./RobotAI";

export default class BlueMouseAI implements RobotAI {
  receiver: Receiver;
  emitter: Emitter;
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
  frozenTimeInMillis: number;
  direction: number;
  listening: boolean;
  offState: boolean;
  paused: boolean;
  pushable: boolean = true;

  initializeAI(owner: AnimatedSprite, options?: Record<string, any>): void {
    this.owner = owner;
    this.listening = false;
    this.owner.scale = new Vec2(0.12, 0.12);
    this.owner.setCollisionShape(new AABB(this.owner.position, new Vec2(4, 4)));
    this.frozenTimeInMillis = 5000;
    this.speed = 120;
    this.mainBehavior = true;
    this.damage = 1;
    this.direction = 1;
    this.emitter = new Emitter();

    if (options) {
      if (options.behavior === "secondary") {
        this.mainBehavior = false;
      }
      if (options.time) {
        this.frozenTimeInMillis = options.time;
      }
      if (options.damage) {
        this.damage = options.damage;
      }
    }
    this.frozenTimer = new Timer(this.frozenTimeInMillis);
    this.isFrozen = false;
    this.offState = false;

    this.receiver = new Receiver();
    this.receiver.subscribe(Events.PAUSE_GAME);
  }

  hit(): void {
    if (!this.isFrozen) {
      this.isFrozen = true;
      this.frozenTimer.start(this.frozenTimeInMillis);
      this.mainBehavior = !this.mainBehavior;
      this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
        key: "rm_freeze",
        loop: false,
      });
    }
  }

  collide(): void {
    if (!this.isFrozen) {
      this.direction *= -1;
    }
  }

  push(v: Vec2): void {
    if (this.isFrozen) {
      this.owner.move(v);
    }
  }

  setPath() {
    let movement = null;
    let newPos = null;
    if (this.mainBehavior) {
      // left=1, right=-1
      movement = Vec2.LEFT.scaled(this.speed * this.direction);
      newPos = this.owner.position.clone().add(movement.scaled(this.deltaT));
      this.path = this.owner
        .getScene()
        .getNavigationManager()
        .getPath(Names.NAVMESH, this.owner.position, newPos, true);
    } else {
      // up=1, down=-1
      movement = Vec2.UP.scaled(this.speed * this.direction);
      newPos = this.owner.position.clone().add(movement.scaled(this.deltaT));
      this.path = this.owner
        .getScene()
        .getNavigationManager()
        .getPath(Names.NAVMESH, this.owner.position, newPos, true);
    }
    this.doAnimation();
  }

  /**
   * Plays an animation based on @param this.direction and @param this.mainBehavior
   */
  doAnimation() {
    if (this.isFrozen) {
      if (this.offState) {
        this.owner.animation.queue(RobotMouseAnimations.OFF, true);
      } else {
        this.owner.animation.playIfNotAlready(
          RobotMouseAnimations.DEATH,
          false
        );
        this.offState = true;
      }
      return;
    }
    switch (this.direction) {
      case -1: // right/up
        this.owner.animation.playIfNotAlready(
          this.mainBehavior
            ? RobotMouseAnimations.WALK_RIGHT
            : RobotMouseAnimations.WALK_DOWN,
          true
        );
        break;
      case 1: //left/down
        this.owner.animation.playIfNotAlready(
          this.mainBehavior
            ? RobotMouseAnimations.WALK_LEFT
            : RobotMouseAnimations.WALK_UP,
          true
        );
        break;
    }
  }

  destroy(): void {
    // throw new Error("Method not implemented.");
  }
  activate(options: Record<string, any>): void {
    // throw new Error("Method not implemented.");
  }

  handleEvent(event: GameEvent): void {
    switch (event.type) {
      case Events.PAUSE_GAME:
        this.paused = !this.paused;
        if (this.paused) {
          this.frozenTimer.pause();
        } else {
          this.frozenTimer.resume();
        }
        break;
      default:
        break;
    }
  }

  update(deltaT: number): void {
    this.deltaT = deltaT;
    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }

    if (!this.paused) {
      if (this.frozenTimer.isStopped()) {
        this.isFrozen = false;
        this.offState = false;
      }

      if (this.owner.isColliding) this.collide();

      if (this.isFrozen) {
        this.path = null;
        this.doAnimation();
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
}
