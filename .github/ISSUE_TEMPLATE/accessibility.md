---
name: ♿ Accessibility (a11y)
about: Report issues with keyboard navigation, screen readers, or contrast.
title: "[A11Y] "
labels: ["accessibility", "triage"]
assignees: []
---

## Description
<!-- A clear and concise description of the accessibility barrier (e.g. missing ARIA labels, contrast violations, broken tab index). -->

## Steps to Reproduce / Audit Steps
<!-- Steps to reproduce the accessibility barrier: -->
1. Navigate to page '...'
2. Attempt keyboard navigation using Tab keys
3. Notice cursor gets trapped or element cannot be focused

## Expected Behavior
<!-- How should the component interact for assistive technologies? -->

## Screenshots / Audit Logs
<!-- Attach Axe DevTools reports, Lighthouse accessibility logs, or screen reader transcript logs. -->

## Acceptance Criteria
- [ ] Keyboard navigation is fully functional (no trap states, correct tab order).
- [ ] Interactive elements have explicit, descriptive labels.
- [ ] Contrast ratios meet WCAG AA standards.

## Checklist
- [ ] I have verified this issue using standard assistive tools (e.g. keyboard navigation, screen reader).
- [ ] I have ran the project checks locally (`npm run lint`).
- [ ] I have verified this is not an issue with my browser settings.
