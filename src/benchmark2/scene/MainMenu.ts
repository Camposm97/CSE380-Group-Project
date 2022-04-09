import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameLevel from "./GameLevel";
import Room1 from "./level_1/Room1";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";

enum MENU_EVENT {
    MENU = "menu",
    NEW_GAME = "new_game",
    LEVEL_SELECT = "level_select",
    CONTROLS = "controls",
    HELP = "about",
    LEADERBOARD = "leaderboard",
    LOAD_LVL_1 = "load_lvl_1",
    LOAD_LVL_2 = "load_lvl_2",
    LOAD_LVL_3 = "load_lvl_3",
    LOAD_LVL_4 = "load_lvl_4",
    LOAD_LVL_5 = "load_lvl_5",
    LOAD_LVL_6 = "load_lvl_6"
};

export default class MainMenu extends Scene {
    private mainMenu: Layer
    private levelSelect: Layer
    private controls: Layer
    private help: Layer
    private leaderboard: Layer

    startScene(): void {        
        let center = this.viewport.getCenter().clone()
        this.initMenuButtons(center)
        this.initLevelSelectScene(center)
        this.initControlScene(center)
        this.initHelpScene(center)
        this.initLeaderboardScene(center)
        


        // Subscribe to the button events
        this.receiver.subscribe(MENU_EVENT.MENU)
        this.receiver.subscribe(MENU_EVENT.NEW_GAME)
        this.receiver.subscribe(MENU_EVENT.LEVEL_SELECT)
        this.receiver.subscribe(MENU_EVENT.LOAD_LVL_1)
        this.receiver.subscribe(MENU_EVENT.LOAD_LVL_2)
        this.receiver.subscribe(MENU_EVENT.LOAD_LVL_3)
        this.receiver.subscribe(MENU_EVENT.LOAD_LVL_4)
        this.receiver.subscribe(MENU_EVENT.LOAD_LVL_5)
        this.receiver.subscribe(MENU_EVENT.LOAD_LVL_6)
        this.receiver.subscribe(MENU_EVENT.CONTROLS)
        this.receiver.subscribe(MENU_EVENT.HELP)
        this.receiver.subscribe(MENU_EVENT.LEADERBOARD)
    }

    initMenuButtons(v: Vec2): void {
        this.mainMenu = this.addUILayer('mainMenu')
        const layer = 'mainMenu'
        this.initButton(layer, new Vec2(v.x, v.y - 150), 'New Game', MENU_EVENT.NEW_GAME)
        this.initButton(layer, new Vec2(v.x, v.y - 75), 'Level Select', MENU_EVENT.LEVEL_SELECT)
        this.initButton(layer, new Vec2(v.x, v.y - 0), 'Controls', MENU_EVENT.CONTROLS)
        this.initButton(layer, new Vec2(v.x, v.y + 75), 'Help', MENU_EVENT.HELP)
        this.initButton(layer, new Vec2(v.x, v.y + 150), 'Leaderboard', MENU_EVENT.LEADERBOARD)
        
    
    }

    initButton(layer: string, pos: Vec2, text: string, eventId: string): void {
        let bt = <Button> this.add.uiElement(UIElementType.BUTTON, layer, {position: pos, text: text})
        bt.size.set(200, 50)
        bt.font = 'Comic Sans MS'
        bt.borderWidth = 2
        bt.borderColor = Color.WHITE
        bt.backgroundColor = Color.TRANSPARENT
        bt.onClickEventId = eventId
    }
 
    initLevelSelectScene(center: Vec2): void {
         // Level Select Boards Scene
         this.levelSelect = this.addUILayer('levelSelect')
         this.levelSelect.setHidden(true);
 
         // Level Select Header
         const leaderboardHeader = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {
                 position: new Vec2(center.x, center.y - 300),
                 text: "Level Select"
             });
         leaderboardHeader.textColor = Color.WHITE;

