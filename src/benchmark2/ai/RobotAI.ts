import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Timer from "../../Wolfie2D/Timing/Timer";

export default interface RobotAI extends AI {
  owner: GameNode;
  //whether or not robot is frozen
  isFrozen: boolean;
  //how long robot is frozen for
  frozenTimer: Timer;
  //whether or not robot is using primary or secondary behavior
  mainBehavior: boolean;
  //how much damage the robot gives
  damage: number;
  //speed of robot
  speed: number;
  //time of frozenTimer
  frozenTimeInMillis: number;
  //does AI listen for player movement
  listening: boolean;

  emitter: Emitter

  //method for handling taking a hit from the player
  hit: (options?: Record<string, any>) => void;
}
