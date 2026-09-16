/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Design tokens for @react-spectrum/native.
 *
 * These values are NOT eyeballed. They are lifted from two real sources of truth in this
 * monorepo:
 *
 * 1. `@adobe/spectrum-tokens` (the same version pinned by `@react-spectrum/s2`'s
 *    devDependencies, `14.15.0`) — specifically `dist/json/variables.json`. Every color pair
 *    below was read out of that JSON (following `sets.light.value` / `sets.dark.value`, and
 *    chasing `ref` pointers such as `accent-color-900 -> {blue-900}`) rather than approximated
 *    from screenshots. Only the colors actually used by the three pilot components (Button,
 *    Checkbox, TextField) are exported here — the real package has ~800+ tokens, which would be
 *    massive overkill for a visual-only RN port.
 * 2. `packages/@react-spectrum/s2/style/spectrum-theme.ts` and `style-utils.ts` — these define
 *    the *scales* (spacing steps, the border-radius "Major Second" scale, the control height
 *    scale used by Button/ActionButton/Checkbox/TextField, font sizes) that turn raw tokens into
 *    the actual per-size pixel values components use. Where that file computes a value with a
 *    CSS `calc()`/`round()` expression (e.g. the checkbox's per-size corner radius, which scales
 *    the 4px "sm" radius by a `1.125^n` "Major Second" factor per t-shirt size), we resolved the
 *    math to a concrete number at M/L/etc. sizes ourselves, since RN has no `calc()`.
 *
 * See the individual component files for exactly which S2 source line each per-component number
 * (button height, checkbox box size, text field border, ...) came from.
 */

// -----------------------------------------------------------------------------------------------
// Color
// -----------------------------------------------------------------------------------------------

/** A light/dark color pair, mirroring the `sets.light.value` / `sets.dark.value` shape used by
 * the real `@adobe/spectrum-tokens` JSON (see `packages/@react-spectrum/s2/style/tokens.ts`). */
export interface ColorPair {
  light: string;
  dark: string;
}

/**
 * Color tokens actually used by Button, Checkbox and TextField, read from
 * `@adobe/spectrum-tokens@14.15.0`'s `dist/json/variables.json`. Names match the raw token names
 * (e.g. `gray-800`, `accent-900`) rather than the S2-specific aliases (`neutral`, `baseColor(...)`)
 * so they're easy to cross-reference against the JSON or Spectrum's public token docs.
 */
