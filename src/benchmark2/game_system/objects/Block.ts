import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Spritesheet from "../../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode, {
  TweenableProperties,
} from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { TweenEffect } from "../../../Wolfie2D/Rendering/Animations/AnimationTypes";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { Events } from "../../scene/Constants";

/**
 * Block Class
 * Block with physics that will move
 * in the firection it is hit
 */
export default class Block {
  owner: Sprite;
  position: Vec2;
  tileCoord: Vec2;
  velocity: Vec2;
  speed: number;

  constructor(tileCoord: Vec2, owner: Sprite) {
    this.owner = owner;
    this.tileCoord = tileCoord;
    this.position = new Vec2(
      (tileCoord.x + 0.5) * 16,
      (tileCoord.y + 0.5) * 16
    );
    this.owner.position = this.position;
    this.owner.scale = new Vec2(0.5, 0.5);
    this.speed = 16;
    this.velocity = new Vec2(0, 0);
  }

  hit(direction: Vec2) {
    this.velocity.x = this.speed * direction.x;
    this.velocity.y = this.speed * -direction.y;
    this.owner.move(this.velocity);
    console.log("block hit");
  }

  // displayFlag(sprite: Sprite) {
  //   this.sprite = sprite;
  //   sprite.position = this.position;
  // }
}
