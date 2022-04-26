import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import BlueMouseAI from "../../../ai/BlueMouseAI";
import WeaponType from "./WeaponType";

export default class Slice extends WeaponType {
  hitBox: AABB;
  initialize(options: Record<string, any>): void {
    this.damage = options.damage;
    this.cooldown = options.cooldown;
    this.displayName = options.displayName;
    this.spriteKey = options.spriteKey;
    this.useVolume = options.useVolume;
  }

  doAnimation(
    attacker: GameNode,
    direction: Vec2,
    sliceSprite: AnimatedSprite
  ): void {
    // Handle rotation based on direction of player
    let halfSize = new Vec2(8, 8);
    switch (direction.x) { // Left & Right
      case -1:
        sliceSprite.scale = new Vec2(1.5,1)
        sliceSprite.rotation = Math.PI / 2;
        halfSize.set(16, 2);
        break;
      case 1:
        sliceSprite.scale = new Vec2(1.5,1)
        sliceSprite.rotation = (-1 * Math.PI) / 2;
        halfSize.set(16, 2);
        break;
    }
    switch (direction.y) { // Up & Down
      case -1:
        sliceSprite.scale = new Vec2(1,1.5)
        sliceSprite.rotation = 0;
        halfSize.set(2, 16);
        break;
      case 1:
        sliceSprite.scale = new Vec2(1,1.5)
        sliceSprite.rotation = Math.PI;
        halfSize.set(2, 16);
        break;
    }

    this.hitBox = new AABB(
      new Vec2(
        attacker.position.x + direction.x * 16,
        attacker.position.y + direction.y * 16
      ),
      halfSize
    );
    //attacker.position.clone().add(direction.scale(16)),
    // Move the slice out from the player
    sliceSprite.position = this.hitBox.center;

    // Play the slice animation w/o loop, but queue the normal animation
    sliceSprite.animation.play("SLICE");
    sliceSprite.animation.queue("NORMAL", true);
  }

  createRequiredAssets(scene: Scene): [AnimatedSprite] {
    let slice = scene.add.animatedSprite("slice", "primary");
    slice.animation.play("NORMAL", true);

    return [slice];
  }

  hits(node: GameNode, sliceSprite: AnimatedSprite): boolean {
    if (node._ai instanceof BlueMouseAI) { // Will this satisfy collision detection when hitting the mouse?
      return this.hitBox.overlaps((<BlueMouseAI>node._ai).owner.boundary)
    }
    return this.hitBox.overlaps(node.collisionShape);
  }

  clone(): WeaponType {
    let newType = new Slice();
    newType.initialize({
      damage: this.damage,
      cooldown: this.cooldown,
      displayName: this.displayName,
      spriteKey: this.spriteKey,
      useVolume: this.useVolume,
    });
    return newType;
  }
}
