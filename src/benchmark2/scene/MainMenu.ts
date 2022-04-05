import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameLevel from "./GameLevel";

export default class MainMenu extends Scene {
    private mainMenu: Layer
    private levelSelect: Layer
    private controls: Layer
    private help: Layer
    private leaderboard: Layer

    private BT_EVENT = {
        MENU: "menu",
        PLAY: "play",
        LEVEL_SELECT: "level_select",
        CONTROLS: "controls",
        HELP: "about",
        LEADERBOARD: "leaderboard"
    };


    startScene(): void {        
        let center = this.viewport.getCenter().clone()
        this.initMenuButtons(center)
        this.initLevelSelectScene(center)
        this.initControlScene(center)
        this.initHelpScene(center)
        this.initLeaderboardScene(center)

        // Subscribe to the button events
        this.receiver.subscribe(this.BT_EVENT.MENU)
        this.receiver.subscribe(this.BT_EVENT.PLAY)
        this.receiver.subscribe(this.BT_EVENT.LEVEL_SELECT)
        this.receiver.subscribe(this.BT_EVENT.CONTROLS)
        this.receiver.subscribe(this.BT_EVENT.HELP)
        this.receiver.subscribe(this.BT_EVENT.LEADERBOARD)
    }

    initMenuButtons(v: Vec2): void {
        this.mainMenu = this.addUILayer('mainMenu')
        const layer = 'mainMenu'
        this.initButton(layer, new Vec2(v.x, v.y - 150), 'Play', this.BT_EVENT.PLAY)
        this.initButton(layer, new Vec2(v.x, v.y - 75), 'Level Select', this.BT_EVENT.LEVEL_SELECT)
        this.initButton(layer, new Vec2(v.x, v.y - 0), 'Controls', this.BT_EVENT.CONTROLS)
        this.initButton(layer, new Vec2(v.x, v.y + 75), 'Help', this.BT_EVENT.HELP)
        this.initButton(layer, new Vec2(v.x, v.y + 150), 'Leaderboard', this.BT_EVENT.LEADERBOARD)
    }

    initButton(layer: string, pos: Vec2, text: string, eventId: string): void {
        let bt = this.add.uiElement(UIElementType.BUTTON, layer, {position: pos, text: text})
        bt.size.set(200, 50)
        bt.borderWidth = 2
        bt.borderColor = Color.WHITE
        bt.backgroundColor = Color.TRANSPARENT
        bt.onClickEventId = eventId
    }

    initLevelSelectScene(center: Vec2): void {
        this.levelSelect = this.addUILayer('levelSelect')
    }

    initControlScene(center: Vec2): void {
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "controls",
            {
                position: new Vec2(center.x, center.y - 300),
                text: "Controls"
            });
        controlsHeader.textColor = Color.WHITE;

        const wu = <Label>this.add.uiElement(UIElementType.LABEL, "controls",
            {
                position: new Vec2(center.x, center.y - 50),
                text: "W/Up-Arrow to move up"
            });
        wu.textColor = Color.WHITE;
        const al = <Label>this.add.uiElement(UIElementType.LABEL, "controls", 
            { 
                position: new Vec2(center.x, center.y), 
                text: "A/Left-Arrow to move left" 
            });
        al.textColor = Color.WHITE;
        const sd = <Label>this.add.uiElement(UIElementType.LABEL, "controls", 
            { 
                position: new Vec2(center.x, center.y + 50), 
                text: "S/Down-Arrow to move down" 
            });
        sd.textColor = Color.WHITE;
        const dr = <Label>this.add.uiElement(UIElementType.LABEL, "controls", 
            { 
                position: new Vec2(center.x, center.y + 100),
                text: "D/Right-Arrow to move right" 
            });
        dr.textColor = Color.WHITE;
        const lclick = <Label>this.add.uiElement(UIElementType.LABEL, "controls", 
            {
                position: new Vec2(center.x, center.y + 150),
                text: "Sapce/Left-Click to attack"
            });
        lclick.textColor = Color.WHITE;
        const rclick = <Label>this.add.uiElement(UIElementType.LABEL, "controls", 
            {
                position: new Vec2(center.x, center.y - 100),
                text: "Shift/Right-Click to place flag"
            });
        rclick.textColor = Color.WHITE;
        const p = <Label>this.add.uiElement(UIElementType.LABEL, "controls", 
            {
                position: new Vec2(center.x, center.y - 150),
                text: "P - panic button, resets the room to its original sate"
            });
        p.textColor = Color.WHITE;
        const esc = <Label>this.add.uiElement(UIElementType.LABEL, "controls", 
            {
                position: new Vec2(center.x, center.y - 250),
                text: "ESC pause the game"
            });
        esc.textColor = Color.WHITE;

        const back = this.add.uiElement(UIElementType.BUTTON, "controls", 
            {
                position: new Vec2(center.x, center.y + 250), 
                text: "Back" 
            });
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = this.BT_EVENT.MENU;
    }

    initHelpScene(center: Vec2) {
        // Controls Scene
        this.help = this.addUILayer("about");
        this.help.setHidden(true);

        // About Header
        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", 
        {
            position: new Vec2(center.x, center.y - 300),
            text: "About"
        });
        aboutHeader.textColor = Color.WHITE;

        const strAbout1 = "This game was created by Andrew Ojeda, Michael Campos, Tuyen Vo";
        const strAbout2 = "using the Wolfie2D game engine, a TypeScript game engine created by";
        const strAbout3 = "Joe Weaver and Richard McKenna.";

        const lblAbout1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", 
        {
            position: new Vec2(center.x, center.y - 50), text: strAbout1 });
        const lblAbout2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", 
        { 
            position: new Vec2(center.x, center.y), 
            text: strAbout2 
        });
        const lblAbout3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", 
        { 
            position: new Vec2(center.x, center.y + 50), 
            text: strAbout3 
        });

        lblAbout1.textColor = Color.WHITE;
        lblAbout2.textColor = Color.WHITE;
        lblAbout3.textColor = Color.WHITE;

        const FONT_SIZE = 24;
        lblAbout1.fontSize = FONT_SIZE;
        lblAbout2.fontSize = FONT_SIZE;
        lblAbout3.fontSize = FONT_SIZE;

        // About - Back Button
        const aboutBack = this.add.uiElement(UIElementType.BUTTON, "about", 
            {
                position: new Vec2(center.x, center.y + 250),
                text: "Back"
            });
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = this.BT_EVENT.MENU;
    }

    initLeaderboardScene(center: Vec2): void {
        this.leaderboard = this.addUILayer('leaderboard')
    }

    updateScene() {
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent()
            if (event.type === this.BT_EVENT.MENU) {
                this.mainMenu.setHidden(false)
                this.help.setHidden(true)
                this.controls.setHidden(true)
            }
            if (event.type === this.BT_EVENT.PLAY) {
                this.sceneManager.changeToScene(GameLevel, {});
            }
            if (event.type === this.BT_EVENT.LEVEL_SELECT) {
                
            }
            if (event.type === this.BT_EVENT.CONTROLS) {
                this.mainMenu.setHidden(true)
                this.controls.setHidden(false)
            }
            if (event.type === this.BT_EVENT.HELP) {
                this.help.setHidden(false)
                this.mainMenu.setHidden(true)
            }
            if (event.type === this.BT_EVENT.LEADERBOARD) {
                
            }
        }
    }
}