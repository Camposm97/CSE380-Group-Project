export enum Names {
  NAVMESH = "navmesh",
}

export enum Control {
  FORWARD = 'forward',
  BACKWARD = 'backward',
  LEFT = 'left',
  RIGHT = 'right',
  ATTACK = 'attack',
  PLACE_FLAG = 'place-flag',
  PANIC = 'panic',
  PAUSE = 'pause',
  PICK_UP = 'pickup',
  DROP = 'drop',
  SLOT1 = 'slot1',
  SLOT2 = 'slot2'
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
    ROOM_COMPLETE = "ROOM_COMPLETE"
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
  GREEN = "GREEN",
  BLUE = "BLUE",
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
  IDLE_GREEN = "IDLE_GREEN",
  IDLE_BLUE = "IDLE_BLUE",
  IDLE_RED = "IDLE_RED",
  WALK_UP_WHITE = "WALK_UP_WHITE",
  WALK_UP_GREEN = "WALK_UP_GREEN",
  WALK_UP_BLUE = "WALK_UP_BLUE",
  WALK_UP_RED = "WALK_UP_RED",
  WALK_DOWN_WHITE = "WALK_DOWN_WHITE",
  WALK_DOWN_GREEN = "WALK_DOWN_GREEN",
  WALK_DOWN_BLUE = "WALK_DOWN_BLUE",
  WALK_DOWN_RED = "WALK_DOWN_RED",
  WALK_RIGHT_WHITE = "WALK_RIGHT_WHITE",
  WALK_RIGHT_GREEN = "WALK_RIGHT_GREEN",
  WALK_RIGHT_BLUE = "WALK_RIGHT_BLUE",
  WALK_RIGHT_RED = "WALK_RIGHT_RED",
  WALK_LEFT_WHITE = "WALK_LEFT_WHITE",
  WALK_LEFT_GREEN = "WALK_LEFT_GREEN",
  WALK_LEFT_BLUE = "WALK_LEFT_BLUE",
  WALK_LEFT_RED = "WALK_LEFT_RED",
  LOOK_UP_WHITE = "LOOK_UP_WHITE",
  LOOK_UP_GREEN = "LOOK_UP_GREEN",
  LOOK_UP_BLUE = "LOOK_UP_BLUE",
  LOOK_UP_RED = "LOOK_UP_RED",
  LOOK_DOWN_WHITE = "LOOK_DOWN_WHITE",
  LOOK_DOWN_GREEN = "LOOK_DOWN_GREEN",
  LOOK_DOWN_BLUE = "LOOK_DOWN_BLUE",
  LOOK_DOWN_RED = "LOOK_DOWN_RED",
  LOOK_RIGHT_WHITE = "LOOK_RIGHT_WHITE",
  LOOK_RIGHT_GREEN = "WALK_RIGHT_GREEN",
  LOOK_RIGHT_BLUE = "LOOK_RIGHT_BLUE",
  LOOK_RIGHT_RED = "LOOK_RIGHT_RED",
  LOOK_LEFT_WHITE = "LOOK_LEFT_WHITE",
  LOOK_LEFT_GREEN = "LOOK_LEFT_GREEN",
  LOOK_LEFT_BLUE = "LOOK_LEFT_BLUE",
  LOOK_LEFT_RED = "LOOK_LEFT_RED",
  DAMAGE = "DAMAGE",
}


export enum RobotMouseAnimations {
  WALK_UP = "WALK_UP",
  WALK_DOWN = "WALK_DOWN",
  WALK_LEFT = "WALK_LEFT",
  WALK_RIGHT = "WALK_RIGHT",
  DEATH = "DEATH",
  OFF = "OFF"
}

export enum RobotAnimations {
  IDLE = "IDLE",
  WALK_UP = "WALK_UP",
  WALK_RIGHT = "WALK_RIGHT",
  WALK_DOWN = "WALK_DOWN",
  WALK_LEFT = "WALK_LEFT",
  DAMAGE = "DAMAGE",
  FROZEN = 'FROZEN'
}

export enum RobotStatueAnimations {
  IDLE = "IDLE",
  LOOK_UP = "LOOK_UP",
  LOOK_RIGHT = "LOOK_RIGHT",
  LOOK_DOWN = "LOOK_DOWN",
  LOOK_LEFT = "LOOK_LEFT",
  DEATH = "DEATH",
}
