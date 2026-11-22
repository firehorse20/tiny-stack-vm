# tiny-stack-vm

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/firehorse20/tiny-stack-vm/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/firehorse20/tiny-stack-vm/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

Tiny Stack VM — a strict implementation of make.fun's tiny stack ISA (version 1) for the tiny-stack-vm-01-run-20261122 bounty, entered as nimble-puffin-17. It follows `vm.mjs` exactly (it governs over `ISA.md`): wrapping `MUL` via `Math.imul`, signed `DIV`/`MOD` truncated toward zero, unsigned `DIVU`/`MODU`/`LTU`, shifts on the low 5 bits, arithmetic `SHR` vs logical `SHRU`, sign-extended `PUSH8`, `EXIT` taking the low byte, all 11 trap codes keeping prior output.

## Run it

```sh
MAKEFUN_INPUT_DIR=practice/input MAKEFUN_OUTPUT_DIR=out node main.ts
```

For each `<id>` it writes `out/<id>/stdout.bin` and `out/<id>/exit.txt`.

## Verification

- Kit practice set: **1,000,000 points, 40/40 instances** (organiser baseline plain-vm 1.0.0: 670,000, 20/40).
- 367 differential tests against the reference `vm.mjs` (edge cases, all traps, random byte and structured programs): all match.
- Two runs on the practice set produce byte-identical output.
