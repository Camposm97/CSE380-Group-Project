import GameNode from "../../Wolfie2D/Nodes/GameNode";
import BattlerAI from "../ai/BattlerAI";
import PlayerController from "../ai/PlayerController";
import RobotAI from "../ai/RobotAI";
import Weapon from "./items/Weapon";
import Block from "./objects/Block";

export default class BattleManager {
  players: Array<PlayerController>;
  enemies: Array<RobotAI>;
  blocks: Array<Block>;

  handleInteraction(attackerType: string, weapon: Weapon) {
    if (attackerType === "player") {
      // Check for collisions with enemies
      for (let enemy of this.enemies) {
        if (enemy.owner.collisionShape && weapon.hits(enemy.owner)) {
          enemy.hit({ direction: this.players[0].lookDirection });
        }
      }
      // for (let block of this.blocks) {
      //   if (block.owner.collisionShape && weapon.hits(block.owner)) {
      //     block.hit(this.players[0].lookDirection);
      //   }
      // }
    }
  }

  setPlayers(player: Array<PlayerController>): void {
    this.players = player;
  }

  setEnemies(enemies: Array<RobotAI>): void {
    this.enemies = enemies;
  }

  setBlocks(blocks: Array<Block>): void {
    this.blocks = blocks;
  }
}
