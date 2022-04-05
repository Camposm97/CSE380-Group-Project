import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level1 extends GameLevel {
    

    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "hw5_assets/tilemaps/level1.json");
        this.load.spritesheet("player", "hw5_assets/spritesheets/spike.json");
        this.load.spritesheet("red", "hw5_assets/spritesheets/redBalloon.json");
        this.load.spritesheet("blue", "hw5_assets/spritesheets/blueBalloon.json");
        this.load.audio("jump", "hw5_assets/sounds/jump.wav");
        this.load.audio("switch", "hw5_assets/sounds/switch.wav");
        this.load.audio("player_death", "hw5_assets/sounds/player_death.wav");
    
        this.load.audio("level_music", "hw5_assets/music/level1.mp3");
        this.load.audio("balloon_pop", "hw5_assets/sounds/balloon_pop.wav")
    }

    
    unloadScene(){
        // Keep resources - this is up to you
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: 'level_music'});
        this.load.keepSpritesheet("player");
        this.load.keepSpritesheet("red");
        this.load.keepSpritesheet("blue");
        this.load.keepAudio("jump");
        this.load.keepAudio("switch");
        this.load.keepAudio("player_death");
        this.load.keepAudio("balloon_pop");
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level6", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

       
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}