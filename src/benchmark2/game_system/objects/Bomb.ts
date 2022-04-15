import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { TweenableProperties } from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";

/**
 * Bomb class
 * Keeps track of bomb location
 * and keeps track of how close player is to
 * bomb and if player is colliding with bomb.
 * Sprite will be a flag that is not visible
 * just yet.
 */
export default class Bomb {
  explosionSprite: AnimatedSprite;
  flagSprite: AnimatedSprite;
  position: Vec2;
  tileCoord: Vec2;
  collisionBoundary: AABB;
  innerBoundary: AABB;
  middleBoundary: AABB;
  outerBoundary: AABB;
  isFlagged: boolean;
  isDestroyed: boolean;
  emitter: Emitter;

  constructor(
    tileCoord: Vec2,
    explosionSprite: AnimatedSprite,
    flagSprite: AnimatedSprite
  ) {
    this.explosionSprite = explosionSprite;
    this.explosionSprite.tweens.add("fadeOut", {
      startDelay: 1000,
      duration: 3000,
      effects: [
        {
          property: TweenableProperties.alpha,
          start: 1.0,
          end: 0,
          ease: EaseFunctionType.IN_SINE,
        },
      ],
    });
    this.flagSprite = flagSprite;
    this.isFlagged = false;
    this.isDestroyed = false;
    this.tileCoord = tileCoord;
    this.position = new Vec2(
      (tileCoord.x + 0.5) * 16,
      (tileCoord.y + 0.5) * 16
    );
    this.explosionSprite.position = this.position;
    this.explosionSprite.scale = new Vec2(1.25,1.25);
    this.explosionSprite.animation.play("HIDDEN", true, null);
    this.flagSprite.position = this.position;
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
    this.emitter = new Emitter()
  }

  setIsFlaggedTrue() {
    this.isFlagged = true;
    this.flagSprite.visible = true;
    this.flagSprite.animation.play("IDLE");
  }

  setIsDestroyedTrue() {
    this.isDestroyed = true;
  }

  hide() {
    this.flagSprite.visible = false;
  }

  explode() {
    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "boom",loop: false,holdReference: false});
    this.isDestroyed = true;
    this.hide();
    this.explosionSprite.animation.playIfNotAlready("IDLE", false, null);
    this.explosionSprite.animation.queue("DEBRIS", true, null);
    this.explosionSprite.tweens.play("fadeOut");
  }

  // displayFlag(sprite: Sprite) {
  //   this.sprite = sprite;
  //   sprite.position = this.position;
  // }
}
