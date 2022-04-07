import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class SplashScreen extends Scene {
    private logo: AnimatedSprite;
    loadScene(): void {
        this.load.image("logo","res/sprites/Logo.png");
        
    }

    startScene(): void {
        // First, create a layer for it to go on
        this.addLayer("primary");
        


        // Center the viewport
        let cetner = this.viewport.getCenter().clone();

        let sprite = this.add.sprite("logo", "primary");
        sprite.positionX = 610;
        sprite.positionY = 200;

        sprite.scale = new Vec2(0.75,0.75);
        

        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        // Create a play button
        let startBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(size.x, size.y), text: "Click to Start"});
        startBtn.backgroundColor = Color.TRANSPARENT;
        startBtn.borderColor = Color.WHITE;
        startBtn.borderRadius = 0;
        startBtn.setPadding(new Vec2(50, 10));
        startBtn.font = "Comic Sans MS"

        // When the play button is clicked, go to the next scene
        startBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {}, this.sceneOptions);
            
        }

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }
}