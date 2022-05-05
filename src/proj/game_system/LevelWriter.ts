import { LEVEL_SAVE_DATA } from "../scene/Constants";

/**
 * Util for managing locked level data
 */
export class LevelWriter {
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
        switch (name) {
            case 'Level2_1':
                this.o.lock2 = false
                break
            case 'Level3_1':
                this.o.lock3 = false
                break
            case 'Level4_1':
                this.o.lock4 = false
                break
            case 'Level5_1':
                this.o.lock5= false
                break
            case 'Level6_1':
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