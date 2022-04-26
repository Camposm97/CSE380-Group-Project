import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../Wolfie2D/Timing/Timer";
import { RobotAction, RobotStatueAnimations } from "../scene/Constants";
import RobotAI from "./RobotAI";
import Emitter from "../../Wolfie2D/Events/Emitter";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class BlueStatueAI implements RobotAI {
  emitter: Emitter;
  owner: AnimatedSprite;
  //whether or not robot is frozen
  isFrozen: boolean;
  //how long robot is frozen for
  frozenTimer: Timer;
  //whether or not robot is using primary or secondary behavior
  mainBehavior: boolean;

  //time until next projectile is fired
  projectileTimer: Timer;

  damage: number;

  speed: number;

  frozenTimeInMillis: number;

  currentProjFreq: number;

  projFreqMin: number;

  listening: boolean;

  projectile: boolean;

  private direction: Vec2;

  private unitVector: Vec2;

  private projectileSpeed: number; //speed of projectile

  private projectileVel: Vec2; //velocity of projectile

  private directionIndex: number;

  private vecAnimationMap: Map<number, RobotStatueAnimations>;

  initializeAI(owner: AnimatedSprite, options?: Record<string, any>): void {
    this.owner = owner;
    this.listening = false;
    this.projectile = true;
    this.projectileSpeed = 100;
    this.direction = new Vec2(0, -1);
    this.owner.scale = new Vec2(0.12, 0.12);
    this.frozenTimeInMillis = 7000;
    this.currentProjFreq = 1500;
    this.projFreqMin = 500;
    this.speed = 2000;
    this.mainBehavior = true;
    this.damage = 1;
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
      if (options.direction) {
        this.direction = new Vec2(options.direction[0], options.direction[1]);
        this.directionIndex = options.directionIndex;
      }
    }
    this.frozenTimer = new Timer(this.frozenTimeInMillis);

    this.projectileTimer = new Timer(this.currentProjFreq);

    this.isFrozen = false;

    this.emitter = new Emitter();

    this.unitVector = new Vec2(-1, -1);

    this.projectileVel = new Vec2(1000, 1000);

    this.vecAnimationMap = new Map([
      [0, RobotStatueAnimations.LOOK_DOWN],
      [1, RobotStatueAnimations.LOOK_RIGHT],
      [2, RobotStatueAnimations.LOOK_UP],
      [3, RobotStatueAnimations.LOOK_LEFT],
    ]);
    this.directionIndex = 0;
  }

  hit(options: Record<string, any>): void {
    if (!this.isFrozen) {
      this.isFrozen = true;
      this.frozenTimer.start(this.frozenTimeInMillis);
      this.projectileTimer.update(0);
      this.currentProjFreq =
        this.currentProjFreq <= this.projFreqMin
          ? this.projFreqMin
          : this.currentProjFreq - 50;
      this.emitter.fireEvent(GameEventType.PLAY_SOUND, {
        key: "rs_freeze",
        loop: false,
      });
    }
  }

  push(v: Vec2): void {
    if (this.isFrozen) {
      this.owner.move(v);
    }
  }

  shoot(): void {
    this.direction.mult(this.unitVector);
    this.direction = new Vec2(this.direction.y, this.direction.x);
    this.unitVector.scale(-1);

    this.directionIndex++;
    if (this.directionIndex > 3) this.directionIndex = 0;
    this.owner.animation.play(this.vecAnimationMap.get(this.directionIndex));

    this.projectileTimer.start(this.currentProjFreq);

    let position = new Vec2(this.owner.position.x, this.owner.position.y);
    let offset = new Vec2(this.direction.x * 16, this.direction.y * -16);

    this.projectileVel = new Vec2(
      this.projectileSpeed * this.direction.x,
      this.projectileSpeed * this.direction.y
    );

    position.add(offset);

    this.emitter.fireEvent(RobotAction.FIRE_PROJECTILE, {
      position: position,
      velocity: this.projectileVel,
    });
  }
  destroy(): void {
    // throw new Error("Method not implemented.");
  }
  activate(options: Record<string, any>): void {
    // throw new Error("Method not implemented.");
  }
  handleEvent(event: GameEvent): void {}

  update(deltaT: number): void {
    if (this.frozenTimer.isStopped()) {
      this.isFrozen = false;
    }

    if (this.isFrozen) {
      this.owner.animation.playIfNotAlready(RobotStatueAnimations.DEATH, true);
    }

    if (!this.isFrozen && this.projectileTimer.isStopped()) {
      this.shoot();
    }
  }
}
