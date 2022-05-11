import { LEVEL_SAVE_DATA } from "../scene/Constants";
import { LevelIntro2 } from "../scene/LevelIntro";

/**
 * Util for managing locked level data
 */
export class LevelUnlocker {
    private o: any

    constructor() {
        let s = localStorage.getItem(LEVEL_SAVE_DATA)
        if (s) {
            this.o = JSON.parse(s)
        } else {
            this.o = {
                lock2: true,
                lock3: true,
                lock4: true,
                lock5: true,
                lock6: true
            }
        }
    }

    unlockAllLevels() {
        this.o.lock2 = false
        this.o.lock3 = false
        this.o.lock4 = false
        this.o.lock5= false
        this.o.lock6 = false
        this.save()
    }

    unlockLevel(name: string) {
        console.log(`Attempting to unlock: ${name}`)
        switch (name) {
            case 'LevelIntro2':
                this.o.lock2 = false
                break
            case 'LevelIntro3':
                this.o.lock3 = false
                break
            case 'LevelIntro4':
                this.o.lock4 = false
                break
            case 'LevelIntro5':
                this.o.lock5= false
                break
            case 'LevelIntro6':
                this.o.lock6 = false
                break
        }
        this.save()
    }

    isLevel2Locked(): boolean {
        return this.o.lock2
    }

    isLevel3Locked(): boolean {
        return this.o.lock3
    }
    
    isLevel4Locked(): boolean {
        return this.o.lock4
    }

    isLevel5Locked(): boolean {
        return this.o.lock5
    }

    isLevel6Locked(): boolean {
        return this.o.lock6
    }

    save(): void {
        localStorage.setItem(LEVEL_SAVE_DATA, JSON.stringify(this.o))
    }
}

export const LU = new LevelUnlocker()