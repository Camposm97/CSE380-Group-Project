import StateMachineGoapAI from "../../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Timer from "../../../Wolfie2D/Timing/Timer";
import { Statuses } from "../../scene/Constants";
import EnemyAI from "../EnemyAI";

export default class Berserk extends GoapAction {
    protected emitter: Emitter;
    
    constructor(cost: number, preconditions: Array<string>, effects: Array<string>, options?: Record<string, any>) {
        super();
        this.cost = cost;
        this.preconditions = preconditions;
        this.effects = effects;
    }

    performAction(statuses: Array<string>, actor: StateMachineGoapAI, deltaT: number, target?: StateMachineGoapAI): Array<string> {
        if (this.checkPreconditions(statuses)) {
            // console.log('BERSERK!!!')
            let enemy = <EnemyAI> actor;
            enemy.speed *= 2.5;
            enemy.weapon.type.damage *= 2.0;
            enemy.weapon.cooldownTimer = new Timer(enemy.weapon.type.cooldown / 2.0);
            return this.effects;
        }
        return this.effects;
    }

    updateCost(options: Record<string, number>): void {}
    
    toString(): string {
        return "(Berserk)";
    }
    
}