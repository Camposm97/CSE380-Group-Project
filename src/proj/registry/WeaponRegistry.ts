import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import LaserGun from "../game_system/items/weapon_types/LaserGun";
import SemiAutoGun from "../game_system/items/weapon_types/SemiAutoGun";
import Slice from "../game_system/items/weapon_types/Slice";
import WeaponType from "../game_system/items/weapon_types/WeaponType";

export default class WeaponTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load sprites
        rm.image("pistol", "res/sprites/pistol.png");
        rm.image("knife", "res/sprites/knife.png");
        rm.image("laserGun", "res/sprites/laserGun.png")

        // Load spritesheets
        rm.spritesheet("slice", "res/spritesheets/slice.json");

        // Register default types
        this.registerItem("slice", Slice);
        this.registerItem("laserGun", LaserGun);
        this.registerItem("semiAutoGun", SemiAutoGun);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: WeaponConstructor): void {
        this.add(key, constr);
    }
}

type WeaponConstructor = new (...args: any) => WeaponType;