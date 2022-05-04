import Vec2 from "../../Wolfie2D/DataTypes/Vec2"
import Scene from "../../Wolfie2D/Scene/Scene"
import { LEADERBOARD_DATA } from "../scene/Constants"
import { initLabel } from "../ui/UIBuilder"

const TOP_TEN = 10

/**
 * Util for managing Leaderboard system
 */
export class Leaderboard {
    private arr: any[]

    constructor() {
        let s = localStorage.getItem(LEADERBOARD_DATA)
        if (s) {
            this.arr = JSON.parse(s)
        } else {
            this.arr = []
        }
    }

    display(scene: Scene, layer: string, pos: Vec2) {
        let yOffset = -150
        for (let i in this.arr) {
            let x = this.arr[i]
            let name: string = x.name
            let score: number = x.score
            let lblName = initLabel(scene,layer,new Vec2(pos.x - 300, pos.y + yOffset),name)
            let lblScore = initLabel(scene,layer,new Vec2(pos.x + 300, pos.y + yOffset),score.toString())
            lblName.fontSize = 24
            lblScore.fontSize = 24
            yOffset += 40
        }
    }

    add(name: string, score: number): void {
        this.arr.push({name: name, score: score})
        this.sortAndFilter()
        this.save()
    }

    sortAndFilter(): void {
        this.arr = this.arr.sort((a: any, b: any) => b.score - a.score)
        if (this.arr.length > TOP_TEN) {
            this.arr.pop()
        } 
    }

    save(): void {
        localStorage.setItem(LEADERBOARD_DATA, JSON.stringify(this.arr))
    }
}