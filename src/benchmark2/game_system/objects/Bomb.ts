import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Spritesheet from "../../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode, { TweenableProperties } from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { TweenEffect } from "../../../Wolfie2D/Rendering/Animations/AnimationTypes";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { Events } from "../../scene/Constants";

/**
 * Bomb class
 * Keeps track of bomb location
 * and keeps track of how close player is to
 * bomb and if player is colliding with bomb.
 * Sprite will be a flag that is not visible
 * just yet.
 */
export default class Bomb {
  owner: AnimatedSprite
  position: Vec2;
  tileCoord: Vec2;
  collisionBoundary: AABB;
  innerBoundary: AABB;
  middleBoundary: AABB;
  outerBoundary: AABB;
  isFlagged: boolean;
  isDestroyed: boolean;

  constructor(tileCoord: Vec2, owner: AnimatedSprite) {
    this.owner = owner
    this.owner.tweens.add('fadeOut', {
      startDelay: 1000,
      duration: 3000,
      effects: [
          {
              property: TweenableProperties.alpha,
              start: 1.0,
              end: 0,
              ease: EaseFunctionType.IN_SINE,
          }
      ]
    })
    this.isFlagged = false;
    this.isDestroyed = false;
    this.tileCoord = tileCoord;
    this.position = new Vec2(
      (tileCoord.x + 0.5) * 16,
      (tileCoord.y + 0.5) * 16
    );
    this.owner.position = this.position
    this.owner.scale = new Vec2(2.0,2.0)
    // this.position.x = tileCoord.x + 0.5 * 16;
    // this.position.y = tileCoord.y + 0.5 * 16;
    this.collisionBoundary = new AABB(
      new Vec2(this.position.x, this.position.y),
      new Vec2(0.8, 0.8)
    );
    console.log(this.collisionBoundary.toString());
    this.innerBoundary = new AABB(
      new Vec2(this.position.x, this.position.y),
      new Vec2(16.8, 16.8)
    );
    this.middleBoundary = new AABB(
      new Vec2(this.position.x, this.position.y),
      new Vec2(32.8, 32.8)
    );
    this.outerBoundary = new AABB(
      new Vec2(this.position.x, this.position.y),
      new Vec2(48.8, 48.8)
    );
  }

  setIsFlaggedTrue() {
    this.isFlagged = true;
  }

  setIsDestroyedTrue() {
    this.isDestroyed = true;
  }

  hide() {
    this.owner.animation.play('HIDDEN', true, null)
  }

  explode() {
    this.isDestroyed = true
    this.owner.animation.playIfNotAlready('IDLE', false, null)
    this.owner.animation.queue('DEBRIS', true, null)
    this.owner.tweens.play('fadeOut')
  }

  // displayFlag(sprite: Sprite) {
  //   this.sprite = sprite;
  //   sprite.position = this.position;
  // }
}
