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
import {ColorToken, controlFontSize, controlHeight, ControlSize, getColor, textFieldRadius} from '../theme/tokens';

/**
 * The full `BadgeStyleProps['variant']` union from `packages/@react-spectrum/s2/src/Badge.tsx`
 * (lines ~40-65): 6 semantic variants plus ~19 raw hue variants.
 */
export type BadgeVariant =
  | 'accent'
  | 'informative'
  | 'neutral'
  | 'positive'
  | 'notice'
  | 'negative'
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'chartreuse'
  | 'celery'
  | 'green'
  | 'seafoam'
  | 'cyan'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'fuchsia'
  | 'magenta'
  | 'pink'
  | 'turquoise'
  | 'brown'
  | 'cinnamon'
  | 'silver';

export type BadgeSize = ControlSize;

export type BadgeFillStyle = 'bold' | 'subtle' | 'outline';

export interface BadgeProps {
  /** The content to display in the badge. Strings are wrapped in a `<Text>` automatically. */
  children: ReactNode;
  /**
   * The variant changes the background color of the badge.
   * @default 'neutral'
   */
  variant?: BadgeVariant;
  /**
   * The fill of the badge.
   * @default 'bold'
   */
  fillStyle?: BadgeFillStyle;
  /**
   * The size of the badge.
   * @default 'S'
   */
  size?: BadgeSize;
}

// Real Badge (`Badge.tsx` lines ~99-109) uses BLACK text for these 5 "bold" variants (their real
// backgrounds are a light/bright step of the hue, e.g. `yellow-visual-color` -> `yellow-600`) and
// WHITE text for every other variant (whose real backgrounds are a dark/saturated step). We don't
// carry every hue's individually-tuned "-visual-color" step (it varies token-by-token: 600, 700 or
// 800 depending on the hue), so as a documented simplification we approximate it with the two
// steps we do have everywhere else in this file: these 5 use their `-300` (light, subtle-adjacent)
// step for the background, everything else uses `-900`. This keeps the same light-bg/dark-text vs.
// dark-bg/light-text split real Spectrum uses, without hand-tuning 19 extra raw-hue "visual" steps.
const boldBlackTextVariants = new Set<BadgeVariant>(['notice', 'orange', 'yellow', 'chartreuse', 'celery']);

const boldBackground: Record<BadgeVariant, ColorToken> = {
  accent: 'accent-900', // accent-background-color-default (approximated as a same-token light/dark pair — see tokens.ts header)
  informative: 'informative-900',
  neutral: 'neutral-subdued', // exact: Badge.tsx's neutral bold variant literally reads 'neutral-subdued'
  positive: 'positive-900',
  notice: 'notice-300', // approximation, see boldBlackTextVariants comment above
  negative: 'negative-900',
  gray: 'gray-900',
  red: 'red-900',
  orange: 'orange-300', // approximation
  yellow: 'yellow-300', // approximation
  chartreuse: 'chartreuse-300', // approximation
  celery: 'celery-300', // approximation
  green: 'green-900',
  seafoam: 'seafoam-900',
  cyan: 'cyan-900',
  blue: 'blue-900',
  indigo: 'indigo-900',
  purple: 'purple-900',
  fuchsia: 'fuchsia-900',
  magenta: 'magenta-900',
  pink: 'pink-900',
  turquoise: 'turquoise-900',
  brown: 'brown-900',
  cinnamon: 'cinnamon-900',
  silver: 'silver-900'
};

// Real Badge's `subtle` fillStyle backgroundColor block (lines ~142-170) reads `<variant>-subtle`
// for every variant, which resolves to a 200(light)/300(dark) composite; we use each hue's plain
// `-200` step directly (its own light *and* dark half) instead of replicating that cross-mode
// composite — see the "Semantic status colors" comment block in tokens.ts.
const subtleBackground: Record<BadgeVariant, ColorToken> = {
  accent: 'accent-200',
  informative: 'informative-200',
  neutral: 'gray-100', // exact: neutral-subtle-background-color-default -> {gray-100}/{gray-300}, we use gray-100 as a self-pair
  positive: 'positive-200',
  notice: 'notice-200',
  negative: 'negative-200',
  gray: 'gray-200',
  red: 'red-200',
  orange: 'orange-200',
  yellow: 'yellow-200',
  chartreuse: 'chartreuse-200',
  celery: 'celery-200',
  green: 'green-200',
  seafoam: 'seafoam-200',
  cyan: 'cyan-200',
  blue: 'blue-200',
  indigo: 'indigo-200',
  purple: 'purple-200',
  fuchsia: 'fuchsia-200',
  magenta: 'magenta-200',
  pink: 'pink-200',
  turquoise: 'turquoise-200',
  brown: 'brown-200',
  cinnamon: 'cinnamon-200',
  silver: 'silver-200'
};

