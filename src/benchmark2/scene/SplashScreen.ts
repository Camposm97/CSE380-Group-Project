import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { initButton } from "../ui/UIBuilder";
import MainMenu from "./MainMenu";

export default class SplashScreen extends Scene {
    loadScene(): void {
        this.load.image("logo","res/sprites/Logo.png");
        this.load.image('prof', 'res/sprites/professor.png')  
        this.load.image('rm', 'res/sprites/rm.png')
    } 

    startScene(): void {
        // First, create a layer for it to go on
        this.addLayer("primary");
        
        // Center the viewport
        let c = this.viewport.getCenter().clone();

        let sprite = this.add.sprite("logo", "primary");
        sprite.positionX = 610;
        sprite.positionY = 200;

        sprite.scale = new Vec2(0.75,0.75);
        
        let profSprite = this.add.sprite('prof', 'primary')
        profSprite.scale = new Vec2(5.0,5.0)
        profSprite.position = new Vec2(c.x/2, c.y+50)

        let rm1 = this.add.sprite('rm', 'primary')
        rm1.position = new Vec2(c.x+300, c.y)
        let rm2 = this.add.sprite('rm', 'primary')
        rm2.position = new Vec2(c.x+350, c.y+50)
        let rm3 = this.add.sprite('rm', 'primary')
        rm3.position = new Vec2(c.x+275, c.y+75)

        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        // Create a play button
        let startBtn = initButton(this, 'primary', new Vec2(size.x, size.y), 'Click to Start', '')
        startBtn.size = new Vec2(250, 50)

        // When the play button is clicked, go to the next scene
        startBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {}, this.sceneOptions);   
        }
        startBtn.onEnter = () => {
            startBtn.fontSize = 32
            startBtn.size = new Vec2(255,55)
        }
        startBtn.onLeave = () => {
            startBtn.fontSize = 30
            startBtn.size = new Vec2(250,50)
        }

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }
}