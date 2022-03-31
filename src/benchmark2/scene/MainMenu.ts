import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";

export default class MainMenu extends Scene {
    private mainMenu: Layer
    private about: Layer
    private controls: Layer

    private MENU_TYPE = {
        MENU: "menu",
        PLAY: "play",
        CONTROLS: "controls",
        ABOUT: "about"
    };


    startScene(): void {
        let center = this.viewport.getCenter().clone()
        this.initMenuScene(center)
        this.initControlScene(center);
        this.initAboutScene(center);

        // Subscribe to the button events
        this.receiver.subscribe(this.MENU_TYPE.MENU)
        this.receiver.subscribe(this.MENU_TYPE.PLAY)
        this.receiver.subscribe(this.MENU_TYPE.CONTROLS)
        this.receiver.subscribe(this.MENU_TYPE.ABOUT)
    }

    initMenuScene(center: Vec2): void {
        this.mainMenu = this.addUILayer("mainMenu");
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Play"})
        play.size.set(200, 50)
        play.borderWidth = 2
        play.borderColor = Color.WHITE
        play.backgroundColor = Color.TRANSPARENT
        play.onClickEventId = this.MENU_TYPE.PLAY
    }

    initControlScene(center: Vec2) {
        // Add controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Controls"});
        controls.size.set(200, 50);
        controls.borderWidth = 2;
        controls.borderColor = Color.WHITE;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = this.MENU_TYPE.CONTROLS;

        // Controls screen
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const header = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        header.textColor = Color.WHITE;

        const ws = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 50), text: "Right Click to move selected player to the clicked point on screen"});
        ws.textColor = Color.WHITE;
        const ad = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y), text: "E to pick up an item from the ground"});
        ad.textColor = Color.WHITE;
        const click = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 50), text: "Q to drop the current item on the ground"});
        click.textColor = Color.WHITE;
        const shift = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 100), text: "1 and 2 to equip an inventory item"});
        shift.textColor = Color.WHITE
        const shift2 = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 150), text: "Z and X to swap between player characters"});
        shift2.textColor = Color.WHITE;

        const back = this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = this.MENU_TYPE.MENU;
    }

    initAboutScene(center: Vec2) {
        // Add about button
        const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "About"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = this.MENU_TYPE.ABOUT

        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        // About Header
        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 250), text: "About"});
        aboutHeader.textColor = Color.WHITE;

        const strAbout1 = "This game was created by Michael Campos, Zachary Grandison, and Richard McKenna";
        const strAbout2 = "using the Wolfie2D game engine, a TypeScript game engine created by";
        const strAbout3 = "Joe Weaver and Richard McKenna.";

        const lblAbout1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 50), text: strAbout1});
        const lblAbout2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: strAbout2});
        const lblAbout3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: strAbout3});

        lblAbout1.textColor = Color.WHITE;
        lblAbout2.textColor = Color.WHITE;
        lblAbout3.textColor = Color.WHITE;

        const FONT_SIZE = 24;
        lblAbout1.fontSize = FONT_SIZE;
        lblAbout2.fontSize = FONT_SIZE;
        lblAbout3.fontSize = FONT_SIZE;

        // About - Back Button
        const aboutBack = this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = this.MENU_TYPE.MENU;
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent()
            if(event.type === this.MENU_TYPE.MENU){
                this.mainMenu.setHidden(false)
                this.about.setHidden(true)
                this.controls.setHidden(true)
            }
            if(event.type === this.MENU_TYPE.PLAY){
                // this.sceneManager.changeToScene(hw4_scene, {});
            }
            if(event.type === this.MENU_TYPE.CONTROLS){
                this.mainMenu.setHidden(true)
                this.controls.setHidden(false)
            }
            if(event.type === this.MENU_TYPE.ABOUT){
                this.about.setHidden(false)
                this.mainMenu.setHidden(true)
            }
        }
    }
}