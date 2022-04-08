import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./benchmark2/scene/MainMenu";
import RegistryManager from "./Wolfie2D/Registry/RegistryManager";
import WeaponTemplateRegistry from "./benchmark2/registry/WeaponRegistry";
import WeaponTypeRegistry from "./benchmark2/registry/WeaponTypeRegistry";
import SplashScreen from "./benchmark2/scene/SplashScreen";
import { Control } from "./benchmark2/scene/Constants";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 0.1, g: 0.1, b: 0.1},   // The color the game clears to
        inputs: [
            {name: Control.FORWARD, keys: ["w", "arrowup"]},
            {name: Control.BACKWARD, keys: ["s", "arrowdown"]},
            {name: Control.LEFT, keys: ["a", "arrowleft"]},
            {name: Control.RIGHT, keys: ["d", "arrowright"]},
            {name: Control.ATTACK, keys: ["space", 1]},
            {name: Control.PLACE_FLAG, keys: ["shift", 2]},
            {name: Control.PANIC, keys: ["p"]},
            {name: Control.PAUSE, keys: ["escape"]},
            {name: Control.PICK_UP, keys: ["e"]},
            {name: Control.DROP, keys: ["q"]},
            {name: Control.SLOT1, keys: ["1"]},
            {name: Control.SLOT2, keys: ["2"]},
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Set up custom registries
    let weaponTemplateRegistry = new WeaponTemplateRegistry();
    RegistryManager.addCustomRegistry("weaponTemplates", weaponTemplateRegistry);
    
    let weaponTypeRegistry = new WeaponTypeRegistry();
    RegistryManager.addCustomRegistry("weaponTypes", weaponTypeRegistry);

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(SplashScreen, {});
})();