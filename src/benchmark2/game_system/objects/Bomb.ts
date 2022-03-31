import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

/**
 * Bomb class
 * Keeps track of bomb location
 * and keeps track of how close player is to
 * bomb and if player is colliding with bomb.
 * Sprite will be a flag that is not visible
 * just yet.
 */
export default class Bomb {
  position: Vec2;
  collisionBoundary: AABB;
  innerBoundary: AABB;
  middleBoundary: AABB;
  outerBoundary: AABB;
  sprite: Sprite;

  constructor(tileCoord: Vec2) {
    this.position = new Vec2(
      (tileCoord.x + 0.5) * 16,
      (tileCoord.y + 0.5) * 16
    );
    // this.position.x = tileCoord.x + 0.5 * 16;
    // this.position.y = tileCoord.y + 0.5 * 16;
    console.log(this.position.toString());
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
}