export const colors = {
  white: {light: 'rgb(255, 255, 255)', dark: 'rgb(255, 255, 255)'} satisfies ColorPair,
  black: {light: 'rgb(0, 0, 0)', dark: 'rgb(0, 0, 0)'} satisfies ColorPair,

  // Gray scale (`gray-*` in variables.json).
  'gray-25': {light: 'rgb(255, 255, 255)', dark: 'rgb(17, 17, 17)'} satisfies ColorPair,
  'gray-100': {light: 'rgb(233, 233, 233)', dark: 'rgb(44, 44, 44)'} satisfies ColorPair,
  'gray-300': {light: 'rgb(218, 218, 218)', dark: 'rgb(57, 57, 57)'} satisfies ColorPair,
  'gray-400': {light: 'rgb(198, 198, 198)', dark: 'rgb(68, 68, 68)'} satisfies ColorPair,
  'gray-600': {light: 'rgb(113, 113, 113)', dark: 'rgb(138, 138, 138)'} satisfies ColorPair,
  'gray-800': {light: 'rgb(41, 41, 41)', dark: 'rgb(219, 219, 219)'} satisfies ColorPair,
  'gray-900': {light: 'rgb(19, 19, 19)', dark: 'rgb(242, 242, 242)'} satisfies ColorPair,

  // Accent (blue) scale — `accent-color-900` etc. in variables.json `ref` to `blue-900` etc.
  'accent-600': {light: 'rgb(114, 158, 253)', dark: 'rgb(37, 73, 229)'} satisfies ColorPair,
  'accent-700': {light: 'rgb(93, 137, 255)', dark: 'rgb(52, 91, 248)'} satisfies ColorPair,
  'accent-900': {light: 'rgb(59, 99, 251)', dark: 'rgb(86, 129, 255)'} satisfies ColorPair,
  'accent-1000': {light: 'rgb(39, 77, 234)', dark: 'rgb(105, 149, 254)'} satisfies ColorPair,

  // Negative (red) scale — `negative-color-900` etc. `ref` to `red-900` etc.
  'negative-600': {light: 'rgb(255, 118, 101)', dark: 'rgb(177, 38, 23)'} satisfies ColorPair,
  'negative-700': {light: 'rgb(255, 81, 61)', dark: 'rgb(205, 46, 29)'} satisfies ColorPair,
  'negative-900': {light: 'rgb(215, 50, 32)', dark: 'rgb(252, 67, 46)'} satisfies ColorPair,
  'negative-1000': {light: 'rgb(183, 40, 24)', dark: 'rgb(255, 103, 86)'} satisfies ColorPair,

  // `focus-indicator-color` -> `ref` to `blue-800`. Used for the focus ring in S2's `focusRing()`
  // style mixin (`packages/@react-spectrum/s2/style/index.ts`).
  'focus-ring': {light: 'rgb(75, 117, 255)', dark: 'rgb(64, 105, 253)'} satisfies ColorPair,

  // ---------------------------------------------------------------------------------------------
  // Semantic status colors, added for the Avatar/Badge/StatusLight/Meter/ProgressBar/
  // ProgressCircle/InlineAlert display-and-status components. Same extraction method as above
  // (`@adobe/spectrum-tokens@14.15.0`'s `dist/json/variables.json`, `sets.light.value` /
  // `sets.dark.value`), cross-checked against how `packages/@react-spectrum/s2/style/
  // spectrum-theme.ts` (`colorToken()`/`weirdColorToken()`/`colorScale()`, lines ~742-835) turns
  // the raw scale into the semantic names those components' `style()` literals actually reference
  // (e.g. Badge/Meter/ProgressBar/StatusLight/InlineAlert all read `informative-800`/`-900`,
  // `positive-800`/`-900`, `notice-800`/`-900`, `negative-800`/`-900` directly; `informative` is a
  // pure alias for the `blue` scale, `positive` for `green`, `notice` for `orange`, `negative` and
  // `accent` both partly overlap `red`/`blue`).
  // ---------------------------------------------------------------------------------------------

  // Accent (blue) extra steps — for Badge/StatusLight/InlineAlert visual fills.
  'accent-200': {light: 'rgb(229, 240, 254)', dark: 'rgb(15, 28, 82)'} satisfies ColorPair, // accent-subtle-background-color-default (light half)
  'accent-300': {light: 'rgb(203, 226, 254)', dark: 'rgb(12, 33, 117)'} satisfies ColorPair, // accent-subtle-background-color-default (dark half)
  'accent-800': {light: 'rgb(75, 117, 255)', dark: 'rgb(64, 105, 253)'} satisfies ColorPair, // accent-visual-color (light half)

  // Informative (blue) scale — informative-color-* in variables.json.
  'informative-200': {light: 'rgb(229, 240, 254)', dark: 'rgb(15, 28, 82)'} satisfies ColorPair,
  'informative-300': {light: 'rgb(203, 226, 254)', dark: 'rgb(12, 33, 117)'} satisfies ColorPair,
  'informative-700': {light: 'rgb(93, 137, 255)', dark: 'rgb(52, 91, 248)'} satisfies ColorPair,
  'informative-800': {light: 'rgb(75, 117, 255)', dark: 'rgb(64, 105, 253)'} satisfies ColorPair,
  'informative-900': {light: 'rgb(59, 99, 251)', dark: 'rgb(86, 129, 255)'} satisfies ColorPair,

  // Positive (green) scale — positive-color-*.
  'positive-200': {light: 'rgb(215, 247, 225)', dark: 'rgb(0, 38, 29)'} satisfies ColorPair,
  'positive-300': {light: 'rgb(173, 238, 197)', dark: 'rgb(0, 51, 38)'} satisfies ColorPair,
  'positive-700': {light: 'rgb(11, 164, 93)', dark: 'rgb(4, 124, 75)'} satisfies ColorPair,
  'positive-800': {light: 'rgb(7, 147, 85)', dark: 'rgb(6, 136, 80)'} satisfies ColorPair,
  'positive-900': {light: 'rgb(5, 131, 78)', dark: 'rgb(9, 157, 89)'} satisfies ColorPair,

  // Notice (orange) scale — notice-color-*.
  'notice-200': {light: 'rgb(255, 236, 207)', dark: 'rgb(61, 21, 0)'} satisfies ColorPair,
  'notice-300': {light: 'rgb(255, 218, 158)', dark: 'rgb(80, 27, 0)'} satisfies ColorPair,
  'notice-700': {light: 'rgb(232, 106, 0)', dark: 'rgb(185, 73, 0)'} satisfies ColorPair,
  'notice-800': {light: 'rgb(212, 91, 0)', dark: 'rgb(199, 82, 0)'} satisfies ColorPair,
  'notice-900': {light: 'rgb(194, 78, 0)', dark: 'rgb(224, 100, 0)'} satisfies ColorPair,

  // Negative (red) extra steps.
  'negative-200': {light: 'rgb(255, 235, 232)', dark: 'rgb(68, 13, 5)'} satisfies ColorPair,
  'negative-300': {light: 'rgb(255, 214, 209)', dark: 'rgb(87, 17, 7)'} satisfies ColorPair,
  'negative-800': {light: 'rgb(240, 56, 35)', dark: 'rgb(223, 52, 34)'} satisfies ColorPair,

  // Gray extras beyond the pilot-component set.
  'gray-200': {light: 'rgb(225, 225, 225)', dark: 'rgb(50, 50, 50)'} satisfies ColorPair,
  'gray-500': {light: 'rgb(143, 143, 143)', dark: 'rgb(109, 109, 109)'} satisfies ColorPair,
  'gray-700': {light: 'rgb(80, 80, 80)', dark: 'rgb(175, 175, 175)'} satisfies ColorPair,
  'gray-1000': {light: 'rgb(0, 0, 0)', dark: 'rgb(255, 255, 255)'} satisfies ColorPair,

  // `neutral-subdued-background-color-default` is a `weirdColorToken` (per-mode ref): its light
  // value comes from `{gray-700}`'s own light value, its dark value from `{gray-500}`'s own dark
  // value (NOT the same scale step in both modes) — used by Badge's neutral `bold` fill and
  // InlineAlert's neutral `boldFill` background.
  'neutral-subdued': {light: 'rgb(80, 80, 80)', dark: 'rgb(109, 109, 109)'} satisfies ColorPair,

  // Extended hue scale — Badge and StatusLight both expose ~19 "fun color" variants beyond the
  // semantic ones (celery, chartreuse, cyan, fuchsia, purple, magenta, indigo, seafoam, yellow,
  // pink, turquoise, cinnamon, brown, silver, plus the raw gray/red/orange/yellow/green/blue
  // scales). Each gets its bold-fill step (900, matching that hue's `-visual-color` alias) and its
  // subtle-fill steps (200/300, matching `-subtle-background-color-default`).
  'red-200': {light: 'rgb(255, 235, 232)', dark: 'rgb(68, 13, 5)'} satisfies ColorPair,
  'red-300': {light: 'rgb(255, 214, 209)', dark: 'rgb(87, 17, 7)'} satisfies ColorPair,
  'red-900': {light: 'rgb(215, 50, 32)', dark: 'rgb(252, 67, 46)'} satisfies ColorPair,
  'orange-200': {light: 'rgb(255, 236, 207)', dark: 'rgb(61, 21, 0)'} satisfies ColorPair,
  'orange-300': {light: 'rgb(255, 218, 158)', dark: 'rgb(80, 27, 0)'} satisfies ColorPair,
  'orange-900': {light: 'rgb(194, 78, 0)', dark: 'rgb(224, 100, 0)'} satisfies ColorPair,
  'yellow-200': {light: 'rgb(255, 241, 151)', dark: 'rgb(47, 29, 0)'} satisfies ColorPair,
  'yellow-300': {light: 'rgb(255, 222, 44)', dark: 'rgb(61, 39, 0)'} satisfies ColorPair,
  'yellow-900': {light: 'rgb(158, 102, 0)', dark: 'rgb(186, 124, 0)'} satisfies ColorPair,
  'chartreuse-200': {light: 'rgb(234, 246, 173)', dark: 'rgb(30, 36, 0)'} satisfies ColorPair,
  'chartreuse-300': {light: 'rgb(208, 236, 70)', dark: 'rgb(39, 47, 0)'} satisfies ColorPair,
  'chartreuse-900': {light: 'rgb(102, 122, 0)', dark: 'rgb(122, 147, 0)'} satisfies ColorPair,
  'celery-200': {light: 'rgb(197, 255, 156)', dark: 'rgb(15, 38, 0)'} satisfies ColorPair,
  'celery-300': {light: 'rgb(157, 247, 92)', dark: 'rgb(21, 51, 1)'} satisfies ColorPair,
  'celery-900': {light: 'rgb(64, 129, 17)', dark: 'rgb(78, 154, 23)'} satisfies ColorPair,
  'green-200': {light: 'rgb(215, 247, 225)', dark: 'rgb(0, 38, 29)'} satisfies ColorPair,
  'green-300': {light: 'rgb(173, 238, 197)', dark: 'rgb(0, 51, 38)'} satisfies ColorPair,
  'green-900': {light: 'rgb(5, 131, 78)', dark: 'rgb(9, 157, 89)'} satisfies ColorPair,
  'seafoam-200': {light: 'rgb(211, 246, 234)', dark: 'rgb(0, 39, 35)'} satisfies ColorPair,
  'seafoam-300': {light: 'rgb(169, 237, 216)', dark: 'rgb(0, 50, 44)'} satisfies ColorPair,
  'seafoam-900': {light: 'rgb(7, 129, 109)', dark: 'rgb(10, 154, 128)'} satisfies ColorPair,
  'cyan-200': {light: 'rgb(217, 244, 253)', dark: 'rgb(0, 36, 49)'} satisfies ColorPair,
  'cyan-300': {light: 'rgb(183, 231, 252)', dark: 'rgb(0, 48, 65)'} satisfies ColorPair,
  'cyan-900': {light: 'rgb(11, 120, 179)', dark: 'rgb(24, 142, 220)'} satisfies ColorPair,
  'blue-200': {light: 'rgb(229, 240, 254)', dark: 'rgb(15, 28, 82)'} satisfies ColorPair,
  'blue-300': {light: 'rgb(203, 226, 254)', dark: 'rgb(12, 33, 117)'} satisfies ColorPair,
  'blue-900': {light: 'rgb(59, 99, 251)', dark: 'rgb(86, 129, 255)'} satisfies ColorPair,
  'indigo-200': {light: 'rgb(235, 238, 255)', dark: 'rgb(35, 0, 110)'} satisfies ColorPair,
  'indigo-300': {light: 'rgb(216, 222, 255)', dark: 'rgb(47, 0, 140)'} satisfies ColorPair,
  'indigo-900': {light: 'rgb(113, 85, 250)', dark: 'rgb(128, 119, 254)'} satisfies ColorPair,
  'purple-200': {light: 'rgb(244, 235, 252)', dark: 'rgb(50, 0, 96)'} satisfies ColorPair,
  'purple-300': {light: 'rgb(235, 218, 249)', dark: 'rgb(64, 0, 122)'} satisfies ColorPair,
  'purple-900': {light: 'rgb(154, 71, 226)', dark: 'rgb(173, 105, 233)'} satisfies ColorPair,
  'fuchsia-200': {light: 'rgb(253, 233, 255)', dark: 'rgb(61, 0, 74)'} satisfies ColorPair,
  'fuchsia-300': {light: 'rgb(250, 211, 255)', dark: 'rgb(79, 0, 95)'} satisfies ColorPair,
  'fuchsia-900': {light: 'rgb(181, 57, 200)', dark: 'rgb(213, 73, 235)'} satisfies ColorPair,
  'magenta-200': {light: 'rgb(255, 232, 240)', dark: 'rgb(74, 0, 27)'} satisfies ColorPair,
  'magenta-300': {light: 'rgb(255, 213, 227)', dark: 'rgb(93, 0, 34)'} satisfies ColorPair,
  'magenta-900': {light: 'rgb(217, 35, 97)', dark: 'rgb(255, 51, 119)'} satisfies ColorPair,
  'pink-200': {light: 'rgb(255, 232, 247)', dark: 'rgb(71, 0, 44)'} satisfies ColorPair,
  'pink-300': {light: 'rgb(255, 211, 240)', dark: 'rgb(90, 0, 57)'} satisfies ColorPair,
  'pink-900': {light: 'rgb(206, 42, 146)', dark: 'rgb(236, 67, 175)'} satisfies ColorPair,
  'turquoise-200': {light: 'rgb(209, 245, 245)', dark: 'rgb(0, 37, 41)'} satisfies ColorPair,
  'turquoise-300': {light: 'rgb(169, 236, 237)', dark: 'rgb(0, 49, 54)'} satisfies ColorPair,
  'turquoise-900': {light: 'rgb(8, 126, 137)', dark: 'rgb(11, 151, 164)'} satisfies ColorPair,
  'brown-200': {light: 'rgb(247, 238, 225)', dark: 'rgb(44, 31, 11)'} satisfies ColorPair,
  'brown-300': {light: 'rgb(239, 221, 195)', dark: 'rgb(58, 40, 14)'} satisfies ColorPair,
  'brown-900': {light: 'rgb(139, 109, 66)', dark: 'rgb(163, 132, 84)'} satisfies ColorPair,
  'cinnamon-200': {light: 'rgb(249, 236, 229)', dark: 'rgb(59, 21, 5)'} satisfies ColorPair,
  'cinnamon-300': {light: 'rgb(244, 218, 203)', dark: 'rgb(79, 28, 7)'} satisfies ColorPair,
  'cinnamon-900': {light: 'rgb(170, 94, 56)', dark: 'rgb(192, 119, 80)'} satisfies ColorPair,
  'silver-200': {light: 'rgb(239, 239, 239)', dark: 'rgb(33, 33, 33)'} satisfies ColorPair,
  'silver-300': {light: 'rgb(223, 223, 223)', dark: 'rgb(44, 44, 44)'} satisfies ColorPair,
  'silver-900': {light: 'rgb(114, 114, 114)', dark: 'rgb(137, 137, 137)'} satisfies ColorPair
} as const;

