import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { initLabel } from "../ui/UIBuilder";
import { PlayerAnimations } from "./Constants";

enum Layer {
    Main = 'main'
}

enum Events {
    Zoom_Out = 'zoom_out',
    Next_Anim = 'next_animation'
}

/**
 * This is where we'll display the ending scene of where 
 * Prof. McBendorjee frees his conscience from the code.
 * He is relieved to be free and swears to never forget to set a null pointer reference.
 * He then realizes he's late to lecture and scurries to his class.
 */
export default class Ending extends Scene {
    private desk: Sprite
    private prof: AnimatedSprite
    private clock: AnimatedSprite
    private pc: Sprite
    private map: Sprite
    private office: Sprite
    private c: Vec2

    loadScene(): void {
        this.load.spritesheet('mcbendorjee', 'res/spritesheets/mcbendorjee.json')
        this.load.spritesheet('rm_blue', 'res/spritesheets/robots/robot_mouse_blue.json')
        this.load.spritesheet('clock', 'res/spritesheets/clock.json')
        this.load.image('desk', 'res/sprites/desk.png')
        this.load.image('pc', 'res/sprites/computer.png')
        this.load.image('office', 'res/sprites/office.png')
        this.load.image('class', 'res/tilemaps/level6/Level6_4.png')
    }

    startScene(): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: 'levelMusic'})
        this.receiver.subscribe([Events.Zoom_Out, Events.Next_Anim])
        this.c = this.viewport.getCenter().clone()
        this.addUILayer(Layer.Main)

        this.office = this.add.sprite('office', Layer.Main)
        this.office.position = this.c.clone()
        this.office.scale = new Vec2(8,8)

        this.clock = this.add.animatedSprite('clock', Layer.Main)
        this.clock.position = this.c.clone().sub(new Vec2(0,300))
        this.clock.scale = new Vec2(4,4)
        this.clock.animation.play('ON_TIME', true)

        this.desk = this.add.sprite('desk', Layer.Main)
        this.desk.position = this.c.clone().add(new Vec2(0,400))
        this.desk.scale = new Vec2(40,25)

        this.pc = this.add.sprite('pc', Layer.Main)
        this.pc.position = this.c.clone()
        this.pc.scale = new Vec2(8,8)

        this.map = this.add.sprite('class', Layer.Main)
        this.map.position = this.pc.position.clone().sub(new Vec2(115,128))
        this.map.scale = new Vec2(0.45,0.45)

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
                    end: 40,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: TweenableProperties.scaleY,
                    start: this.prof.scale.x,
                    end: 40,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: Events.Zoom_Out
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
        this.prof.tweens.add('move_right', {
            startDelay: 250,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: this.prof.position.x,
                    end: this.viewport.getHalfSize().x * 2.5,
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
                case Events.Zoom_Out:
                    this.office.scale = new Vec2(5,5)
                    this.office.position.sub(new Vec2(0,100))
                    this.pc.scale = new Vec2(1.75,1.75)
                    this.pc.position.sub(new Vec2(200,50))
                    this.map.scale = new Vec2(0.1,0.1)
                    this.map.position = this.pc.position.clone().sub(new Vec2(25,27.5))
                    this.desk.scale = new Vec2(12,7)
                    this.desk.position = this.pc.position.clone().add(new Vec2(0,100))
                    this.prof.tweens.stopAll()
                    this.prof.animation.play(PlayerAnimations.HAPPY, false, Events.Next_Anim)
                    this.prof.position = this.c.clone()
                    this.prof.scale = new Vec2(6,6)
                    break
                case Events.Next_Anim:
                    this.prof.animation.play(PlayerAnimations.IDLE_WHITE, true)
                    let lbl1 = initLabel(this, Layer.Main, this.c.clone().add(new Vec2(0,300)), 'Thank goodness! I\'m finally out of the game.')
                    let flag = 0
                    let repeat = true
                    let time = 3500
                    let f1 = () => {
                        switch (flag) {
                            case 0:
                                lbl1.text = 'I swear to always set my pointers to null!'
                                this.prof.animation.play(PlayerAnimations.CRY, true)
                                flag = 1
                                break
                            case 1:
                                lbl1.text = 'And comment every single code I write.'
                                flag = 2
                                break
                            case 2:
                                lbl1.text = 'Oh no! I\'m late to lecture!'
                                this.prof.animation.play(PlayerAnimations.DAMAGE, true)
                                this.clock.animation.play('LATE', true)
                                flag = 3
                                break
                            case 3:
                                lbl1.text = 'Thank you for playing!'
                                this.prof.animation.play(PlayerAnimations.WALK_RIGHT_WHITE, true)
                                this.prof.tweens.play('move_right', false)
                                flag = 4
                                break
                        }
                    }
                    new Timer(time, f1, repeat).start()
                    break
            }
        }
    }
}