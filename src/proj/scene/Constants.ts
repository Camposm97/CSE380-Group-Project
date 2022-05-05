export const LEVEL_SAVE_DATA = "level_save_data";
export const LEADERBOARD_DATA = "leaderboard_data";

export enum CheatCode { // TODO; FIX SKIP TO LEVEL N cheat
  INVINCIBLE = "invincible",
  SKIP_LEVEL = "skip",
  SHOW_ALL_BOMBS = "showAllBombs",
  UNLOCK_ALL_LVLS = "unlockAllLvls",
  LVL_1 = "1",
  LVL_2 = "2",
  LVL_3 = "3",
  LVL_4 = "4",
  LVL_5 = "5",
  LVL_6 = "6",
  ENDING = "ending",
}

export const Cheats = {
  invincible: false,
  unlockAllLevels: false,
};

export enum Names {
  NAVMESH = "navmesh",
}

export enum Control {
  FORWARD = "forward",
  BACKWARD = "backward",
  LEFT = "left",
  RIGHT = "right",
  ATTACK = "attack",
  PLACE_FLAG = "place-flag",
  PANIC = "panic",
  PAUSE = "pause",
  PICK_UP = "pickup",
  DROP = "drop",
  SLOT1 = "slot1",
  SLOT2 = "slot2",
  PUSH_PULL = "push-pull",
}

export enum MenuEvents {
  MENU = "menu",
  NEW_GAME = "new_game",
  LEVEL_SELECT = "level_select",
  CONTROLS = "controls",
  HELP = "about",
  LEADERBOARD = "leaderboard",
  LEVEL_LOCKED = "level_locked",
  LOAD_LVL_1 = "load_lvl_1",
  LOAD_LVL_2 = "load_lvl_2",
  LOAD_LVL_3 = "load_lvl_3",
  LOAD_LVL_4 = "load_lvl_4",
  LOAD_LVL_5 = "load_lvl_5",
  LOAD_LVL_6 = "load_lvl_6",
  HOW_TO_PLAY = "how_to_play",
}

export enum Events {
  SHOT_FIRED = "SHOT_FIRED",
  UNLOAD_ASSET = "UNLOAD_ASSET",
  PLACE_FLAG = "PLACE_FLAG",
  OVERRIDE_IDLE = "OVERRIDE_IDLE",
  RESET_ROOM = "RESET_ROOM",
  PAUSE_GAME = "PAUSE_GAME",
  SHOW_CONTROLS = "SHOW_CONTROLS",
  EXIT_GAME = "EXIT_GAME",
  DESTROY_BOMB = "DESTROY_BOMB",
  ROOM_COMPLETE = "ROOM_COMPLETE",
  PLAYER_WON = "LEVEL_END",
  PROJECTILE_UNLOAD = "PROJECTILE_UNLOAD",
  PLAYER_DIED = "PLAYER_DIED",
  SHOW_CHEATS = "SHOW_CHEATS",
  SHOW_ALL_BOMBS = "SHOW_ALL_BOMBS",
  END_I_FRAMES = "END_I_FRAMES",
}

export enum Statuses {
  IN_RANGE = "IN_RANGE",
  LOW_HEALTH = "LOW_HEALTH",
  CAN_RETREAT = "CAN_RETREAT",
  CAN_BERSERK = "CAN_BERSERK",
  REACHED_GOAL = "GOAL",
}

export enum CoatColor {
  WHITE = "WHITE",
  YELLOW = "YELLOW",
  ORANGE = "ORANGE",
  RED = "RED",
}

export enum PlayerAction {
  IDLE = "IDLE",
  WALK_UP = "WALK_UP",
  WALK_DOWN = "WALK_DOWN",
  WALK_RIGHT = "WALK_RIGHT",
  WALK_LEFT = "WALK_LEFT",
  LOOK_UP = "LOOK_UP",
  LOOK_DOWN = "LOOK_DOWN",
  LOOK_RIGHT = "LOOK_RIGHT",
  LOOK_LEFT = "LOOK_LEFT",
  DAMAGE = "DAMAGE",
}
export enum RobotAction {
  FIRE_PROJECTILE = "FIRE_PROJECTILE",
}

