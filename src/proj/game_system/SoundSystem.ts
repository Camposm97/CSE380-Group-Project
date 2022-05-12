import AudioManager, { AudioChannelType } from "../../Wolfie2D/Sound/AudioManager"

export default class SoundSystem {
    static KEY = 'volume_settings'
    private static ss: SoundSystem = new SoundSystem()
    private settings: any

    constructor() {
        let str = localStorage.getItem(SoundSystem.KEY)
        if (str) {
            this.settings = JSON.parse(str)
            AudioManager.setVolume(AudioChannelType.SFX, this.settings.sfxVol)
            AudioManager.setVolume(AudioChannelType.MUSIC, this.settings.musicVol)
        } else {
            this.settings = {
                sfxVol: 1.0,
                musicVol: 1.0
            }
        }
    }

    getSFXVolume(): number {
        return this.settings.sfxVol
    }

    getMusicVolume(): number {
        return this.settings.musicVol
    }

    setSFXVolume(sfxVol: number): void {
        this.settings.sfxVol = sfxVol
        AudioManager.setVolume(AudioChannelType.SFX, this.settings.sfxVol)
        localStorage.setItem(SoundSystem.KEY, JSON.stringify(this.settings))
    }

    setMusicVolume(musicVol: number): void {
        this.settings.musicVol = musicVol
        AudioManager.setVolume(AudioChannelType.MUSIC, this.settings.musicVol)
        localStorage.setItem(SoundSystem.KEY, JSON.stringify(this.settings))
    }

    public static get(): SoundSystem {
        if (this.ss) {
            return this.ss
        } else {
            this.ss = new SoundSystem()
            return this.ss
        }
    }
}