export type ColorToken = keyof typeof colors;

/** Semantic color aliases, mirroring how S2 components reference `baseColor('neutral')`,
 * `disabled-*`, etc. rather than raw scale steps. Resolved from variables.json's `ref` chains:
 * `neutral-content-color-default -> {gray-800}`, `disabled-content-color -> {gray-400}`,
 * `disabled-background-color -> {gray-100}`, `disabled-border-color -> {gray-300}`. */
export const semanticColors = {
  neutralContent: colors['gray-800'],
  disabledContent: colors['gray-400'],
  disabledBackground: colors['gray-100'],
  disabledBorder: colors['gray-300']
} as const;

/**
 * Resolves a color token to the correct value for the given color scheme. This is a plain
 * light/dark switch (no CSS `light-dark()`), so callers should pass the RN
 * `useColorScheme()`/`Appearance` result.
 */
export function getColor(token: ColorToken, scheme: 'light' | 'dark' = 'light'): string {
  return colors[token][scheme];
}

// -----------------------------------------------------------------------------------------------
// Spacing
// -----------------------------------------------------------------------------------------------

/**
 * The Spectrum 2 base spacing scale in px, from `generateSpacing()`'s input array in
 * `packages/@react-spectrum/s2/style/spectrum-theme.ts` (lines ~367-387). S2 converts these to
 * rem for `spacing`/`margin` and leaves them as px for `padding`; RN has no rem, so we just use
 * px throughout.
 */
