# ESPHome web entity ID compatibility

Fang's UI uses legacy keys such as `sensor-fuel_percent`. ESPHome 2026.8.2
was observed sending `sensor/Fuel Percent` in its web server event stream.

`src/entity-api.ts` normalizes name-based IDs into the keys expected by the
existing UI and preserves the exact name in `api_id`. HTTP paths encode that
name as a single URL segment. Older object-ID events retain their original
IDs and endpoints. This targets the primary-device entities used by Fang;
it does not add ESPHome sub-device support or change Fang's entity enums.

Both initial detail events and later partial updates are normalized. When a
partial event arrives first, the detail request uses the original API name,
and its response is normalized before registration. Shared controls and table
controls use the same path helper. Action names and query strings are not
encoded together with the entity segment.

From `webserver`, using Node 18 or newer for the built-in test runner:

```sh
npm ci
npm test --workspace=@esphome-webserver/neato
npm run build
```

The tests execute the source TypeScript with the existing TypeScript dependency,
stub browser presentation dependencies, and capture requests without contacting
a robot. They cover old/new IDs, punctuation, updates, fallback detail requests,
and both action callers. Browser rendering and real robot actions require a
separate hardware check; a successful build alone does not establish those.
At the reviewed upstream revision, `npm ci` reports a missing
`rollup-plugin-gzip` lockfile entry. On a Windows network share, npm workspace
symlink creation can also fail. The isolated package can be validated without
changing the lockfile:

```sh
cd webserver/packages/neato
npm install --workspaces=false --package-lock=false --no-audit --no-fund
npm test --workspaces=false
npm run build --workspaces=false
```