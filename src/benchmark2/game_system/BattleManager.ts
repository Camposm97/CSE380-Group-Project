import GameNode from "../../Wolfie2D/Nodes/GameNode";
import BattlerAI from "../ai/BattlerAI";
import RobotAI from "../ai/RobotAI";
import Weapon from "./items/Weapon";

export default class BattleManager {
  players: Array<BattlerAI>;

  enemies: Array<RobotAI>;

  handleInteraction(attackerType: string, weapon: Weapon) {
    if (attackerType === "player") {
      // Check for collisions with enemies
      for (let enemy of this.enemies) {
        console.log(enemy.owner);
        if (enemy.owner.collisionShape && weapon.hits(enemy.owner)) {
          enemy.hit();
        }
      }
    }
  }

  setPlayers(player: Array<BattlerAI>): void {
    this.players = player;
  }

  setEnemies(enemies: Array<RobotAI>): void {
    this.enemies = enemies;
  }
}