export const spacing = {
  50: 2,
  75: 4,
  100: 8,
  200: 12,
  300: 16,
  400: 24,
  500: 32,
  600: 40,
  700: 48,
  800: 64,
  900: 80,
  1000: 96
} as const;

export type SpacingToken = keyof typeof spacing;

// -----------------------------------------------------------------------------------------------
// Corner radius
// -----------------------------------------------------------------------------------------------

/**
 * The Spectrum 2 corner-radius scale, from `radius` in `spectrum-theme.ts` (lines ~523-531),
 * which itself reads `corner-radius-{none,small,medium,large,extra-large}-default` from
 * variables.json (values confirmed against the raw JSON: 0px / 4px / 8px / 10px / 16px).
 */
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 10,
  xl: 16,
  /** Fully round — used for pill-shaped buttons. Callers should pass `height / 2`. */
  pill: 9999
} as const;

// -----------------------------------------------------------------------------------------------
// Border width
// -----------------------------------------------------------------------------------------------

/** `border-width-{100,200,400}` from variables.json, as used via `borderWidth` in
 * `spectrum-theme.ts` (lines ~516-521). */
export const borderWidth = {
  100: 1,
  200: 2,
  400: 4
} as const;

// -----------------------------------------------------------------------------------------------
// Typography
// -----------------------------------------------------------------------------------------------

