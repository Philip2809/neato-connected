import { normalizeEntity, entityPath } from "./entity-api";
import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { customElement, state, query } from "lit/decorators.js";

import './api';
import "./esp-log";
import "./custom-button";
import "./custom-table";
import "./esp-switch";
import "./esp-range-slider";
import "./esp-schedule";
import "./timezone-selector";
import "./manual-driving";
import "iconify-icon";
import cssReset from "./css/reset";
import cssButton from "./css/button";
import cssApp from "./css/app";
import cssTab from "./css/tab";
import { BinarySensor, Button, Button_Gen2, Button_Gen3, ESPNumber, ESPText, Select, Select_gen3, Sensor, Switch, Switch_gen2, TextSensor } from "./neato-enums";
import { entityStore } from "./entity-store";
import { ActionRenderer } from "./custom-table";
import { getBasePath } from "./utils";

window.source = new EventSource(getBasePath() + "/events");
window.entities = [];
const _unknown_state_events: { [key: string]: number } = {};

window.source?.addEventListener('state', (e: Event) => {
  const messageEvent = e as MessageEvent;
  const data = normalizeEntity(JSON.parse(messageEvent.data.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")));
  let idx = window.entities.findIndex((x) => x.unique_id === data.id);
  if (idx != -1 && data.id) {
    if (typeof data.value === 'number') {
      let history = [...window.entities[idx].value_numeric_history];
      history.push(data.value);
      window.entities[idx].value_numeric_history = history.splice(-50);
    }

    delete data.id;
    delete data.domain;
    delete data.unique_id;
    Object.assign(window.entities[idx], data);
  } else {
    // is it a `detail_all` event already?
    if (data?.name) {
      addEntity(data);
    } else {
      if (_unknown_state_events[data.id]) {
        _unknown_state_events[data.id]++;
      } else {
        _unknown_state_events[data.id] = 1;
      }
      // ignore the first few events, maybe the esp will send a detail_all
      // event soon
      if (_unknown_state_events[data.id] < 1) {
        return;
      }

      let parts = data.id.split('-');
      let domain = parts[0];
      let id = parts.slice(1).join('-');

      fetch(`${window.apiBasePath}/${entityPath({ domain, id, api_id: data.api_id })}?detail=all`, {
        method: 'GET',
      })
        .then((r) => {
          console.log(r);
          if (!r.ok) {
            throw new Error(`HTTP error! Status: ${r.status}`);
          }
          return r.json();
        })
        .then((data) => {
          console.log(data);
          addEntity(data);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    }
  }
});


function addEntity(data: any) {
  data = normalizeEntity(data);
  console.log(data);
  let idx = window.entities.findIndex((x) => x.unique_id === data.id);
  if (idx === -1 && data.id) {
    // Dynamically add discovered..
    let parts = data.id.split("-");
    let entity = {
      ...data,
      domain: parts[0],
      unique_id: data.id,
      id: parts.slice(1).join("-"),
      entity_category: data.entity_category,
      value_numeric_history: [data.value],
    };
    entity.has_action = `render_${entity.domain}` in ActionRenderer.prototype

    window.entities.push(entity);
    entityStore.set(entity);
  }

}

interface Config {
  ota: boolean;
  log: boolean;
  title: string;
  comment: string;
  lang: string;
}

interface NBSConfig {
  type: "gen1" | "gen2" | "gen3";
  version: string;
  comment: string;
}

function getRelativeTime(diff: number) {
  const mark = Math.sign(diff);

  if (diff === 0) return new Intl.RelativeTimeFormat("en").format(0, "second");

  const times = [
    { type: "year", seconds: 12 * 30 * 24 * 60 * 60 * 1000 },
    { type: "month", seconds: 30 * 24 * 60 * 60 * 1000 },
    { type: "week", seconds: 7 * 24 * 60 * 60 * 1000 },
    { type: "day", seconds: 24 * 60 * 60 * 1000 },
    { type: "hour", seconds: 60 * 60 * 1000 },
    { type: "minute", seconds: 60 * 1000 },
    { type: "second", seconds: 1000 },
  ];

  let result = "";
  const timeformat = new Intl.RelativeTimeFormat("en");
  let count = 0;
  for (let t of times) {
    const segment = Math.trunc(Math.abs(diff / t.seconds));
    if (segment > 0) {
      const part = timeformat.format(
        segment * mark,
        t.type as Intl.RelativeTimeFormatUnit
      );
      diff -= segment * t.seconds * mark;
      // remove "ago" from the first segment - if not the only one
      result +=
        count === 0 && t.type != "second" ? part.replace(" ago", " ") : part;
      if (count++ >= 1) break; // do not display detail after two segments
    }
  }
  return result;
}

@customElement("esp-app")
export default class EspApp extends LitElement {
  @state() scheme: string = "";
  @state() ping: number = 0;
  @state() connected: boolean = true;
  @state() lastUpdate: number = 0;
  @query("#beat")
  beat!: HTMLSpanElement;

  @state() showLog: boolean = localStorage.showLog === "true";

  version: String = import.meta.env.PACKAGE_VERSION;
  config: Config = { ota: false, log: true, title: "", comment: "", lang: "" };
  nbsconfig?: NBSConfig;

  darkQuery: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

  frames = [{}, { color: "rgba(0, 196, 21, 0.75)" }, {}];

  constructor() {
    super();
    const conf = document.querySelector("script#config");
    console.log(conf);
    if (conf) this.setConfig(JSON.parse(conf.innerText));
  }

  setConfig(config: Config) {
    if (!("log" in config)) {
      (config as any).log = this.config.log;
    }
    this.config = config;

    document.title = config.title;
    document.documentElement.lang = config.lang;

    const [type, version, comment] = config.comment.split("|");
    this.nbsconfig = { type: type as NBSConfig["type"], version, comment };
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    document.getElementsByTagName("head")[0].innerHTML +=
      '<meta name=viewport content="width=device-width, initial-scale=1,user-scalable=no">';
    const l = <HTMLLinkElement>document.querySelector("link[rel~='icon']"); // Set favicon to house
    l.href =
      'data:image/svg+xml,<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><style>path{stroke-width:1;fill:black;stroke:black;stroke-linecap:round;stroke-linejoin:round}@media (prefers-color-scheme:dark){path{fill:white;stroke:white}}</style><path d="M1.3 18H5v10h21.8V18h3.7l-3.7-3.7V7.8h-2.4V12l-8.7-8.7L1.3 18Z"/></svg>';
    this.scheme = this.schemeDefault();
    window.source.addEventListener("ping", (e: MessageEvent) => {
      if (e.data?.length) {
        const data = JSON.parse(e.data);
        if (data.title !== undefined) {
          this.setConfig(data);
          this.requestUpdate();
        }
      }
      this._updateUptime(e);
      this.lastUpdate = Date.now();
    });
    window.source.addEventListener("log", (e: MessageEvent) => {
      this._updateUptime(e);
      this.lastUpdate = Date.now();
    });
    window.source.addEventListener("state", (e: MessageEvent) => {
      this.lastUpdate = Date.now();
    });
    window.source.addEventListener("error", (e: Event) => {
      console.dir(e);
      //console.log("Lost event stream!")
      this.connected = false;
      this.requestUpdate();
    });
    setInterval(() => {
      this.connected = !!this.ping && Date.now() - this.lastUpdate < 15000;
    }, 5000);
    document.addEventListener('entity-tab-header-double-clicked', (e) => {
      const mainElement = this.shadowRoot?.querySelector('main.flex-grid-half');
      mainElement?.classList.toggle('expanded_entity');
    });
    document.addEventListener('log-tab-header-double-clicked', (e) => {
      const mainElement = this.shadowRoot?.querySelector('main.flex-grid-half');
      mainElement?.classList.toggle('expanded_logs');
    });
  }

  schemeDefault() {
    return this.darkQuery.matches ? "dark" : "light";
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has("scheme")) {
      let el = document.documentElement;
      document.documentElement.style.setProperty("color-scheme", this.scheme);
    }
    if (changedProperties.has("ping")) {
      if (!!this.ping) this.beat.animate(this.frames, 1000);
    }
  }

  uptime() {
    return `${getRelativeTime(-this.ping | 0)}`;
  }

  renderOta() {
    if (this.config.ota) {
      let basePath = getBasePath();
      return html`
        <form
          method="POST"
          action="${basePath}/update"
          enctype="multipart/form-data"
        >
          <input class="btn" type="file" name="update" accept="application/octet-stream" />
          <input class="btn" type="submit" value="Update" />
        </form>`;
    }
  }

  renderLog() {
    if (!this.config.log || !this.showLog) return nothing;

    return html`
    <section id="col_logs" class="col">
      <esp-log rows="50" .scheme="${this.scheme}"></esp-log>
    </section>
  `;
  }


  renderTitle() {
    return html`
      <h1>${this.config.title || html`&nbsp;`}</h1>
<div>
        ${[this.nbsconfig?.comment, `started ${this.uptime()}`, this.nbsconfig?.version]
        .filter((n) => n)
        .map((e) => `${e}`)
        .join(" · ")}
      </div>
    `;
  }

  /**
   * 
   *      
   */

  render() {
    return html`
     <header>
        <iconify-icon
          .icon="${!!this.connected ? "mdi:circle" : "mdi:circle-off-outline"}"
          .title="${this.uptime()}"
          class="top-icon ${!!this.connected ? "connected" : ""}"
          id="beat"
        ></iconify-icon>
        <a
          href="#"
          id="scheme"
          @click="${() => {
        this.scheme = this.scheme !== "dark" ? "dark" : "light";
      }}"
        >
          <iconify-icon
            icon="mdi:theme-light-dark"
            class="top-icon"
          ></iconify-icon>
        </a>



        ${this.renderTitle()}
      </header>

    <div class="main-grid">
      <div style="display:flex;justify-content:center;flex-direction:column;align-items:center;">
        <div style="display:flex;gap:1rem;flex-direction:column;width:100%;">
        <div class="main-buttons">
          <custom-button click="${Button.house_clean}"></custom-button>
          <custom-button click="${Button.spot_clean}"></custom-button>
          <custom-button click="${Button.locate_robot}"></custom-button>
          ${this.nbsconfig?.type === "gen3" ? html`<custom-button click="${Button_Gen3.send_to_base}"></custom-button>` : nothing}
          ${this.nbsconfig?.type === "gen2" ? html`<custom-button click="${Button_Gen2.send_to_start}"></custom-button>` : nothing}

          <custom-button click="${Button.pause_cleaning}"></custom-button>
          <custom-button click="${Button.resume_cleaning}"></custom-button>
          <custom-button click="${Button.stop_cleaning}"></custom-button>
          <custom-button click="${Button.update_status}"></custom-button>

          <custom-button click="${Button.shutdown}"></custom-button>
          <custom-button click="${Button.powercycle}"></custom-button>
          <custom-button click="${Button.reboot_esp}"></custom-button>
          <custom-button name="Clear Errors" click="${Button.clear_errors}"></custom-button>

        </div>

          ${this.nbsconfig?.type === "gen3" ? html`
              <hr style="width: 100%;">
      <custom-table .entityIds="${[
          TextSensor.last_cleaning_time,
          TextSensor.last_cleaning_type,
          Sensor.last_cleaning_duration
        ]}"></custom-table> 
              ` : nothing}

      </div>

      </div>
      <div style="display:flex;justify-content:center;flex-direction:column;">
        <custom-table 
          .entityIds="${[
        Sensor.fuel_percent,
        BinarySensor.ext_power_present,
        TextSensor.ui_state,
        TextSensor.robot_error,
        TextSensor.robot_alert,
        TextSensor.nbs_time,
      ]}" 
      .customNames="${{ [BinarySensor.ext_power_present]: "Docked" }}"
          .customValues="${{ 
            [TextSensor.robot_error]: (value: string) => value.startsWith("200") ? "No errors" : value,
            [TextSensor.robot_alert]: (value: string) => value.startsWith("200") ? "No alerts" : value,
           }}"
      ></custom-table>
        <hr style="width: 100%;">
        <custom-table .entityIds="${[ESPNumber.spot_clean_height, ESPNumber.spot_clean_width]}"></custom-table>
        <custom-button name="Spot Clean" click="${Button_Gen3.spot_clean__height___width_}" style="align-self:center;"></custom-button>
      </div>
    </div>


    
    <div class="main-grid">
      <div style="display:flex;justify-content:center;flex-direction:column;align-items:center;">
        
        ${this.nbsconfig?.type === "gen2" ? html`<custom-table style="width:50%" .entityIds="${[Switch_gen2.robot_schedule]}"></custom-table>` : nothing}
        <esp-schedule style="width:50%"></esp-schedule>

      </div>
      <div style="display:flex;justify-content:center;flex-direction:column;">
        <custom-table .entityIds="${[
        Select_gen3.navigation_mode,
        Switch.test_mode,
        Switch.eco_mode,
        Switch.play_extra_sounds,

        Switch.click_sounds,
        Switch.melody_sounds,
        Switch.warning_sounds,
        Switch.bin_full_detect,
        ...(this.nbsconfig?.type === "gen2" ? [
          Switch_gen2.autoshutdown,
          Switch_gen2.stealthled
        ] : []),
        Switch.led,
        Switch.wall_enable,
        Switch.intenseclean,
        Switch.wifi,
      ]}"></custom-table>

      </div>
    </div>


    <div class="main-grid">
      <div style="display:flex;justify-content:center;flex-direction:column;align-items:center;">
          ${this.nbsconfig?.type === "gen3" ? html`<manual-driving></manual-driving>` : nothing}

            

      </div>
      <div style="display:flex;justify-content:center;flex-direction:column;">

      <custom-table .entityIds="${[
        TextSensor.model,
        TextSensor.software,
        TextSensor.serial_number,
        BinarySensor.battery_failure,
        BinarySensor.battery_over_temp,
        Sensor.battery_cycles,
        Sensor.battery_voltage_v,
        Sensor.battery_temp_c_avg,
        ESPText.timezone,
        ESPText.schedule,
        Select.logger
      ]}"></custom-table>
      </div>
    </div>



    <div class="main-grid">
      <div style="display:flex;justify-content:center;flex-direction:column;align-items:center;">
        <timezone-selector></timezone-selector>

      </div>
      <div style="display:flex;justify-content:center;flex-direction:column;align-items:center;">

      <span class="helper">
        The manual for the Webserver can be found <a href="https://github.com/Philip2809/neato-brainslug/blob/main/manual.md" target="_blank">here</a>.
      </span>
      

              <!-- <span class="helper">
              If you want to use the default ESPHome Webserver or a beta version by pasting a custom link, press <a href="" onclick="localStorage.pickWebserver = '0';location.reload();">here</a>.
            </span> -->

      <span class="helper">
        When new updates for Neato Brainslug is out, you can easily update your device by uploading the OTA file here!
      </span>
        ${this.renderOta()}

        <span class="helper" style="display: flex;align-items: center;">
          <code>Type: ${this.nbsconfig?.type}</code> &nbsp; &nbsp; &nbsp;
          Toggle the debug logs:&nbsp;
              <a
            href="#"
            title="Toggle log"
            @click="${() => {
        this.showLog = !this.showLog;
        localStorage.showLog = String(this.showLog);
      }}"
                >
            <iconify-icon
              style="font-size:2rem;color:rgba(177, 177, 177, 0.8);"
              icon="mdi:console"
              class="top-icon"
            ></iconify-icon>
          </a>

        </span>


      </div>
    </div>



      

      

        ${this.renderLog()}
    `;
  }

  private _updateUptime(e: MessageEvent) {
    if (e.lastEventId) {
      this.ping = parseInt(e.lastEventId);
      this.connected = true;
      this.requestUpdate();
    }
  }

  static get styles() {
    return [cssReset, cssButton, cssApp, cssTab];
  }
}
