# @react-spectrum/native

This package is part of [react-spectrum](https://github.com/adobe/react-spectrum). See the repo for more details.

## What this is

A React Native port of Spectrum 2 components, styled to look like their `@react-spectrum/s2`
counterparts using real Spectrum design tokens (colors, spacing, corner radii, type sizes pulled
from `@adobe/spectrum-tokens` and from the per-component sizing baked into each S2 source file —
see `src/theme/tokens.ts` for exactly where each value came from).

This phase ships the foundation — the token module, the package scaffold, and three pilot
components (`Button`, `Checkbox`, `TextField`) that establish the pattern for the ~55 components
still to come.

## What this is *not*

This is a **visual-only** port, not a reimplementation of `react-aria`'s behavior. The real S2
components are built on `react-aria`/`react-aria-components`, which provide DOM-based keyboard
navigation, focus management, and screen reader semantics that don't exist in the same form on
React Native. Components in this package use plain React Native primitives instead — `Pressable`
+ `onPress`, `TextInput` + `onChangeText` — and only approximate a subset of basic accessibility
props (`accessibilityRole`, `accessibilityState`) rather than react-aria's full behavior.

If you need real screen-reader/keyboard parity with Spectrum on a DOM target, use
`@react-spectrum/s2` (or `react-aria-components`) instead. This package is for teams building a
native mobile app who want it to *look* like Spectrum.

## Usage

```tsx
import {Button, Checkbox, TextField} from '@react-spectrum/native';

<Button variant="accent" onPress={() => {}}>Save</Button>
<Checkbox isSelected onChange={() => {}}>Remember me</Checkbox>
<TextField label="Email" value={value} onChangeText={setValue} />
```