/**
 * `font-size-{50,75,100,200,300}` "desktop" set values from variables.json (11/12/14/16/18px),
 * matching the `ui-xs`/`ui-sm`/`ui`/`ui-lg`/`ui-xl` names S2 gives them in `fontSize` in
 * `spectrum-theme.ts` (lines ~636-644). These are the sizes used by Button/Checkbox/TextField's
 * `controlFont()` (`style-utils.ts` lines ~209-218).
 */
export const fontSize = {
  'ui-xs': 11,
  'ui-sm': 12,
  ui: 14,
  'ui-lg': 16,
  'ui-xl': 18
} as const;

/** `font-weight-{normal,medium,bold,extra-bold,black}` values from `fontWeightBase` in
 * `spectrum-theme.ts` (lines ~579-597). */
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  black: '900' as const
};

// -----------------------------------------------------------------------------------------------
// Control (Button / Checkbox / TextField) sizing
// -----------------------------------------------------------------------------------------------

export type ControlSize = 'S' | 'M' | 'L' | 'XL';

/**
 * The "md" control-height scale from `controlSizeM` in `style-utils.ts` (lines ~223-231). Drives
 * Button height and TextField field height (both use `control({...})`, which calls
 * `controlSize()` with no argument -> this scale).
 */
export const controlHeight: Record<ControlSize, number> = {
  S: 24,
  M: 32,
  L: 40,
  XL: 48
};

/**
 * The "sm" control-height scale from `controlSizeS` in `style-utils.ts` (lines ~233-240). Drives
 * the Checkbox box size (`Checkbox.tsx` line ~142: `size: controlSize('sm')`).
 */
export const checkboxBoxSize: Record<ControlSize, number> = {
  S: 14,
  M: 16,
  L: 18,
  XL: 20
};

/**
 * Checkbox box corner radius per size. S2 computes this dynamically with
 * `round(4px * 1.125^n, 1px)` (`controlBorderRadius('sm')` in `style-utils.ts` lines ~244-263,
 * where `n` is -1/0/1/2 for S/M/L/XL — a "Major Second" logarithmic scale). We resolved that
 * calc() to concrete numbers since RN can't evaluate it at runtime: 4*0.889≈3.6, 4*1=4,
 * 4*1.125=4.5, 4*1.2656≈5.06.
 */
export const checkboxBoxRadius: Record<ControlSize, number> = {
  S: 4,
  M: 4,
  L: 5,
  XL: 5
};

/**
 * TextField corner radius per size, same "Major Second" formula as above but starting from the
 * "default" (not "sm") radius step, 8px (`control({shape: 'default'})` in `Field.tsx` line ~203
 * combines with `controlBorderRadius()`'s default `size` param). 8*0.889≈7.1, 8*1=8,
 * 8*1.125=9, 8*1.2656≈10.1.
 */
export const textFieldRadius: Record<ControlSize, number> = {
  S: 7,
  M: 8,
  L: 9,
  XL: 10
};

/**
 * Button horizontal padding per size. S2's pill buttons set `paddingX: 'pill'`, which resolves
 * (`relativeSpacing.pill` in `spectrum-theme.ts` line ~437) to `calc(height / 2)` — i.e. exactly
 * enough padding to make the pill's straight edges as wide as its rounded ends are tall.
 */
export const buttonPaddingX: Record<ControlSize, number> = {
  S: controlHeight.S / 2,
  M: controlHeight.M / 2,
  L: controlHeight.L / 2,
  XL: controlHeight.XL / 2
};

/** Button font size per size, from `controlFont()` (`style-utils.ts` lines ~209-218): the base
 * ('M') control font is `ui` (14px); S/L/XL override to `ui-sm`/`ui-lg`/`ui-xl`. */
export const controlFontSize: Record<ControlSize, number> = {
  S: fontSize['ui-sm'],
  M: fontSize.ui,
  L: fontSize['ui-lg'],
  XL: fontSize['ui-xl']
};

/** Icon/checkmark size to pair with each checkbox size — S2's `Checkbox.tsx` (line ~195-200,
 * `smallerSize`) draws the check/dash icon one t-shirt size down from the box's own size, e.g. a
 * size='M' checkbox (16px box) uses a size='S' icon. We just derive a pixel glyph size directly
 * from the box size instead, since the RN port has no separate icon-size token set. */
export const checkboxIconSize: Record<ControlSize, number> = {
  S: 10,
  M: 12,
  L: 14,
  XL: 16
};

// -----------------------------------------------------------------------------------------------
// ActionButton / ToggleButton / ActionGroup / Tag sizing
// -----------------------------------------------------------------------------------------------

/**
 * ActionButton, ToggleButton, ActionGroup and Tag all support an 'XS' size that plain `Button`
 * doesn't (`ActionButtonStyleProps['size']` in `packages/@react-spectrum/s2/src/ActionButton.tsx`
 * line ~57 vs. `Button`'s S/M/L/XL-only `ButtonSize`).
 */
export type ActionControlSize = 'XS' | ControlSize;

