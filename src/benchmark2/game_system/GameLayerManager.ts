import Layer from "../../Wolfie2D/Scene/Layer";
import GameLevel from "../scene/GameLevel";
import Color from "../../Wolfie2D/Utils/Color";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { Events } from "../scene/Constants";
import BattlerAI from "../ai/BattlerAI";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { initButtonHandler, initLabel } from "../ui/UIBuilder";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";

enum LayerType {
    PRIMARY = 'primary',
    HUD = 'hud',
    PAUSE = 'pause',
    CONTROLS = 'controls',
    ROOM_COMPLETE = 'ROOM_COMPLETE'
}

export class GameLayerManager {
    private scene: GameLevel
    private primaryLayer: Layer
    private hudLayer: Layer
    private pauseLayer: Layer
    private controlsLayer: Layer
    private roomCompleteLayer: Layer
    private lblRoomEnd: Label
    private levelTransitionScreen: Rect

    /**
     * Initializes primary layer when constructed
     * @param scene 
     */
    constructor(scene: GameLevel) {
        this.scene = scene
        this.primaryLayer = scene.addLayer('primary', 10);
        scene.addUILayer("UI")
        this.levelTransitionScreen = <Rect>scene.add.graphic(GraphicType.RECT, "UI", { position: new Vec2(300, 200), size: new Vec2(600, 400) });
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: Events.LEVEL_END
        });

        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            // onEnd: Events.LEVEL_START
        });
    }

    initHudLayer(): void {
        let c = this.scene.getViewport().getCenter().clone()
        let s = this.scene.getViewport().getZoomLevel()
        // Add a UI for health
        this.hudLayer = this.scene.addUILayer(LayerType.HUD)
        let lblHealth = initLabel(this.scene, LayerType.HUD, new Vec2(60,16), `HP: ${(<BattlerAI>this.scene.getPlayer()._ai).health}`)
        this.scene.setLblHealth(lblHealth)
        let lblTime = initLabel(this.scene, LayerType.HUD, new Vec2((c.x/s)+170, 16), "")
        this.scene.setLblTime(lblTime)
        initLabel(this.scene, LayerType.HUD, new Vec2((c.x/s)+170, (c.y/s)+120), `Level ${this.scene.getName()}`)
    }

    initPauseLayer(): void {
        let c = this.scene.getViewport().getCenter().clone()
        this.pauseLayer = this.scene.addLayer(LayerType.PAUSE, 1)
        initLabel(this.scene, LayerType.PAUSE, new Vec2(c.x,c.y-250), `Level ${this.scene.getName()}`)
        initButtonHandler(this.scene, LayerType.PAUSE, new Vec2(c.x, c.y-150), 'Resume', Events.PAUSE_GAME)
        initButtonHandler(this.scene, LayerType.PAUSE, new Vec2(c.x, c.y-75), 'Reset Room', Events.RESET_ROOM)
        initButtonHandler(this.scene, LayerType.PAUSE, c, 'Controls', Events.SHOW_CONTROLS)
        initButtonHandler(this.scene, LayerType.PAUSE, new Vec2(c.x, c.y+75), 'Exit', Events.EXIT_GAME)
        this.pauseLayer.setHidden(true)
    }

    initControlsLayer(): void {
        this.controlsLayer = this.scene.addUILayer(LayerType.CONTROLS);
        this.controlsLayer.setHidden(true);

        const center = this.scene.getViewport().getCenter().clone()

        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y-300), "Controls")
        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y-200), "ESC - pause the game")
        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y-150), "P - panic button, resets the room to its original state")
        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y-100), "Shift/Right-Click to place flag")
        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y-50), "W/Up-Arrow to move up")
        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y), "A/Left-Arrow to move left")
        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y+50), "S/Down-Arrow to move down" )
        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y+100), "D/Right-Arrow to move right")
        initLabel(this.scene, LayerType.CONTROLS, new Vec2(center.x,center.y+150), "Space/Left-Click to attack")
        initButtonHandler(this.scene, LayerType.CONTROLS, new Vec2(center.x, center.y+250), 'Back', Events.SHOW_CONTROLS)
    }

    initRoomCompleteLayer(): void {
        this.roomCompleteLayer = this.scene.addUILayer(LayerType.ROOM_COMPLETE)
        this.roomCompleteLayer.setHidden(true)
        let c = this.scene.getViewport().getCenter().clone()
        let scale = this.scene.getViewport().getZoomLevel()
        this.lblRoomEnd = initLabel(this.scene, LayerType.ROOM_COMPLETE, new Vec2((c.x/scale)-600, c.y/scale), "Room Complete!")
        this.lblRoomEnd.size.set(1200,60)
        this.lblRoomEnd.borderRadius = 0;
        this.lblRoomEnd.backgroundColor = new Color(34, 32, 52);
        this.lblRoomEnd.fontSize = 48;
        this.lblRoomEnd.tweens.add('slideIn', {
            startDelay: 300,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: this.lblRoomEnd.position.x,
                    end: (c.x/scale),
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            onEnd: Events.ROOM_COMPLETE
        })
    }

    showRoomComplete(): void {
        this.roomCompleteLayer.setHidden(false)
        this.lblRoomEnd.tweens.play('slideIn', false)
    }

    showFadeIn(): void {
        this.levelTransitionScreen.tweens.play('fadeIn', false)
    }

    showFadeOut(): void {
        this.levelTransitionScreen.tweens.play('fadeOut', false)
    }

    /**
     * 
     * @returns false if primaryLayer is hidden, else it returns true
     */
    showPause(): boolean {
        this.primaryLayer.setHidden(!this.primaryLayer.isHidden())
        this.hudLayer.setHidden(!this.hudLayer.isHidden())
        this.pauseLayer.setHidden(!this.pauseLayer.isHidden())
        this.scene.getTilemap('Floor').visible = !this.scene.getTilemap('Floor').visible
        this.scene.getTilemap('Walls').visible = !this.scene.getTilemap('Walls').visible
        this.scene.getLayer('slots1').setHidden(!this.scene.getLayer('slots1').isHidden())
        this.scene.getLayer('items1').setHidden(!this.scene.getLayer('items1').isHidden())
        this.scene.getPlayer().setAIActive(!this.scene.getPlayer().aiActive, {})
        if (this.pauseLayer.isHidden()) {
            this.scene.getViewport().setZoomLevel(3)
        } else {
            this.scene.getViewport().setZoomLevel(1)
        }
        return this.primaryLayer.isHidden()
    }

    showControls() {
        this.controlsLayer.setHidden(!this.controlsLayer.isHidden())
        this.pauseLayer.setHidden(!this.pauseLayer.isHidden())
    }

    hideAllAndZoomOut() {
        this.primaryLayer.setHidden(true)
        this.hudLayer.setHidden(true)
        this.pauseLayer.setHidden(true)
        this.controlsLayer.setHidden(true)
        this.scene.getTilemap('Floor').visible = false
        this.scene.getTilemap('Walls').visible = false
        this.scene.getLayer('slots1').setHidden(true)
        this.scene.getLayer('items1').setHidden(true)
        this.scene.getViewport().setZoomLevel(1)
    }
}