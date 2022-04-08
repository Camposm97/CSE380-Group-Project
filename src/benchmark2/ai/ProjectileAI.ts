import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Receiver from "../../Wolfie2D/Events/Receiver";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";

export default class ProjectileAI implements AI {
  // The owner of this AI
  private owner: AnimatedSprite;

  // The velocity
  private current_velocity: Vec2;
  start_velocity: Vec2;

  // Some vars to keep put bounds on the speed of the bullet
  static SPEED_INC: number = 75;
  static MAX_SPEED: number = 700;

  // An event emitter and receiver to hook into the event system
  private receiver: Receiver;

  initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
    this.owner = owner;

    this.current_velocity = options.velocity;

    this.receiver = new Receiver();
  }

  activate(options: Record<string, any>): void {
    this.start_velocity = options.velocity;
    this.current_velocity = this.start_velocity;
  }

  handleEvent(event: GameEvent): void {
    // If the bullet used was the same as this bullet, then reset the speed
    if (event.data.get("id") == this.owner.id) {
      this.current_velocity = this.start_velocity;
    }
  }

  update(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }
    if (this.owner.visible) {
      //While this bullet is active, accelerate the bullet to a max speed over time.
      this.current_velocity.x += deltaT * ProjectileAI.SPEED_INC;
      this.current_velocity.y += deltaT * ProjectileAI.SPEED_INC;
      this.current_velocity.x = MathUtils.clamp(
        this.current_velocity.x,
        this.start_velocity.x,
        ProjectileAI.MAX_SPEED
      );
      this.current_velocity.y = MathUtils.clamp(
        this.current_velocity.y,
        this.start_velocity.y,
        ProjectileAI.MAX_SPEED
      );

      // Update the position
      this.owner.position.add(Vec2.UP.scaled(deltaT * this.current_velocity.y));
      this.owner.position.add(
        Vec2.RIGHT.scaled(deltaT * this.current_velocity.x)
      );
    }
  }

  destroy(): void {}
}