/**
 * The "md" control-height scale *including* 'XS', from `controlSizeM` in
 * `packages/@react-spectrum/s2/src/style-utils.ts` (lines ~223-231). Same numbers as
 * `controlHeight` above for S/M/L/XL, plus the 20px XS step that scale also defines.
 */
export const actionControlHeight: Record<ActionControlSize, number> = {
  XS: 20,
  S: 24,
  M: 32,
  L: 40,
  XL: 48
};

/**
 * Corner radius for a default-shape (non-pill) control at each size — ActionButton, Tag, and
 * (indirectly, via ToggleButton reusing `btnStyles`) ToggleButton. Same
 * `controlBorderRadius('default')` "Major Second" formula as `textFieldRadius` above
 * (`style-utils.ts` lines ~244-263: `round(8px * 1.125^n, 1px)`, `n` = -2/-1/0/1/2 for
 * XS/S/M/L/XL) — the S/M/L/XL numbers are identical to `textFieldRadius` since both start from the
 * same 8px "default" shape base; this table just also covers the XS step those controls don't have.
 * 8*1.125^-2≈6.32, 8*0.889≈7.11, 8*1=8, 8*1.125=9, 8*1.2656≈10.1.
 */
export const actionControlRadius: Record<ActionControlSize, number> = {
  XS: 6,
  S: 7,
  M: 8,
  L: 9,
  XL: 10
};

/** `controlFont()` (`style-utils.ts` lines ~209-218) including its 'XS' -> `ui-xs` step, which
 * `controlFontSize` above (Button-only) doesn't need. */
export const actionControlFontSize: Record<ActionControlSize, number> = {
  XS: fontSize['ui-xs'],
  S: fontSize['ui-sm'],
  M: fontSize.ui,
  L: fontSize['ui-lg'],
  XL: fontSize['ui-xl']
};

/**
 * Horizontal padding for a default-shape (non-pill) control — the `'edge-to-text'` relative
 * spacing token (`packages/@react-spectrum/s2/style/spectrum-theme.ts` line ~436:
 * `calc(self(height) * 3 / 8)`), resolved against `actionControlHeight` per size. Used by
 * `control({shape: 'default', ...})` (`style-utils.ts` line ~292), i.e. ActionButton/ToggleButton/
 * Tag's horizontal padding, as opposed to Button's pill-shaped `buttonPaddingX` (`height / 2`).
 */
export const edgeToTextPaddingX: Record<ActionControlSize, number> = {
  XS: (actionControlHeight.XS * 3) / 8,
  S: (actionControlHeight.S * 3) / 8,
  M: (actionControlHeight.M * 3) / 8,
  L: (actionControlHeight.L * 3) / 8,
  XL: (actionControlHeight.XL * 3) / 8
};

/**
 * Gap between an icon and text label inside a control, from the `'text-to-visual'` relative
 * spacing token (`spectrum-theme.ts` lines ~431-434: `fontRelative(6)`, i.e. `6/14em` resolved
 * against each size's own font size). The file's own comment gives the resolved per-size pixels
 * directly: "5px, 5px, 6px, 7px, 8px" for XS/S/M/L/XL, which is what's hardcoded below (RN has no
 * `em`, so we can't leave this as a font-relative unit).
 */
export const iconTextGap: Record<ActionControlSize, number> = {
  XS: 5,
  S: 5,
  M: 6,
  L: 7,
  XL: 8
};

/**
 * The "remove" (x) glyph size Tag pairs with each of its sizes, from `Cross`'s per-size `width`/
 * `height` style (`packages/@react-spectrum/s2/ui-icons/Cross.tsx` lines ~23-46): S/M both use the
 * `Cross_S`/`Cross_M` 8px glyph, L uses the 10px glyph, XL the 12px glyph. Tag only actually uses
 * S/M/L (`TagGroupProps['size']` is `'S' | 'M' | 'L'`), XL is included here for completeness since
 * ActionButton/ToggleButton go up to XL.
 */
export const crossIconSize: Record<ActionControlSize, number> = {
  XS: 8,
  S: 8,
  M: 8,
  L: 10,
  XL: 12
};

// -----------------------------------------------------------------------------------------------
// Radio / Switch / Slider sizing
// -----------------------------------------------------------------------------------------------

/**
 * Switch track width per size. S2's `Switch.tsx` `track` style (line ~126-135) sets
 * `--trackWidth: fontRelative(26)`, i.e. `26/14` em, evaluated against each size's control font
 * size (`controlFontSize` above — the em is relative to the `font: controlFont()` set on the
 * enclosing field, not the root). Resolved to px here: `26/14 * controlFontSize[size]`, rounded to
 * the nearest pixel since RN has no `em`.
 */
export const switchTrackWidth: Record<ControlSize, number> = {
  S: 22, // 26/14 * 12 = 22.29
  M: 26, // 26/14 * 14 = 26
  L: 30, // 26/14 * 16 = 29.71
  XL: 33 // 26/14 * 18 = 33.43
};

/**
 * Slider thumb diameter per size, from the "default" (non-`precise`) case of `thumb`/
 * `thumbContainer`/`thumbHitArea` in `packages/@react-spectrum/s2/src/Slider.tsx` (lines
 * ~187-223, ~235-267 — all three agree on the same S/M/L/XL numbers for the default thumb style).
 * The `thumbStyle="precise"` variant (a thinner fixed-6px-wide handle) is dropped as an
 * intentional simplification, same spirit as Button dropping the `premium`/`genai` variants.
 */
