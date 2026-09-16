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

import React, {ReactNode} from 'react';
import {ColorSchemeName, StyleSheet, Text, useColorScheme, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {ColorToken, controlFontSize, ControlSize, getColor, iconTextGap} from '../theme/tokens';

/**
 * The full `StatusLightStyleProps['variant']` union from
 * `packages/@react-spectrum/s2/src/StatusLight.tsx` (lines ~32-51): the 5 semantic variants plus
 * 14 "fun color" ones (note StatusLight, unlike Badge, does not expose plain `accent`/`gray`/`red`/
 * `orange`/`yellow`/`green`/`blue` — its extra set is exactly this list).
 */
export type StatusLightVariant =
  | 'informative'
  | 'neutral'
  | 'positive'
  | 'notice'
  | 'negative'
  | 'celery'
  | 'chartreuse'
  | 'cyan'
  | 'fuchsia'
  | 'purple'
  | 'magenta'
  | 'indigo'
  | 'seafoam'
  | 'yellow'
  | 'pink'
  | 'turquoise'
  | 'cinnamon'
  | 'brown'
  | 'silver';

export type StatusLightSize = ControlSize;

export interface StatusLightProps {
  /** The content to display as the label. */
  children?: ReactNode;
  /**
   * The variant changes the color of the status light.
   * @default 'neutral'
   */
  variant?: StatusLightVariant;
  /**
   * The size of the StatusLight.
   * @default 'M'
   */
  size?: StatusLightSize;
}

/** Dot diameter per size — `light`'s `size` style in `StatusLight.tsx` (lines ~95-103), exact. */
const dotSize: Record<StatusLightSize, number> = {
  S: 8,
  M: 10,
  L: 12,
  XL: 14
};

// Dot fill color per variant, from `light`'s `fill` style (`StatusLight.tsx` lines ~104-127). Each
// variant there reads a bare semantic/hue name (e.g. `positive`, `celery`) which resolves through
// `<hue>-visual-color` in `spectrum-theme.ts` — a per-hue-tuned light/dark step pair (not a
// consistent "always -900" rule; e.g. `yellow-visual-color` is 600(light)/1100(dark) while
// `blue-visual-color` is 800(light)/900(dark)). We approximate every variant uniformly with that
// hue's own `-900` step instead of chasing each hue's individually hand-tuned pair, since a dot
// this small reads fine at any step of a given hue's scale — this is the one deliberate
// simplification in this file, and it's applied identically to every variant below.
const dotFill: Record<StatusLightVariant, ColorToken> = {
  informative: 'informative-900',
  neutral: 'gray-600', // wrapper's own label-color default (`StatusLight.tsx` line ~87) reuses this same token for the dot
  positive: 'positive-900',
  notice: 'notice-900',
  negative: 'negative-900',
  celery: 'celery-900',
  chartreuse: 'chartreuse-900',
  cyan: 'cyan-900',
  fuchsia: 'fuchsia-900',
  purple: 'purple-900',
  magenta: 'magenta-900',
  indigo: 'indigo-900',
  seafoam: 'seafoam-900',
  yellow: 'yellow-900',
  pink: 'pink-900',
  turquoise: 'turquoise-900',
  cinnamon: 'cinnamon-900',
  brown: 'brown-900',
  silver: 'silver-900'
};

/**
 * A visual-only port of Spectrum 2's StatusLight for React Native: a small colored dot plus a text
 * label, used to indicate status. Uses `react-native-svg` for the dot (a plain filled circle, same
 * approach as Checkbox's checkmark) instead of the real component's inline `<svg><circle></svg>`.
 * The gap between dot and label reuses this port's existing `iconTextGap` token (the same
 * `'text-to-visual'` relative-spacing value StatusLight's own `wrapper` style pulls in via
 * `gap: 'text-to-visual'`, `StatusLight.tsx` line ~80) instead of duplicating it.
 */
export function StatusLight(props: StatusLightProps): React.ReactElement {
  let {children, variant = 'neutral', size = 'M'} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let diameter = dotSize[size];
  let fill = getColor(dotFill[variant], mode);
  let fontSize = controlFontSize[size];
  let labelColor = getColor('gray-800', mode); // neutral-content-color-default, wrapper's default text color

  return (
    <View style={styles.row}>
      <Svg width={diameter} height={diameter} viewBox="0 0 20 20">
        <Circle cx="10" cy="10" r="10" fill={fill} />
      </Svg>
      {children != null && (
        <Text style={{marginStart: iconTextGap[size], fontSize, color: labelColor}}>{children}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  }
});
