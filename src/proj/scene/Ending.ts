import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { PlayerAnimations } from "./Constants";

enum Layer {
    Main = 'Main'
}

/**
 * This is where we'll display the ending scene of where 
 * Prof. McBendorjee frees his conscience from the code.
 * He is relieved to be free and swears to never forget to set a null pointer reference.
 * He then realizes he's late to lecture and scurries to his class.
 */
export class Ending extends Scene {
    private prof: AnimatedSprite
    private pc: Sprite
    private c: Vec2

    loadScene(): void {
        this.load.spritesheet('mcbendorjee', 'res/spritesheets/mcbendorjee.json')
        this.load.spritesheet('rm_blue', 'res/spritesheets/robots/robot_mouse_blue.json')
        this.load.image('pc', 'res/sprites/computer.png')
    }
    startScene(): void {
        this.c = this.viewport.getCenter().clone()
        this.addUILayer(Layer.Main)
        this.pc = this.add.sprite('pc', Layer.Main)
        this.pc.position = this.c.clone()
        this.pc.scale = new Vec2(8,8)

        this.prof = this.add.animatedSprite('mcbendorjee', Layer.Main)
        this.prof.position = this.c.clone().sub(new Vec2(0,200))
        this.prof.animation.play(PlayerAnimations.HAPPY, true)
    }
    updateScene(deltaT: number): void {
        
    }
}