# Gen 2 motor telemetry for home automation

The Gen 2 package exposes motor readings so Home Assistant and other automation platforms can observe cleaning activity and infer cleaning cycles. It does not implement a cleaning-cycle state machine or send notifications.

## Entities

| Entity name | Value |
| --- | --- |
| Vacuum Motor RPM | Vacuum motor speed |
| Brush RPM | Main brush speed |
| Left Wheel RPM | Left wheel speed; signed values accepted |
| Right Wheel RPM | Right wheel speed; signed values accepted |
| Vacuum Motor Running | Absolute vacuum RPM greater than zero |
| Brush Running | Absolute brush RPM greater than zero |
| Wheels Moving | Either wheel has nonzero absolute RPM |
| Motor Activity | `cleaning`, `moving`, `stationary`, or `unavailable` |

`cleaning` means the vacuum or brush motor is running. `moving` means a wheel is running while both cleaning motors are stopped. `stationary` means all four reported RPMs are zero. These describe motor activity, not the robot's internal job state or proof of unobstructed travel.

GetMotors is queried after GetErr, with a 150 ms delay, at the existing `infointerval` (normally two seconds). The initial/manual data refresh also requests motors. The existing charger polling interval is unchanged. Entity IDs in HA depend on the device name and any user renaming; use the IDs from your installation.

All four RPM fields must be present and finite. A malformed/unsupported response invalidates the whole sample immediately. After a valid sample, no new valid sample for `motor_timeout` (default `10s`) invalidates all RPM/boolean values and sets Motor Activity to `unavailable`. Keep `motor_timeout` longer than `infointerval`; for example, use `motor_timeout: 30s` with a ten-second polling interval. Before the first valid sample the entities have no state. Missing data is never treated as stopped motors.

## Detecting a cycle in an automation

One useful step in detecting whether a cleaning cycle has ended is **checking Robot Error when the motors stop**:

1. Observe actual vacuum/brush activity to establish that a run was in progress.
2. Debounce a transition to all motors stopped; a short pause in wheel movement alone is not a stopped cleaning run.
3. Check Robot Error. A reported error identifies a fault-related stop that should be handled separately from normal cycle completion.
4. If no error is reported, combine that with dock/external-power state and your automation's prior activity/request history. Stopped motors plus no error alone can also mean a pause or idle state, so it is not a definitive finished signal.

For example, previous cleaning activity followed by stopped motors, no reported error, and stable dock power is a useful return-to-dock inference. It can still represent a recharge before resuming rather than successful completion of the entire job. An unreported obstruction also cannot be ruled out solely because Robot Error says no errors. Treat unavailable telemetry as unknown, not stationary.

This change leaves cycle interpretation, timing thresholds, notifications, and completion policies to the home automation system. It does not alter timezone controls, NBS Time, the scheduler, robot commands, or the UI State sensor.

## Validation

The decoder tests compile and execute the actual C++ decoder extracted from `config/comp/gen2.yaml`, rather than a separate reimplementation. They require Python 3 and a C++17 compiler (`CXX` can override `c++`):

```sh
python3 tests/test_gen2_motors.py
```

The running fixture was captured from a Botvac Connected (non-DX, model 905-0249), robot firmware 2.2.0: vacuum 9000 RPM, brush 1362 RPM, left wheel 5100 RPM and right wheel 4500 RPM. A local version of the same telemetry logic on an ESP32-C3 Mini was also observed docked/charging with all four RPMs zero and no error. This is one hardware/firmware combination, not validation across every Gen 2 model. The focused PR configuration is compile-tested separately; full end-to-end cleaning-cycle automation remains the user's responsibility.

Related work: [PR #71](https://github.com/vacuula/fang/pull/71) also proposes Gen 2 motor telemetry along with other changes. This contribution is independently scoped to the current modular Gen 2 package and includes complete-frame validation, unavailable handling, and decoder regression tests.