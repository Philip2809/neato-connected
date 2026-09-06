import { entityPath } from "./entity-api";
import { entityConfig } from "./types";
import { getBasePath } from "./utils";

window.apiBasePath = getBasePath();


export function restAction(entity: entityConfig, action: string) {
    fetch(`${window.apiBasePath}/${entityPath(entity)}/${action}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}

export function pressButton(entity: entityConfig) {
    restAction(entity, "press");
}

export function setText(entity: entityConfig, val: string) {
    restAction(entity, `set?value=${encodeURIComponent(val)}`)
}
