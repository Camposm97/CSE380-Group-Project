import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { PlayerAnimations } from "./Constants";

enum Layer {
    Main = 'main'
}

/**
 * This is where we'll display the ending scene of where 
 * Prof. McBendorjee frees his conscience from the code.
 * He is relieved to be free and swears to never forget to set a null pointer reference.
 * He then realizes he's late to lecture and scurries to his class.
 */
export default class Ending extends Scene {
    private prof: AnimatedSprite
    private pc: Sprite
    private c: Vec2

    loadScene(): void {
        this.load.spritesheet('mcbendorjee', 'res/spritesheets/mcbendorjee.json')
        this.load.spritesheet('rm_blue', 'res/spritesheets/robots/robot_mouse_blue.json')
        this.load.image('pc', 'res/sprites/computer.png')
        this.load.image('class', 'res/tilemaps/level6/Level6_4.png')
    }

    startScene(): void {
        this.receiver.subscribe('next')
        this.c = this.viewport.getCenter().clone()
        this.addUILayer(Layer.Main)
        this.pc = this.add.sprite('pc', Layer.Main)
        this.pc.position = this.c.clone()
        this.pc.scale = new Vec2(8,8)

        let map = this.add.sprite('class', Layer.Main)
        map.position = this.c.clone().sub(new Vec2(115,128))
        map.scale = new Vec2(0.45,0.45)

        this.prof = this.add.animatedSprite('mcbendorjee', Layer.Main)
        this.prof.position = this.c.clone().sub(new Vec2(115,100))
        this.prof.animation.play(PlayerAnimations.HAPPY, true)

        this.prof.tweens.add('spin', {
            startDelay: 0,
            duration: 2000,
            effects: [
                {
                    property: TweenableProperties.rotation,
                    start: 0,
                    end: 8 * Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ] 
        })
        this.prof.tweens.add('grow', {
            startDelay: 0,
            duration: 2000,
            effects: [
                {
                    property: TweenableProperties.scaleX,
                    start: this.prof.scale.x,
                    end: 20,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: TweenableProperties.scaleY,
                    start: this.prof.scale.x,
                    end: 20,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: 'next'
        })
        this.prof.tweens.add('move', {
            startDelay: 0,
            duration: 2000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: this.prof.position.x,
                    end: this.viewport.getHalfSize().x * 2,
                    ease: EaseFunctionType.IN_SINE
                },
                {
                    property: TweenableProperties.posY,
                    start: this.prof.position.y,
                    end: 0,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        })
        this.prof.tweens.add('flash', {
            startDelay: 2000,
            duration: 300,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1.0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        })
        this.prof.tweens.play('flash', true)
        let f1 = () => {
            this.prof.tweens.play('spin', false)
            this.prof.tweens.play('grow', false)
            this.prof.tweens.play('move', false)
        }
        new Timer(3000, f1, false).start()
    }

    updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            let e = this.receiver.getNextEvent()
            switch (e.type) {
                case 'next':
                    this.prof.tweens.stopAll()
                    this.prof.animation.play(PlayerAnimations.IDLE_WHITE, true)
                    break
            }
        }
    }
}