export const sliderThumbSize: Record<ControlSize, number> = {
  S: 18,
  M: 20,
  L: 22,
  XL: 24
};

/**
 * Slider track (the full-width hit/layout area containing the visible bar + thumb) height per
 * size, from `track` in `Slider.tsx` (lines ~173-185) — numerically identical to `controlHeight`
 * above, kept as a separate export for call-site clarity since it's a different control family.
 */
export const sliderTrackHeight: Record<ControlSize, number> = controlHeight;

/**
 * Slider's visible bar (the thin colored/gray rail the thumb sits on) thickness and corner
 * radius, from `trackStyling` in `Slider.tsx` (lines ~287-301): `thick` track style (16px, `radius.sm`)
 * is dropped, keeping only the default `thin` style (4px bar, `radius.lg` corners) — same
 * simplification spirit as the dropped `precise` thumb style above.
 */
export const sliderBarHeight = 4;

// -----------------------------------------------------------------------------------------------
// Meter / ProgressBar / ProgressCircle sizing
// -----------------------------------------------------------------------------------------------

/**
 * Track (and fill) thickness for both Meter and ProgressBar — they share the exact same
 * `trackStyles` object (`packages/@react-spectrum/s2/src/Meter.tsx` lines ~76-87 and
 * `ProgressBar.tsx` lines ~127-138, both commented `progress-bar-thickness-{small,medium,large,
 * extra-large}`), so this single table is reused by both RN components rather than duplicated.
 */
export const barTrackHeight: Record<ControlSize, number> = {
  S: 4,
  M: 6,
  L: 8,
  XL: 10
};

/**
 * ProgressCircle only supports S/M/L (no XL) — `ProgressCircleStyleProps['size']` in
 * `packages/@react-spectrum/s2/src/ProgressCircle.tsx` line ~40. Overall diameter from the
 * `wrapper` style's `size` (line ~56-62: default/M 32, S 16, L 64) and stroke width from `track`/
 * `fill` (lines ~68-105: default/M 3px, S 2px, L 4px, converted from `pxToRem()`).
 */
export type ProgressCircleSize = 'S' | 'M' | 'L';

export const progressCircleSize: Record<ProgressCircleSize, number> = {
  S: 16,
  M: 32,
  L: 64
};

export const progressCircleStrokeWidth: Record<ProgressCircleSize, number> = {
  S: 2,
  M: 3,
  L: 4
};

// -----------------------------------------------------------------------------------------------
// Divider / Text / Heading / Label / Breadcrumbs / Tabs / Menu / Accordion sizing
// -----------------------------------------------------------------------------------------------

/** Divider thickness per size, from the `divider` `style()` call in
 * `packages/@react-spectrum/s2/src/Divider.tsx` (lines ~65-96): `height`/`width` (depending on
 * `orientation`) is `[2px]` by default (M), `[1px]` for S, `[4px]` for L. */
export const dividerThickness: Record<'S' | 'M' | 'L', number> = {
  S: 1,
  M: 2,
  L: 4
};

/**
 * Heading type-scale font sizes, keyed to the port's usual S/M/L/XL `ControlSize` (rather than the
 * real component's full XXS-3XL range, to stay consistent with how every other sized component in
 * this port only exposes S/M/L/XL — see `Button`/`Badge`). Values are `heading-size-{s,m,l,xl}` in
 * px, read from `@adobe/spectrum-tokens@14.15.0`'s `src/typography.json` (`heading-size-s` refs
 * `font-size-400` = 20px, `heading-size-m` refs `font-size-500` = 22px, `heading-size-l` refs
 * `font-size-700` = 28px, `heading-size-xl` refs `font-size-900` = 36px), matching how
 * `packages/@react-spectrum/s2/style/spectrum-theme.ts` (lines ~646-653) derives its own
 * `heading-*` `fontSize` entries via `fontSizeToken()`.
 */
export const headingFontSize: Record<ControlSize, number> = {
  S: 20,
  M: 22,
  L: 28,
  XL: 36
};

/** `heading-color` from `spectrum-theme.ts` (`colorToken('heading-color')`) resolves to
 * `{gray-900}` — reuses the existing `gray-900` color token above rather than duplicating it. */
export const headingFontWeight = fontWeight.extraBold; // heading-sans-serif-font-weight: 'extra-bold'

/**
 * Body/Detail type-scale font sizes, same S/M/L/XL keying rationale as `headingFontSize`. Values
 * from `src/typography.json`: `body-size-s`=`font-size-100`=14, `body-size-m`=`font-size-200`=16,
 * `body-size-l`=`font-size-300`=18, `body-size-xl`=`font-size-400`=20; `detail-size-s`=
 * `font-size-75`=12, `detail-size-m`=`font-size-100`=14, `detail-size-l`=`font-size-200`=16,
 * `detail-size-xl`=`font-size-300`=18.
 */
export const bodyFontSize: Record<ControlSize, number> = {
  S: 14,
  M: 16,
  L: 18,
  XL: 20
};

export const detailFontSize: Record<ControlSize, number> = {
  S: 12,
  M: 14,
  L: 16,
  XL: 18
};

/** `body-sans-serif-font-weight: 'regular'` -> `fontWeightBase.normal` (400); `detail-sans-serif-
 * font-weight: 'medium'` -> `fontWeightBase.medium` (500). From `src/typography.json`. */
