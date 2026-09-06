import { entityPath } from "./entity-api";
import { html, css, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import cssReset from "./css/reset";
import { pressButton } from "./api";
import { Button_Gen3 } from "./neato-enums";
import { entityStore } from "./entity-store";
import { entityConfig } from "./types";
import cssEntityTable from "./css/esp-entity-table";

export const stateOn = "ON";
export const stateOff = "OFF";

interface RestAction {
  restAction(entity?: entityConfig, action?: string): void;
}

@customElement("custom-table")
export class CustomTable extends LitElement implements RestAction {
  @property({ type: String })
  entityIds: string[] = []

  @property()
  customNames: { [key: string]: string } = {}

  @property()
  customValues: { [key: string]: (value: string) => string } = {}


  private unsubscribe?: () => void;
  private entities: entityConfig[] = [];

  private _actionRenderer = new ActionRenderer();


  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = entityStore.subscribe((entity) => {
      // only re-render when *its* entity changes
      if (this.entityIds.some(id => id === entity.unique_id)) {
        this.entities.push(entity);
        this.entities.sort(
          (a, b) =>
            this.entityIds.indexOf(a.unique_id) -
            this.entityIds.indexOf(b.unique_id)
        );

        this.requestUpdate();
      }
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }


  render() {
    if (!this.entities.length) {
      return html`loading…`;
    }

  return html`
    <div>
      ${this.entities.map((component) => html`
        <div class="entity-row" .domain="${component.domain}">
          <div>
            ${component.icon
              ? html`
                <iconify-icon
                  icon="${component.icon}"
                  height="24px"
                ></iconify-icon>
              `
              : nothing}
          </div>

          <div>${this.customNames?.[component.unique_id] || component.name}</div>

          <div style="${component.domain === "number" ? "overflow-wrap: unset;word-break: unset;" : ""}">
            ${component.has_action
              ? this.control(component)
              : html`<div>${this.customValues?.[component.unique_id] ? this.customValues?.[component.unique_id](component.state) : component.state}</div>`}
          </div>
        </div>
      `)}

    </div>
  `;
  }

   hasAction(entity: entityConfig): boolean {
    return `render_${entity.domain}` in this._actionRenderer;
  }

  control(entity: entityConfig) {
    this._actionRenderer.entity = entity;
    this._actionRenderer.actioner = this;
    return this._actionRenderer.exec(
      `render_${entity.domain}` as ActionRendererMethodKey
    );
  }

  restAction(entity: entityConfig, action: string) {
    fetch(`${window.apiBasePath}/${entityPath(entity)}/${action}`, {
      method: "POST",
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    }).then((r) => {
      console.log(r);
    });
  }


  static get styles() {
    return [
      cssReset,
      cssEntityTable,
    ];
  }

}



type ActionRendererNonCallable = "entity" | "actioner" | "exec";
export type ActionRendererMethodKey = keyof Omit<
  ActionRenderer,
  ActionRendererNonCallable
>;

export class ActionRenderer {
  public entity?: entityConfig;
  public actioner?: RestAction;

  exec(method: ActionRendererMethodKey) {
    if (!this[method] || typeof this[method] !== "function") {
      console.log(`ActionRenderer.${method} is not callable`);
      return;
    }
    return this[method]();
  }

  private _actionButton(entity: entityConfig, label: string, action: string, isCurrentState: boolean = false) {
    if (!entity) return;
    let a = action || label.toLowerCase();
    return html`<button
      class="${isCurrentState ? 'abuttonIsState' : 'abutton'}"
      ?disabled=${isCurrentState}
      @click=${() => this.actioner?.restAction(entity, a)}
    >
      ${label}
    </button>`;
  }

  private _datetime(
    entity: entityConfig,
    type: string,
    action: string,
    opt: string,
    value: string,
  ) {
    return html`
      <input 
        type="${type}" 
        name="${entity.unique_id}"
        id="${entity.unique_id}"
        .value="${value}"
        @change="${(e: Event) => {
          const val = (<HTMLTextAreaElement>e.target)?.value;
          this.actioner?.restAction(
            entity,
            `${action}?${opt}=${val.replace('T', ' ')}`
          );
        }}"
      />
    `;
  }

  private _switch(entity: entityConfig) {
    return html`<esp-switch
      color="var(--primary-color,currentColor)"
      .state=${entity.state}
      @state="${(e: CustomEvent) => {
        let act = "turn_" + e.detail.state;
        this.actioner?.restAction(entity, act.toLowerCase());
      }}"
    ></esp-switch>`;
  }

  private _select(
    entity: entityConfig,
    action: string,
    opt: string,
    options: string[] | number[],
    val: string | number | undefined
  ) {
    return html`<select
      @change="${(e: Event) => {
        const val = (<HTMLTextAreaElement>e.target)?.value;
        this.actioner?.restAction(
          entity,
          `${action}?${opt}=${encodeURIComponent(val)}`
        );
      }}"
    >
      ${options.map(
        (option) =>
          html`
            <option value="${option}" ?selected="${option == val}">
              ${option}
            </option>
          `
      )}
    </select>`;
  }

  private _range(
    entity: entityConfig,
    action: string,
    opt: string,
    value: string | number,
    min?: string | undefined,
    max?: string | undefined,
    step = 1
  ) {
    if(entity.mode == 1) {
      return html`<div class="range">
        <label>${min || 0}</label>
        <input
          type="${entity.mode == 1 ? "number" : "range"}"
          name="${entity.unique_id}"
          id="${entity.unique_id}"
          step="${step}"
          min="${min || Math.min(0, value as number)}"
          max="${max || Math.max(10, value as number)}"
          .value="${value}"
          @change="${(e: Event) => {
            const val = (<HTMLTextAreaElement>e.target)?.value;
            this.actioner?.restAction(entity, `${action}?${opt}=${val}`);
          }}"
        />
        <label>${max || 100}</label>
      </div>`;      
    } else {
      return html`    
      <esp-range-slider
        name="${entity.unique_id}"
        step="${step}"
        min="${min}"
        max="${max}"
        .value="${value}"
        @state="${(e: CustomEvent) => {
            const val = (<HTMLTextAreaElement>e.target)?.value;
            this.actioner?.restAction(entity, `${action}?${opt}=${e.detail.state}`);
          }}"
      ></esp-range-slider>`;
    }

  }

  private _textinput(
    entity: entityConfig,
    action: string,
    opt: string,
    value: string | number,
    min: number | undefined,
    max: number | undefined,
    pattern: string | undefined
  ) {
    return html`
      <input
        type="${entity.mode == 1 ? "password" : "text"}"
        name="${entity.unique_id}"
        id="${entity.unique_id}"
        minlength="${min || Math.min(0, value as number)}"
        maxlength="${max || Math.max(255, value as number)}"
        pattern="${pattern || ""}"
        .value="${value!}"
        @change="${(e: Event) => {
          const val = (<HTMLTextAreaElement>e.target)?.value;
          this.actioner?.restAction(
            entity,
            `${action}?${opt}=${encodeURIComponent(val)}`
          );
        }}"
      />
    `;
  }

  private _colorpicker(entity: entityConfig, action: string, value: any) {
    function u16tohex(d: number) {
      return Number(d).toString(16).padStart(2, "0");
    }
    function rgb_to_str(rgbhex: string) {
      const rgb = rgbhex
        .match(/[0-9a-f]{2}/gi)
        ?.map((x) => parseInt(x, 16)) || [0, 0, 0];
      return `r=${rgb[0]}&g=${rgb[1]}&b=${rgb[2]}`;
    }

    return html`<div class="colorpicker">
      <input
        type="color"
        name="${entity.unique_id}"
        id="${entity.unique_id}"
        value="#${u16tohex(value?.r)}${u16tohex(value?.g)}${u16tohex(value?.b)}"
        @change="${(e: Event) => {
          const val = (<HTMLTextAreaElement>e.target)?.value;
          this.actioner?.restAction(entity, `${action}?${rgb_to_str(val)}`);
        }}"
      />
    </div>`;
  }

  render_binary_sensor() {
    if (!this.entity) return;
    const isOn = this.entity.state == stateOn;
    return html`<iconify-icon
      class="binary_sensor_${this.entity.state?.toLowerCase()}"
      icon="mdi:checkbox-${isOn ? "marked-circle" : "blank-circle-outline"}"
      height="24px"
    ></iconify-icon>`;
  }

  render_date() {
    if (!this.entity) return;
    return html`
      ${this._datetime(
        this.entity,
        "date",
        "set",
        "value",
        this.entity.value,
      )}
    `;
  }

  render_time() {
    if (!this.entity) return;
    return html`
      ${this._datetime(
        this.entity,
        "time",
        "set",
        "value",
        this.entity.value,
      )}
    `;
  }

  render_datetime() {
    if (!this.entity) return;
    return html`
      ${this._datetime(
        this.entity,
        "datetime-local",
        "set",
        "value",
        this.entity.value,
      )}
    `;
  }

  render_switch() {
    if (!this.entity) return;
    if (this.entity.assumed_state)
      return html`${this._actionButton(this.entity, "❌", "turn_off")}
      ${this._actionButton(this.entity, "✔️", "turn_on")}`;
    else return this._switch(this.entity);
  }

  render_fan() {
    if (!this.entity) return;
    return [
      this.entity.speed,
      " ",
      this.entity.speed_level,
      this._switch(this.entity),
      this.entity.speed_count
        ? this._range(
            this.entity,
            `turn_${this.entity.state.toLowerCase()}`,
            "speed_level",
            this.entity.speed_level ? this.entity.speed_level : 0,
            0,
            this.entity.speed_count,
            1
          )
        : "",
    ];
  }

  render_light() {
    if (!this.entity) return;
    return [
      html`<div class="entity" style="
      width: 100%;">
        ${this._switch(this.entity)}
        ${this.entity.brightness
          ? this._range(
              this.entity,
              "turn_on",
              "brightness",
              this.entity.brightness,
              0,
              255,
              1
            )
          : ""}
        ${this.entity.color_mode === "rgb" || this.entity.color_mode === "rgbw"
          ? this._colorpicker(this.entity, "turn_on", this.entity?.color)
          : ""}
        ${this.entity.effects?.filter((v) => v != "None").length
          ? this._select(
              this.entity,
              "turn_on",
              "effect",
              this.entity.effects || [],
              this.entity.effect
            )
          : ""}
      </div> `,
    ];
  }

  render_lock() {
    if (!this.entity) return;
    return html`${this._actionButton(this.entity, "🔐", "lock", this.entity.state === "LOCKED")}
    ${this._actionButton(this.entity, "🔓", "unlock", this.entity.state === "UNLOCKED")}
    ${this._actionButton(this.entity, "↑", "open")} `;
  }

  render_cover() {
    if (!this.entity) return;
    return html`${this._actionButton(this.entity, "↑", "open", this.entity.state === "OPEN")}
    ${this._actionButton(this.entity, "☐", "stop")}
    ${this._actionButton(this.entity, "↓", "close", this.entity.state === "CLOSED")}`;
  }

  render_button() {
    if (!this.entity) return;
    return html`${this._actionButton(this.entity, "PRESS", "press")}`;
  }

  render_select() {
    if (!this.entity) return;
    return this._select(
      this.entity,
      "set",
      "option",
      this.entity.option || [],
      this.entity.value
    );
  }

  render_number() {
    if (!this.entity) return;
    return html`
      ${this._range(
        this.entity,
        "set",
        "value",
        this.entity.value,
        this.entity.min_value,
        this.entity.max_value,
        this.entity.step
      )}
      ${this.entity.uom}
    `;
  }

  render_text() {
    if (!this.entity) return;
    return this._textinput(
      this.entity,
      "set",
      "value",
      this.entity.value,
      this.entity.min_length,
      this.entity.max_length,
      this.entity.pattern
    );
  }

  render_climate() {
    if (!this.entity) return;
    let target_temp_slider, target_temp_label, target_temp;
    let current_temp = html`<div class="climate-row" style="padding-bottom: 10px";>
                              <label>Current:&nbsp;${this.entity.current_temperature} °C</label>
                            </div>`;
    
    if (
      this.entity.target_temperature_low !== undefined &&
      this.entity.target_temperature_high !== undefined
    ) {
      target_temp = html`
        <div class="climate-row">
          <label>Target Low:&nbsp;</label>
          ${this._range(
            this.entity,
            "set",
            "target_temperature_low",
            this.entity.target_temperature_low,
            this.entity.min_temp,
            this.entity.max_temp,
            this.entity.step
          )}
        </div>
        <div class="climate-row">
          <label>Target High:&nbsp;</label>
          ${this._range(
            this.entity,
            "set",
            "target_temperature_high",
            this.entity.target_temperature_high,
            this.entity.min_temp,
            this.entity.max_temp,
            this.entity.step
          )}
        </div>`;
    } else {
      target_temp = html`
        <div class="climate-row">
          <label>Target:&nbsp;</label>
          ${this._range(
            this.entity,
            "set",
            "target_temperature",
            this.entity.target_temperature!!,
            this.entity.min_temp,
            this.entity.max_temp,
            this.entity.step
          )}
        </div>`;
    }
    let modes = html``;
    if ((this.entity.modes ? this.entity.modes.length : 0) > 0) {
      modes = html`
        <div class="climate-row">
          <label>Mode:&nbsp;</label>
          ${this._select(
            this.entity,
            "set",
            "mode",
            this.entity.modes || [],
            this.entity.mode || ""
          )}
        </div>`;
    }
    return html`
      <div class="climate-wrap">
        ${current_temp} ${target_temp} ${modes}
      </div>
    `;
  }
  render_valve() {
    if (!this.entity) return;
    return html`${this._actionButton(this.entity, "OPEN", "open", this.entity.state === "OPEN")}
    ${this._actionButton(this.entity, "☐", "stop")}
    ${this._actionButton(this.entity, "CLOSE", "close", this.entity.state === "CLOSED")}`;
  }
}
