import Scene from "../../Wolfie2D/Scene/Scene";

/**
 * This is where we'll display the ending scene of where 
 * Prof. McBendorjee frees his conscience from the code.
 * He is relieved to be free and swears to never forget to set a null pointer reference.
 * He then realizes he's late to lecture and scurries to his class.
 */
export class Ending extends Scene {
    loadScene(): void {
        this.load.spritesheet('mcbendorjee', 'res/spritesheets/mcbendorjee.json')
        this.load.spritesheet('rm_blue', 'res/spritesheets/robots/robot_mouse_blue.json')
    }
    startScene(): void {
        
    }
    updateScene(deltaT: number): void {
        
    }
}