export const bodyFontWeight = fontWeight.normal;
export const detailFontWeight = fontWeight.medium;

/**
 * Breadcrumbs' text-to-separator gap per size, from the `wrapper` `style()` call in
 * `packages/@react-spectrum/s2/src/Breadcrumbs.tsx` (lines ~115-121, ~126-131): `size(6)`/`size(9)`
 * — the `size()` style macro (`spectrum-theme.ts` line ~466) takes a *raw* px number, so these are
 * just 6px/9px directly (not indices into the `spacing` scale above).
 */
export const breadcrumbsGap: Record<'M' | 'L', number> = {
  M: 6,
  L: 9
};

/** Breadcrumbs' chevron separator glyph size per size, from `Chevron`'s per-size `width`/`height`
 * (`packages/@react-spectrum/s2/ui-icons/Chevron.tsx` lines ~23-40): Breadcrumbs always renders
 * `<ChevronIcon size="M" .../>` (`Breadcrumbs.tsx` line ~417) regardless of its own `size` prop, but
 * this port ties the separator to the Breadcrumbs `size` instead since a fixed-size separator next
 * to a resizing link looks off in a compact RN layout — a deliberate, documented deviation. */
export const breadcrumbsChevronSize: Record<'M' | 'L', number> = {
  M: 10,
  L: 12
};

/**
 * Tabs' per-density tab height and horizontal gap between tabs, from `tab`'s `height`
 * (`packages/@react-spectrum/s2/src/Tabs.tsx` lines ~422-431) and `tablist`'s `gap` (lines ~243-262,
 * horizontal + `labelBehavior: 'show'` case only — this port always shows labels).
 */
export const tabHeight: Record<'compact' | 'regular', number> = {
  compact: 32,
  regular: 48
};

export const tabGap: Record<'compact' | 'regular', number> = {
  compact: 24,
  regular: 32
};

/** Tabs' selected-indicator underline thickness, from `selectedIndicator`'s `height` for horizontal
 * orientation (`Tabs.tsx` line ~363: `[2px]`). */
export const tabIndicatorThickness = 2;

/**
 * Accordion/Disclosure header font size per size, from `buttonStyles`' `fontSize`
 * (`packages/@react-spectrum/s2/src/Disclosure.tsx` lines ~180-187: `title-sm`/`title`/`title-lg`/
 * `title-xl`). Unlike `headingFontSize`/`bodyFontSize`/`detailFontSize` above, the `title-*` tokens
 * this maps to are genuinely NOT resolvable the same way — they don't exist in
 * `@adobe/spectrum-tokens@14.15.0`'s published `src/typography.json` (only `heading-*`, `body-*`,
 * `detail-*`, `code-*` are there; `title-*` appears to be an S2-internal set not in the public
 * token package). As a documented approximation, this reuses the port's existing `fontSize`
 * ui-scale (`ui-sm`/`ui`/`ui-lg`/`ui-xl` = 12/14/16/18) instead, which is the same scale Spectrum
 * uses for other bold, compact-ish UI text and reads close in practice to what `title` actually is.
 */
export const accordionHeaderFontSize: Record<ControlSize, number> = {
  S: fontSize['ui-sm'],
  M: fontSize.ui,
  L: fontSize['ui-lg'],
  XL: fontSize['ui-xl']
};

// -----------------------------------------------------------------------------------------------
// Color-picking family sizing (ColorSwatch / ColorSlider / ColorArea / ColorWheel / ColorField /
// ColorPicker)
// -----------------------------------------------------------------------------------------------

/**
 * ColorSwatch's per-size diameter, from the `size` style map in
 * `packages/@react-spectrum/s2/src/ColorSwatch.tsx` (lines ~97-104). Unlike most of this port's
 * XS/S/M/L/XL-ish scales, the real ColorSwatch only goes up to 'L' (no 'XL').
 */
export const colorSwatchSize: Record<'XS' | 'S' | 'M' | 'L', number> = {
  XS: 16,
  S: 24,
  M: 32,
  L: 40
};

/**
 * The shared draggable-thumb diameter for ColorSlider/ColorArea/ColorWheel, from `HANDLE_SIZE` in
 * `packages/@react-spectrum/s2/src/ColorHandle.tsx` (line ~21) — the one thumb component all
 * three of those real S2 components render via `<ColorHandle>`. A single fixed size (no
 * S/M/L/XL scale — the real `ColorHandle` only varies by focus state, not a `size` prop).
 */
export const colorHandleSize = 16;

/**
 * ColorSlider's fixed horizontal track width/height, from the `width`/`height` style map in
 * `packages/@react-spectrum/s2/src/ColorSlider.tsx` (lines ~76-90, `orientation: 'horizontal'`
 * case only — this port doesn't implement the vertical orientation).
 */
export const colorSliderTrackWidth = 192;
export const colorSliderTrackHeight = 24;

/** ColorArea's default (square) size, from `size: 192` in
 * `packages/@react-spectrum/s2/src/ColorArea.tsx` (line ~67). */
export const colorAreaSize = 192;

/** ColorWheel's default overall diameter and ring thickness, from `size = 192`/`thickness = 24`
 * in `packages/@react-spectrum/s2/src/ColorWheel.tsx` (lines ~61-64). */
export const colorWheelSize = 192;
export const colorWheelThickness = 24;
