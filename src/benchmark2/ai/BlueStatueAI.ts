import GoapActionPlanner from "../../Wolfie2D/AI/GoapActionPlanner";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import StateMachineGoapAI from "../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Stack from "../../Wolfie2D/DataTypes/Stack";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Timer from "../../Wolfie2D/Timing/Timer";
import Weapon from "../game_system/items/Weapon";
import {
  Events,
  Names,
  RobotAction,
  Statuses,
  RobotStatueAnimations,
} from "../scene/Constants";
import RobotAI from "./RobotAI";
import Receiver from "../../Wolfie2D/Events/Receiver";
import { PlayerAction } from "../scene/Constants";
import Emitter from "../../Wolfie2D/Events/Emitter";
import PlayerController from "./PlayerController";

export default class BlueStatueAI implements RobotAI {
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

  private deltaT: number;

  time: number;

  listening: boolean;

  projectile: boolean;

  private path: NavigationPath;

  private emitter: Emitter;

  private direction: Vec2;

  private unitVector: Vec2;

  private moveSpaces: number;

  private velocity: Vec2; //velocity statue will go once it is hit by the player

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

    this.moveSpaces = 3;

    this.owner.scale = new Vec2(0.125, 0.125);
    this.time = 1000;
    this.speed = 3000;
    this.mainBehavior = true;
    this.damage = 1;
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
      if (options.direction) {
        this.direction = new Vec2(options.direction[0], options.direction[1]);
        this.directionIndex = options.directionIndex;
      }
      if (options.moveSpaces) this.moveSpaces = options.moveSpaces;
    }
    this.frozenTimer = new Timer(this.time);

    this.projectileTimer = new Timer(this.time);

    this.isFrozen = false;

    this.emitter = new Emitter();

    this.velocity = new Vec2(0, 0);

    this.unitVector = new Vec2(-1, -1);

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
      let playerDirection = options.direction;
      this.isFrozen = true;
      this.frozenTimer.start(this.time);
      this.projectileTimer.update(0);
      this.velocity.x = this.speed * playerDirection.x;
      this.velocity.y = this.speed * -playerDirection.y;
    }
  }
  shoot(): void {
    console.log("SHOOT");
    this.direction.mult(this.unitVector);
    this.direction = new Vec2(this.direction.y, this.direction.x);
    this.unitVector.scale(-1);

    this.directionIndex++;
    if (this.directionIndex > 3) this.directionIndex = 0;
    this.owner.animation.play(this.vecAnimationMap.get(this.directionIndex));

    this.projectileTimer.start(5000);

    // let position = this.owner.position;
    // switch (this.direction) {
    //   case 0:
    //     position.y = position.y - 10;
    //     this.projectileVel = new Vec2(0, -this.projectileSpeed);
    //     break;
    //   case 1:
    //     position.x = position.x - 10;
    //     this.projectileVel = new Vec2(-this.projectileSpeed, 0);
    //     break;
    //   case 2:
    //     position.x = position.y + 10;
    //     this.projectileVel = new Vec2(0, this.projectileSpeed);
    //     break;
    //   case 3:
    //     position.x = position.x + 10;
    //     this.projectileVel = new Vec2(this.projectileSpeed, 0);
    //     break;
    // }
    // this.direction++;
    // if (this.direction > 3) this.direction = 0;
    // this.emitter.fireEvent(RobotAction.FIRE_PROJECTILE, {
    //   position: position,
    //   velocity: this.projectileVel,
    // });
    this.projectileTimer.start();
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
    }

    if (this.projectileTimer.isStopped()) {
      console.log("timerStopped");
      this.shoot();
    }

    this.owner.move(this.velocity.scale(deltaT));
  }
}
