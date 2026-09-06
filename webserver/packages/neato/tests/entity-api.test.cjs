const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Execute the actual TypeScript modules with browser/visual dependencies stubbed.
// No device or network access: all HTTP requests are captured below.
function harness() {
  const requests = [], listeners = {}, published = [];
  const window = { location: { pathname: '/proxy/' }, apiBasePath: '/proxy', entities: [] };
  let detail = { id: 'sensor/Fuel Percent', name: 'Fuel Percent', value: 97 };
  const fetch = (url, options) => {
    requests.push({ url, options });
    return Promise.resolve({ ok: true, json: () => Promise.resolve(detail) });
  };
  const noopDecorator = () => () => {};
  const stub = {
    LitElement: class {}, html: () => '', css: () => '', nothing: undefined,
    customElement: () => target => target, property: noopDecorator,
    state: noopDecorator, query: noopDecorator,
    getBasePath: () => '/proxy', ActionRenderer: class {},
    entityStore: { set: entity => published.push(entity) },
  };
  const cache = {};
  function load(name) {
    if (cache[name]) return cache[name];
    const filename = path.join(__dirname, '../src', name + '.ts');
    // Match Vite's build-time substitution; the UI class is not instantiated here.
    const source = fs.readFileSync(filename, 'utf8')
      .replace(/import\.meta\.env\.PACKAGE_VERSION/g, JSON.stringify('test'));
    const js = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      experimentalDecorators: true,
    } }).outputText;
    const exports = {};
    const context = { exports, window, fetch, console: { log() {}, error() {} },
      EventSource: class { addEventListener(type, fn) { listeners[type] = fn; } },
      require: id => id === './entity-api' ? load('entity-api') : stub,
    };
    vm.runInNewContext(js, context, { filename });
    cache[name] = exports;
    return exports;
  }
  return { load, requests, listeners, window, published,
    setDetail: value => { detail = value; },
    emit: value => listeners.state({ data: JSON.stringify(value) }),
  };
}

test('legacy IDs remain unchanged, including hyphens', () => {
  const { normalizeEntity, entityPath } = harness().load('entity-api');
  const input = { id: 'sensor-fuel-percent', value: 97 };
  assert.equal(normalizeEntity(input), input);
  assert.equal(entityPath({ domain: 'sensor', id: 'fuel-percent' }), 'sensor/fuel-percent');
});

test('new IDs retain exact API names and do not mutate input', () => {
  const { normalizeEntity, entityPath } = harness().load('entity-api');
  const input = { id: 'button/Spot Clean (Height & Width)', state: 'test' };
  const result = normalizeEntity(input);
  assert.equal(result.id, 'button-spot_clean__height___width_');
  assert.equal(result.api_id, 'Spot Clean (Height & Width)');
  assert.equal(input.id, 'button/Spot Clean (Height & Width)');
  assert.equal(normalizeEntity(result), result);
  assert.equal(entityPath({ domain: 'button', id: 'unused', api_id: 'A/B? #%' }),
    'button/A%2FB%3F%20%23%25');
});

test('detail events and subsequent partial updates share one UI entity', () => {
  const h = harness(); h.load('esp-app');
  h.emit({ id: 'sensor/Fuel Percent', domain: 'sensor', name: 'Fuel Percent', value: 95 });
  h.emit({ id: 'sensor/Fuel Percent', value: 97 });
  assert.equal(h.window.entities.length, 1);
  const entity = h.window.entities[0];
  assert.equal(entity.unique_id, 'sensor-fuel_percent');
  assert.equal(entity.id, 'fuel_percent');
  assert.equal(entity.api_id, 'Fuel Percent');
  assert.equal(entity.value, 97);
  assert.equal(h.published.length, 1);
  assert.equal(h.requests.length, 0);
});

test('partial event fetches exact encoded name and normalizes detail response', async () => {
  const h = harness(); h.load('esp-app');
  h.emit({ id: 'sensor/Fuel Percent', value: 97 });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.requests[0].url, '/proxy/sensor/Fuel%20Percent?detail=all');
  assert.equal(h.requests[0].options.method, 'GET');
  assert.equal(h.window.entities[0].unique_id, 'sensor-fuel_percent');
  assert.equal(h.window.entities[0].api_id, 'Fuel Percent');
});

test('legacy partial events still use legacy detail endpoints', async () => {
  const h = harness(); h.load('esp-app');
  h.setDetail({ id: 'sensor-fuel_percent', name: 'Fuel Percent', value: 97 });
  h.emit({ id: 'sensor-fuel_percent', value: 97 });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.requests[0].url, '/proxy/sensor/fuel_percent?detail=all');
  assert.equal(h.window.entities[0].unique_id, 'sensor-fuel_percent');
});

test('shared actions encode entity names without encoding the action query', () => {
  const h = harness(), api = h.load('api');
  api.setText({ domain: 'text', id: 'timezone', api_id: 'Timezone' }, 'America/Los_Angeles');
  assert.equal(h.requests[0].url, '/proxy/text/Timezone/set?value=America%2FLos_Angeles');
  assert.equal(h.requests[0].options.method, 'POST');
  api.pressButton({ domain: 'button', id: 'house_clean' });
  assert.equal(h.requests[1].url, '/proxy/button/house_clean/press');
});

test('table actions use the same encoded path as shared actions', () => {
  const h = harness(), { CustomTable } = h.load('custom-table');
  CustomTable.prototype.restAction.call({},
    { domain: 'button', id: 'send_to_start', api_id: 'Send to start' }, 'press');
  assert.equal(h.requests[0].url, '/proxy/button/Send%20to%20start/press');
  assert.equal(h.requests[0].options.method, 'POST');
});