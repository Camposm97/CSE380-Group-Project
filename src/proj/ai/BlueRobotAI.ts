import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../Wolfie2D/Timing/Timer";
import { Control, Events, Names, RobotAnimations } from "../scene/Constants";
import RobotAI from "./RobotAI";
import Receiver from "../../Wolfie2D/Events/Receiver";
import { PlayerAction } from "../scene/Constants";
import Input from "../../Wolfie2D/Input/Input";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class BlueRobotAI implements RobotAI {
  receiver: Receiver;
  emitter: Emitter;
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

  frozenTimeInMillis: number;

  listening: boolean;

  private previousAxis: string;
  private previousButton: string;
  private moveFrameCount: number;
  paused: boolean;

  pushable: boolean = false;

  initializeAI(owner: AnimatedSprite, options?: Record<string, any>): void {
    this.owner = owner;
    this.listening = true;
    this.projectile = false;
    this.owner.scale = new Vec2(0.125, 0.125);
    this.frozenTimeInMillis = 5000;
    this.speed = 100;
    this.mainBehavior = true;
    this.damage = 1;
    this.isFrozen = false;
    this.emitter = new Emitter();

    if (options) {
      if (options.behavior === "secondary") {
        console.log("mainbehavior set to false");
        this.mainBehavior = false;
      }
      if (options.time) {
        this.frozenTimeInMillis = options.time;
      }
      if (options.damage) {
        this.damage = options.damage;
      }
    }

    this.frozenTimer = new Timer(
      this.frozenTimeInMillis,
      () => {
        this.isFrozen = false;
        this.owner.animation.play(RobotAnimations.IDLE, true, null);
      },
      false
    );

    this.previousAxis = "none";
    this.previousButton = "none";
    this.moveFrameCount = 0;

    this.receiver = new Receiver();
    this.receiver.subscribe(Events.PAUSE_GAME);
  }

  hit(): void {
    if (!this.isFrozen) {
      this.isFrozen = true;
      this.owner.animation.play(RobotAnimations.DAMAGE, false, null);
      this.frozenTimer.start(this.frozenTimeInMillis);
      this.mainBehavior = !this.mainBehavior;
      this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
        key: "r_freeze",
        loop: false,
      });
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

  move(): void {
    let forwardAxis = 0;
    let horizontalAxis = 0;

    if (Input.isJustPressed("forward") || Input.isJustPressed("up"))
      this.previousAxis = "forward";
    if (Input.isJustPressed("backward")) this.previousAxis = "backward";

    if (Input.isJustPressed("left")) this.previousAxis = "left";

    if (Input.isJustPressed("right")) this.previousAxis = "right";

    if (Input.isPressed("forward") || Input.isJustPressed("up")) {
      if (
        this.previousAxis === "forward" ||
        (!Input.isPressed("left") &&
          !Input.isPressed("right") &&
          !Input.isPressed("backward"))
      ) {
        forwardAxis = 1;
      }
    }
    if (Input.isPressed("forward") || Input.isJustPressed("up")) {
      if (
        this.previousAxis === "forward" ||
        (!Input.isPressed("left") &&
          !Input.isPressed("right") &&
          !Input.isPressed("backward"))
      ) {
        if (this.previousButton === "forward") {
          this.moveFrameCount++;
          if (this.moveFrameCount >= 5) forwardAxis = 1;
        } else {
          this.previousButton = "forward";
        }
      }
    }
    if (Input.isPressed("backward")) {
      if (
        this.previousAxis === "backward" ||
        (!Input.isPressed("left") &&
          !Input.isPressed("right") &&
          !Input.isPressed("forward"))
      ) {
        if (this.previousButton === "backward") {
          this.moveFrameCount++;
          if (this.moveFrameCount >= 5) forwardAxis = -1;
        } else {
          this.previousButton = "backward";
        }
      }
    }
    if (Input.isPressed("left")) {
      if (
        this.previousAxis === "left" ||
        (!Input.isPressed("backward") &&
          !Input.isPressed("right") &&
          !Input.isPressed("forward"))
      ) {
        if (this.previousButton === "left") {
          this.moveFrameCount++;
          if (this.moveFrameCount >= 5) horizontalAxis = -1;
        } else {
          this.previousButton = "left";
        }
      }
    }
    if (Input.isPressed("right")) {
      if (
        this.previousAxis === "right" ||
        (!Input.isPressed("left") &&
          !Input.isPressed("backward") &&
          !Input.isPressed("forward"))
      ) {
        if (this.previousButton === "right") {
          this.moveFrameCount++;
          if (this.moveFrameCount >= 5) horizontalAxis = 1;
        } else {
          this.previousButton = "right";
        }
      }
    }
    if (
      !Input.isPressed("right") &&
      !Input.isPressed("left") &&
      !Input.isPressed("forward") &&
      !Input.isPressed("up") &&
      !Input.isPressed("backward")
    )
      this.moveFrameCount = 0;
    if (this.mainBehavior) {
      forwardAxis *= -1;
      horizontalAxis *= -1;
    }

    if (
      (forwardAxis != 0 && horizontalAxis == 0) ||
      (forwardAxis == 0 && horizontalAxis != 0)
    ) {
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
        this.mainBehavior
          ? this.owner.animation.playIfNotAlready(
              RobotAnimations.WALK_DOWN,
              true,
              null
            )
          : this.owner.animation.playIfNotAlready(
              RobotAnimations.WALK_UP,
              true,
              null
            );
      }
      if (Input.isPressed(Control.LEFT)) {
        this.mainBehavior
          ? this.owner.animation.playIfNotAlready(
              RobotAnimations.WALK_RIGHT,
              true,
              null
            )
          : this.owner.animation.playIfNotAlready(
              RobotAnimations.WALK_LEFT,
              true,
              null
            );
      }
      if (Input.isPressed(Control.BACKWARD)) {
        this.mainBehavior
          ? this.owner.animation.playIfNotAlready(
              RobotAnimations.WALK_UP,
              true,
              null
            )
          : this.owner.animation.playIfNotAlready(
              RobotAnimations.WALK_DOWN,
              true,
              null
            );
      }
      if (Input.isPressed(Control.RIGHT)) {
        this.mainBehavior
          ? this.owner.animation.playIfNotAlready(
              RobotAnimations.WALK_LEFT,
              true,
              null
            )
          : this.owner.animation.playIfNotAlready(
              RobotAnimations.WALK_RIGHT,
              true,
              null
            );
      }
    } else {
      this.owner.animation.playIfNotAlready(RobotAnimations.IDLE, true, null);
    }
  }
  update(deltaT: number): void {
    this.deltaT = deltaT;

    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }
    if (!this.paused) {
      if (this.isFrozen) {
        this.owner.animation.queue(RobotAnimations.FROZEN, true, null);
        this.path = null;
      } else {
        this.move();
      }

      if (this.path != null && !this.isFrozen) {
        //Move on path if selected
        this.path.isDone()
          ? (this.path = null)
          : this.owner.moveOnPath(this.speed * deltaT, this.path);
      }
    }
  }

  push(v: Vec2): void {
    //not implemented
  }
}
