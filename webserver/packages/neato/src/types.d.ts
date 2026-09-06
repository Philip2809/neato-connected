
declare global {
    interface Window {
        source: EventSource;
        apiBasePath: string;
        entities: entityConfig[];
    }
}

export interface entityConfig {
  unique_id: string;
  sorting_weight: number;
  sorting_group?: string;
  domain: string;
  id: string;
  /** Exact name used by name-based ESPHome HTTP endpoints. */
  api_id?: string;
  state: string;
  detail: string;
  value: string;
  name: string;
  entity_category?: number;
  when: string;
  icon?: string;
  option?: string[];
  assumed_state?: boolean;
  brightness?: number;
  color_mode?: string;
  color: object;
  target_temperature?: number;
  target_temperature_low?: number;
  target_temperature_high?: number;
  min_temp?: number;
  max_temp?: number;
  min_value?: string;
  max_value?: string;
  step?: number;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  current_temperature?: number;
  modes?: number[];
  mode?: number;
  speed_count?: number;
  speed_level?: number;
  speed: string;
  effects?: string[];
  effect?: string;
  has_action?: boolean;
  value_numeric_history: number[];
  uom?: string;
  is_disabled_by_default?: boolean;
}