export enum PlayerAnimations {
  IDLE_WHITE = "IDLE_WHITE",
  IDLE_YELLOW = "IDLE_YELLOW",
  IDLE_ORANGE = "IDLE_ORANGE",
  IDLE_RED = "IDLE_RED",
  WALK_UP_WHITE = "WALK_UP_WHITE",
  WALK_UP_YELLOW = "WALK_UP_YELLOW",
  WALK_UP_ORANGE = "WALK_UP_ORANGE",
  WALK_UP_RED = "WALK_UP_RED",
  WALK_DOWN_WHITE = "WALK_DOWN_WHITE",
  WALK_DOWN_YELLOW = "WALK_DOWN_YELLOW",
  WALK_DOWN_ORANGE = "WALK_DOWN_ORANGE",
  WALK_DOWN_RED = "WALK_DOWN_RED",
  WALK_RIGHT_WHITE = "WALK_RIGHT_WHITE",
  WALK_RIGHT_YELLOW = "WALK_RIGHT_YELLOW",
  WALK_RIGHT_ORANGE = "WALK_RIGHT_ORANGE",
  WALK_RIGHT_RED = "WALK_RIGHT_RED",
  WALK_LEFT_WHITE = "WALK_LEFT_WHITE",
  WALK_LEFT_YELLOW = "WALK_LEFT_YELLOW",
  WALK_LEFT_ORANGE = "WALK_LEFT_ORANGE",
  WALK_LEFT_RED = "WALK_LEFT_RED",
  LOOK_UP_WHITE = "LOOK_UP_WHITE",
  LOOK_UP_YELLOW = "LOOK_UP_YELLOW",
  LOOK_UP_ORANGE = "LOOK_UP_ORANGE",
  LOOK_UP_RED = "LOOK_UP_RED",
  LOOK_DOWN_WHITE = "LOOK_DOWN_WHITE",
  LOOK_DOWN_YELLOW = "LOOK_DOWN_YELLOW",
  LOOK_DOWN_ORANGE = "LOOK_DOWN_ORANGE",
  LOOK_DOWN_RED = "LOOK_DOWN_RED",
  LOOK_RIGHT_WHITE = "LOOK_RIGHT_WHITE",
  LOOK_RIGHT_YELLOW = "WALK_RIGHT_YELLOW",
  LOOK_RIGHT_ORANGE = "LOOK_RIGHT_ORANGE",
  LOOK_RIGHT_RED = "LOOK_RIGHT_RED",
  LOOK_LEFT_WHITE = "LOOK_LEFT_WHITE",
  LOOK_LEFT_YELLOW = "LOOK_LEFT_YELLOW",
  LOOK_LEFT_ORANGE = "LOOK_LEFT_ORANGE",
  LOOK_LEFT_RED = "LOOK_LEFT_RED",
  DAMAGE = "DAMAGE",
  CRY = "CRY",
  HAPPY = "HAPPY",
}

export enum RobotMouseAnimations {
  WALK_UP = "WALK_UP",
  WALK_DOWN = "WALK_DOWN",
  WALK_LEFT = "WALK_LEFT",
  WALK_RIGHT = "WALK_RIGHT",
  DEATH = "DEATH",
  OFF = "OFF",
  IDLE = "IDLE",
}

export enum RobotAnimations {
  IDLE = "IDLE",
  WALK_UP = "WALK_UP",
  WALK_RIGHT = "WALK_RIGHT",
  WALK_DOWN = "WALK_DOWN",
  WALK_LEFT = "WALK_LEFT",
  DAMAGE = "DAMAGE",
  FROZEN = "FROZEN",
  DANCE = "DANCE",
}

export enum RobotStatueAnimations {
  IDLE = "IDLE",
  LOOK_UP = "LOOK_UP",
  LOOK_RIGHT = "LOOK_RIGHT",
  LOOK_DOWN = "LOOK_DOWN",
  LOOK_LEFT = "LOOK_LEFT",
  DEATH = "DEATH",
}