         //  Level Select - Buttons
         const l1 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect",{
             position: new Vec2(center.x-300, center.y -150),
             text: "Level 1"
         });
 
         const l2 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", { 
             position: new Vec2(center.x+300, center.y-150), 
             text: "Level 2"
         });

         const l3 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect",{
             position: new Vec2(center.x-300, center.y -50),
             text: "Level 3"
         });
 
         const l4 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", { 
             position: new Vec2(center.x+300, center.y-50), 
             text: "Level 4"
         });

         const l5 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect",{
             position: new Vec2(center.x-300, center.y +50),
             text: "Level 5"
         });
 
         const l6 = <Label>this.add.uiElement(UIElementType.BUTTON, "levelSelect", { 
             position: new Vec2(center.x+300, center.y+50), 
             text: "Level 6"
         });
         const back = this.add.uiElement(UIElementType.BUTTON, "levelSelect", 
         {
             position: new Vec2(center.x, center.y + 200),
             text: "Back"
         });
         l1.size.set(200, 50);
         l1.borderWidth = 2;
         l1.borderColor = Color.WHITE;
         l1.backgroundColor = Color.TRANSPARENT;
         l1.font = "Comic Sans MS"
         l1.onClickEventId = MENU_EVENT.LOAD_LVL_1

         l2.size.set(200, 50);
         l2.borderWidth = 2;
         l2.borderColor = Color.WHITE;
         l2.backgroundColor = Color.TRANSPARENT;
         l2.font = "Comic Sans MS"
         l2.onClickEventId = MENU_EVENT.LOAD_LVL_2

         l3.size.set(200, 50);
         l3.borderWidth = 2;
         l3.borderColor = Color.WHITE;
         l3.backgroundColor = Color.TRANSPARENT;
         l3.onClickEventId = MENU_EVENT.MENU;
         l3.font = "Comic Sans MS"
         l3.onClickEventId = MENU_EVENT.LOAD_LVL_3

         l4.size.set(200, 50);
         l4.borderWidth = 2;
         l4.borderColor = Color.WHITE;
         l4.backgroundColor = Color.TRANSPARENT;
         l4.onClickEventId = MENU_EVENT.MENU;
         l4.font = "Comic Sans MS"
         l4.onClickEventId = MENU_EVENT.LOAD_LVL_4

         l5.size.set(200, 50);
         l5.borderWidth = 2;
         l5.borderColor = Color.WHITE;
         l5.backgroundColor = Color.TRANSPARENT;
         l5.onClickEventId = MENU_EVENT.MENU;
         l5.font = "Comic Sans MS"
         l5.onClickEventId = MENU_EVENT.LOAD_LVL_5

         l6.size.set(200, 50);
         l6.borderWidth = 2;
         l6.borderColor = Color.WHITE;
         l6.backgroundColor = Color.TRANSPARENT;
         l6.onClickEventId = MENU_EVENT.MENU;
         l6.font = "Comic Sans MS"
         l6.onClickEventId = MENU_EVENT.LOAD_LVL_6

         back.size.set(200, 50);
         back.borderWidth = 2;
         back.borderColor = Color.WHITE;
         back.backgroundColor = Color.TRANSPARENT;
         back.onClickEventId = MENU_EVENT.MENU;
    }
    

    initControlScene(center: Vec2): void {
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "controls",
            {
                position: new Vec2(center.x, center.y - 300),
                text: "Controls", 

                
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
                text: "Space/Left-Click to attack"
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
        p.font = "Comic Sans MS"
        const esc = <Label>this.add.uiElement(UIElementType.LABEL, "controls", 
            {
                position: new Vec2(center.x, center.y - 200),
                text: "ESC - pause the game"
            });
        esc.textColor = Color.WHITE;
        esc.font = "Comic Sans MS"

        const back = this.add.uiElement(UIElementType.BUTTON, "controls", 
            {
                position: new Vec2(center.x, center.y + 250), 
                text: "Back" ,
                font:  "Comic Sans MS"
            });
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = MENU_EVENT.MENU;
        
        
    }

    initHelpScene(center: Vec2) {
        // Controls Scene
        this.help = this.addUILayer("help");
        this.help.setHidden(true);

        // About Header
        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        {
            position: new Vec2(center.x, center.y - 350),
            text: "Help"
        });
        aboutHeader.textColor = Color.WHITE;

        const strAbout1 = "Developed by Andrew Ojeda, Michael Campos, and Tuyen Vo";
        const strAbout2 = "Professor McBendorjee was busy trying to recreate the Wolfie 2D engine";
        const strAbout3 = "from scratch using nothing but C and MIPs for his CSE 420 class,"
        const strAbout4 = "when he accidentally forgot to give a character array a null pointer reference.";
        const strAbout5 = "This led to a catastrophic chain of events that culminated in Professor McBendorjee";
        const strAbout6 = "getting his own conscience written into the main character sprite."
        const strAbout7 = "Now he will have to brave the Al robots he was creating to escape Wolfie 2D or be forever stuck.";
        const strAbout8 = "Cheat Codes: cheatCode1, cheatCode2, ...,cheatCodeN";



        const lblAbout1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        {
            position: new Vec2(center.x, center.y - 250), 
            text: strAbout1 
        });
        const lblAbout2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        { 
            position: new Vec2(center.x, center.y -150), 
            text: strAbout2 
        });
        const lblAbout3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        { 
            position: new Vec2(center.x, center.y - 100), 
            text: strAbout3 
        });
        const lblAbout4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        {
            position: new Vec2(center.x, center.y - 50), 
            text: strAbout4 
        });
        const lblAbout5 = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        { 
            position: new Vec2(center.x, center.y -5), 
            text: strAbout5 
        });
        const lblAbout6 = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        { 
            position: new Vec2(center.x, center.y + 50), 
            text: strAbout6 
        });
        const lblAbout7 = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        { 
            position: new Vec2(center.x, center.y + 100), 
            text: strAbout7 
        });
        const lblAbout8 = <Label>this.add.uiElement(UIElementType.LABEL, "help", 
        { 
            position: new Vec2(center.x, center.y + 150), 
            text: strAbout8 
        });
        

        lblAbout1.textColor = Color.WHITE;
        lblAbout2.textColor = Color.WHITE;
        lblAbout3.textColor = Color.WHITE;
        lblAbout4.textColor = Color.WHITE;
        lblAbout5.textColor = Color.WHITE;
        lblAbout6.textColor = Color.WHITE;
        lblAbout7.textColor = Color.WHITE;
        lblAbout8.textColor = Color.WHITE;

        const FONT_SIZE = 24;
        lblAbout1.fontSize = FONT_SIZE;
        lblAbout2.fontSize = FONT_SIZE;
        lblAbout3.fontSize = FONT_SIZE;
        lblAbout4.fontSize = FONT_SIZE;
        lblAbout5.fontSize = FONT_SIZE;
        lblAbout6.fontSize = FONT_SIZE;
        lblAbout7.fontSize = FONT_SIZE;
        lblAbout8.fontSize = FONT_SIZE;


        // About - Back Button
        const aboutBack = this.add.uiElement(UIElementType.BUTTON, "help", 
            {
                position: new Vec2(center.x, center.y + 250),
                text: "Back"
            });
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = MENU_EVENT.MENU;
    }

    initLeaderboardScene(center: Vec2): void {
        // Leader Boards Scene
        this.leaderboard = this.addUILayer('leaderboard')
        this.leaderboard.setHidden(true);

        // Leader Boards Header
        const leaderboardHeader = <Label>this.add.uiElement(UIElementType.LABEL, "leaderboard",
            {
                position: new Vec2(center.x, center.y - 300),
                text: "Leader Boards"
            });
        leaderboardHeader.textColor = Color.WHITE;

        const name = <Label>this.add.uiElement(UIElementType.LABEL, "leaderboard",
        {
            position: new Vec2(center.x-300, center.y -200),
            text: "Names"
        
            
        });
        name.textColor = Color.WHITE;
        name.font = "Comic Sans MS"

        const score = <Label>this.add.uiElement(UIElementType.LABEL, "leaderboard", 
        { 
            position: new Vec2(center.x+300, center.y-200), 
            text: "Score"

           
        });
        score.textColor = Color.WHITE;
        score.font = "Comic Sans MS"

        // Leader Boards - Back Button
        const back = this.add.uiElement(UIElementType.BUTTON, "leaderboard", 
        {
            position: new Vec2(center.x, center.y + 250),
            text: "Back"
        });
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = MENU_EVENT.MENU;

    }

    updateScene() {
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent()
            switch (event.type) {
                case MENU_EVENT.MENU:
                    this.mainMenu.setHidden(false)
                    this.help.setHidden(true)
                    this.controls.setHidden(true)
                    this.leaderboard.setHidden(true)
                    this.levelSelect.setHidden(true)
                    break;
                case MENU_EVENT.NEW_GAME:
                    this.sceneManager.changeToScene(Room1, {});
                    break;
                case MENU_EVENT.LEVEL_SELECT:
                    this.mainMenu.setHidden(true)
                    this.levelSelect.setHidden(false)
                    break;
                case MENU_EVENT.LOAD_LVL_1:
                    console.log('load a level here!')
                    break;
                case MENU_EVENT.LOAD_LVL_2:
                    console.log('load a level here!')
                    break;
                case MENU_EVENT.LOAD_LVL_3:
                    console.log('load a level here!')
                    break;
                case MENU_EVENT.LOAD_LVL_4:
                    console.log('load a level here!')
                    break;
                case MENU_EVENT.LOAD_LVL_5:
                    console.log('load a level here!')
                    break;
                case MENU_EVENT.LOAD_LVL_6:
                    console.log('load a level here!')
                    break;
                case MENU_EVENT.CONTROLS:
                    this.mainMenu.setHidden(true)
                    this.controls.setHidden(false)
                    break;
                case MENU_EVENT.HELP:
                    this.help.setHidden(false)
                    this.mainMenu.setHidden(true)
                    break;
                case MENU_EVENT.LEADERBOARD:
                    this.leaderboard.setHidden(false)
                    this.mainMenu.setHidden(true)
                    break;
            }
        }
    }
}