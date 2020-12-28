import { CONTROL_TYPES } from "../constants"

export type FormType = { JSONkey: string } & { [k: string]: any }
export type ControlState = { state: any, updatedAt: string }
export type ControlRecipe = {
    name: string,
    type: CONTROL_TYPES,
    JSONkey: string,
    description?: string | null,
    ipAddress?: string,
    metadata?: { [key: string]: any }
}
export type StateUpdate = any

export type ChangeHandler = (form: FormType, currentState: ControlState, recipe: ControlRecipe) => Promise<StateUpdate>

export type AckHandler = (recipe: ControlRecipe) => Promise<boolean>