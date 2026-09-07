"""Compile and test the actual decoder embedded in the Gen 2 YAML (Python 3 + C++17)."""
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import tempfile
import textwrap

ROOT = Path(__file__).resolve().parents[1]
yaml_text = (ROOT / 'config/comp/gen2.yaml').read_text(encoding='utf-8')
match = re.search(r'// BEGIN motor decoder[^\n]*\n(.*?)\s*// END motor decoder', yaml_text, re.S)
if not match:
    raise SystemExit('Motor decoder markers not found')
decoder = textwrap.dedent(match.group(1))
fixture = (ROOT / 'tests/fixtures/gen2-getmotors.txt').read_text(encoding='utf-8').splitlines()
fixture_cpp = ','.join(json.dumps(line) for line in fixture)
source = r'''
#include <cassert>
#include <cctype>
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>
int main() {
''' + decoder + '\n auto sample = parse_motors({' + fixture_cpp + r'''});
  assert(sample.valid && sample.vacuum == 9000 && sample.brush == 1362);
  assert(sample.left == 5100 && sample.right == 4500);
  assert(sample.vacuum_running() && sample.brush_running() && sample.wheels_moving());
  assert(std::string(sample.activity()) == "cleaning");
  sample = parse_motors({"Vacuum_RPM,9000", "Brush_RPM,0", "LeftWheel_RPM,0", "RightWheel_RPM,0"});
  assert(!sample.wheels_moving() && std::string(sample.activity()) == "cleaning");
  sample = parse_motors({"Vacuum_RPM,0", "Brush_RPM,1362", "LeftWheel_RPM,0", "RightWheel_RPM,0"});
  assert(sample.brush_running() && std::string(sample.activity()) == "cleaning");
  sample = parse_motors({"Vacuum_RPM,0", "Brush_RPM,0", "LeftWheel_RPM,-150", "RightWheel_RPM,0"});
  assert(sample.wheels_moving() && std::string(sample.activity()) == "moving");
  sample = parse_motors({"Vacuum_RPM,0", "Brush_RPM,0", "LeftWheel_RPM,0", "RightWheel_RPM,-150"});
  assert(sample.wheels_moving() && std::string(sample.activity()) == "moving");
  sample = parse_motors({" Vacuum_RPM , 0 ", "Brush_RPM,0", "LeftWheel_RPM,0", "RightWheel_RPM,0"});
  assert(sample.valid && !sample.vacuum_running() && !sample.brush_running() && !sample.wheels_moving());
  assert(std::string(sample.activity()) == "stationary");
  for (const auto &bad : {"", "bad", "NaN", "inf", "-inf", "1e100", "100junk", "0,0"}) {
    sample = parse_motors({std::string("Vacuum_RPM,") + bad, "Brush_RPM,0", "LeftWheel_RPM,0", "RightWheel_RPM,0"});
    assert(!sample.valid && std::string(sample.activity()) == "unavailable");
  }
  assert(!parse_motors({"Vacuum_RPM,0", "Brush_RPM,0", "LeftWheel_RPM,0"}).valid);
  assert(!parse_motors({"Unknown Cmd: 'GetMotors'"}).valid);
  assert(!parse_motors({}).valid);
  assert(!parse_motors({"Vacuum_RPM,0", "Vacuum_RPM,1", "Brush_RPM,0", "LeftWheel_RPM,0", "RightWheel_RPM,0"}).valid);
  // Invalid values in every field must invalidate the entire frame.
  for (int field = 0; field < 4; ++field) {
    std::vector<std::string> rows = {"Vacuum_RPM,0", "Brush_RPM,0", "LeftWheel_RPM,0", "RightWheel_RPM,0"};
    rows[field] = rows[field].substr(0, rows[field].find(',') + 1) + "bad";
    assert(!parse_motors(rows).valid);
  }
  // A valid stopped sample after a malformed frame can recover normally.
  assert(std::string(parse_motors({"Vacuum_RPM,0", "Brush_RPM,0", "LeftWheel_RPM,0", "RightWheel_RPM,0"}).activity()) == "stationary");
  std::cout << "PASS: captured running frame, brush/vacuum activity, signed wheels, stationary, whitespace, malformed/missing/duplicate fields and recovery\n";
}
'''
with tempfile.TemporaryDirectory(prefix='fang-gen2-motors-') as directory:
    directory = Path(directory)
    cpp = directory / 'test.cpp'
    binary = directory / ('test.exe' if os.name == 'nt' else 'test')
    cpp.write_text(source, encoding='utf-8')
    subprocess.run(shlex.split(os.environ.get('CXX', 'c++')) + ['-std=c++17', '-Wall', '-Wextra', '-Werror', str(cpp), '-o', str(binary)], check=True)
    subprocess.run([str(binary)], check=True)