// Real Badge's `outline` borderColor block (lines ~176-190) is only defined for the 6 semantic
// variants (lightDark('<hue>-800', '<hue>-900')); we approximate with that hue's own `-900` pair
// and extend the same pattern to the ~19 raw-hue variants the real source leaves undefined in
// outline mode, so every variant still renders a visible, on-brand border.
const outlineBorder: Record<BadgeVariant, ColorToken> = {
  accent: 'accent-900',
  informative: 'informative-900',
  neutral: 'gray-600', // approximates lightDark('gray-500', 'gray-600')
  positive: 'positive-900',
  notice: 'notice-900',
  negative: 'negative-900',
  gray: 'gray-600',
  red: 'red-900',
  orange: 'orange-900',
  yellow: 'yellow-900',
  chartreuse: 'chartreuse-900',
  celery: 'celery-900',
  green: 'green-900',
  seafoam: 'seafoam-900',
  cyan: 'cyan-900',
  blue: 'blue-900',
  indigo: 'indigo-900',
  purple: 'purple-900',
  fuchsia: 'fuchsia-900',
  magenta: 'magenta-900',
  pink: 'pink-900',
  turquoise: 'turquoise-900',
  brown: 'brown-900',
  cinnamon: 'cinnamon-900',
  silver: 'silver-900'
};

/**
 * A visual-only port of Spectrum 2's Badge for React Native. Sizing comes straight from the real
 * component's shared `control({shape: 'default', wrap: true, icon: true})` mixin
 * (`packages/@react-spectrum/s2/src/style-utils.ts` lines ~291-344): height and corner radius are
 * the exact same `controlHeight`/`textFieldRadius` scales Button/TextField already use in this
 * port (S2's `control()` literally calls the same `controlSize()`/`controlBorderRadius('default')`
 * helpers Button and TextField do), and horizontal padding is `'edge-to-text'`
 * (`spectrum-theme.ts` line ~436: `height * 3 / 8`). See the color maps above for how each
 * variant/fillStyle combination's real color was resolved (and where this port simplifies it).
 */
export function Badge(props: BadgeProps): React.ReactElement {
  let {children, variant = 'neutral', fillStyle = 'bold', size = 'S'} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let height = controlHeight[size];
  let paddingX = Math.round((height * 3) / 8);
  let radius = textFieldRadius[size];
  let fontSize = controlFontSize[size];

  let backgroundColor: string;
  let textColor: string;
  let borderWidth = 0;
  let borderColor = 'transparent';

  if (fillStyle === 'bold') {
    backgroundColor = getColor(boldBackground[variant], mode);
    textColor = getColor(boldBlackTextVariants.has(variant) ? 'gray-1000' : 'white', mode);
  } else if (fillStyle === 'subtle') {
    backgroundColor = getColor(subtleBackground[variant], mode);
    textColor = getColor('gray-1000', mode);
  } else {
    backgroundColor = 'transparent';
    textColor = getColor('gray-1000', mode);
    borderWidth = 2; // borderWidth: 2 in Badge.tsx's `badge` style, line ~175
    borderColor = getColor(outlineBorder[variant], mode);
  }

  return (
    <View
      style={[
        styles.base,
        {
          height,
          borderRadius: radius,
          paddingHorizontal: paddingX,
          backgroundColor,
          borderWidth,
          borderColor
        }
      ]}>
      {typeof children === 'string' ? (
        <Text style={{color: textColor, fontSize}} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start'
  }
});
