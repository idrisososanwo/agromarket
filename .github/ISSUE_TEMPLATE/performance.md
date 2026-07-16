---
name: ⚡ Performance Optimization
about: Report lag, slow database queries, or loading issues.
title: "[PERF] "
labels: ["performance", "triage"]
assignees: []
---

## Description
<!-- Describe the performance issue in detail (e.g. slow page load, Horizon API latency, database query bottlenecks). -->

## Steps to Reproduce / Profiling Steps
<!-- Detail the steps to reproduce the lag or how you profiled it: -->
1. Navigate to '...'
2. Open Chrome DevTools Network Tab
3. Observe time to first byte (TTFB) or query run time

## Expected Behavior
<!-- What is the expected response time or page speed? -->

## Screenshots / Profiling Reports
<!-- Attach Lighthouse reports, trace logs, or query explain plans. -->

## Acceptance Criteria
- [ ] Response time / rendering speed is optimized.
- [ ] Database indexes are audited and added where appropriate.
- [ ] No regression in functionality or type safety.

## Checklist
- [ ] I have verified this is not an issue with my local network or Stellar testnet nodes.
- [ ] I have provided concrete performance metrics (e.g. milliseconds, Lighthouse scores).
- [ ] I have ran `npx tsc --noEmit` locally to ensure no compilation errors.
}
