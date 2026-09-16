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
import {ColorToken, fontSize, fontWeight, getColor, radius, spacing} from '../theme/tokens';

export type InlineAlertVariant = 'informative' | 'positive' | 'notice' | 'negative' | 'neutral';

export type InlineAlertFillStyle = 'border' | 'subtleFill' | 'boldFill';

export interface InlineAlertProps {
  /**
   * The semantic tone of the Inline Alert.
   * @default 'neutral'
   */
  variant?: InlineAlertVariant;
  /**
   * The visual style of the Inline Alert.
   * @default 'border'
   */
  fillStyle?: InlineAlertFillStyle;
  /** An optional heading, shown bold above `children`. */
  title?: ReactNode;
  /** The body content of the Inline Alert. Strings are wrapped in a `<Text>` automatically. */
  children?: ReactNode;
}

// Border color per variant — `inlineAlert`'s `borderColor.fillStyle.border` block in
// `packages/@react-spectrum/s2/src/InlineAlert.tsx` (lines ~70-84). Unlike most of this port's
// other status colors, these are *exact*: the real source reads each of these tokens directly
// (not through a `lightDark()` cross-mode composite), so no approximation is needed here.
const borderColor: Record<InlineAlertVariant, ColorToken> = {
  informative: 'informative-800',
  positive: 'positive-700',
  notice: 'notice-700',
  negative: 'negative-800',
  neutral: 'gray-700'
};

// backgroundColor per variant/fillStyle (`InlineAlert.tsx` lines ~85-123). `border` fillStyle is
// `gray-25` for every variant (exact). `subtleFill` reads `<variant>-subtle`, approximated here
// with that hue's own `-200` step (see the "Semantic status colors" note in tokens.ts) — except
// `neutral-subtle`, which really is `gray-100`, used exactly. `boldFill` reads the bare semantic
// name (a 900-light/800-dark composite for informative/positive/negative, 600-light/900-dark for
// notice), approximated uniformly with that hue's own `-900` step — except `neutral`'s `boldFill`,
// which really is `neutral-subdued`, used exactly (already resolved as its own composite in
// tokens.ts).
const subtleBackground: Record<InlineAlertVariant, ColorToken> = {
  informative: 'informative-200',
  positive: 'positive-200',
  notice: 'notice-200',
  negative: 'negative-200',
  neutral: 'gray-100'
};

const boldBackground: Record<InlineAlertVariant, ColorToken> = {
  informative: 'informative-900',
  positive: 'positive-900',
  notice: 'notice-900',
  negative: 'negative-900',
  neutral: 'neutral-subdued'
};

// `boldFill` text/icon color is white for every variant except `notice`, which is black
// (`InlineAlert.tsx` lines ~152-158, ~177-181, ~192-198) — same rule Badge's bold fillStyle uses.
const boldBlackTextVariants = new Set<InlineAlertVariant>(['notice']);

// A small text-glyph stand-in for the real per-variant SVG icons (`AlertTriangle`/
// `CheckmarkCircle`/`InfoCircle`/`AlertDiamond` from `s2wf-icons/`, `InlineAlert.tsx` lines ~13-25,
// ~163-169) — those icon assets aren't ported into this RN package, so this is a deliberate
// simplification rather than a value read out of the real source.
const variantGlyph: Record<InlineAlertVariant, string | null> = {
  informative: 'i',
  positive: '✓',
  notice: '!',
  negative: '⚠',
  neutral: null
};

/**
 * A visual-only port of Spectrum 2's InlineAlert for React Native: a bordered box with an optional
 * title and body, used for inline notices/warnings. Padding (24, `spacing[400]`), corner radius
 * (`radius.lg`, 10) and border width (2) come straight from the `inlineAlert` style
 * (`InlineAlert.tsx` lines ~60-69), all exact matches to tokens already defined elsewhere in this
 * port. See the color maps above for exactly which colors are exact vs. approximated.
 */
export function InlineAlert(props: InlineAlertProps): React.ReactElement {
  let {variant = 'neutral', fillStyle = 'border', title, children} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let background: string;
  let border: string;
  let textColor: string;
  if (fillStyle === 'boldFill') {
    background = getColor(boldBackground[variant], mode);
    border = 'transparent';
    textColor = getColor(boldBlackTextVariants.has(variant) ? 'gray-1000' : 'white', mode);
  } else if (fillStyle === 'subtleFill') {
    background = getColor(subtleBackground[variant], mode);
    border = 'transparent';
    textColor = getColor('gray-800', mode);
  } else {
    background = getColor('gray-25', mode);
    border = getColor(borderColor[variant], mode);
    textColor = getColor('gray-800', mode);
  }

  let glyph = variantGlyph[variant];
  // Real S2 floats the icon to the inline-end so body text wraps around it (`float: 'inline-end'`,
  // `InlineAlert.tsx` line ~129); RN has no float, so this port puts the icon in a row alongside a
  // text column instead — visually similar (icon top-aligned near the far edge) without needing
  // text-wrap-around-a-float, which RN doesn't support.
  let iconColor = fillStyle === 'border' ? border : textColor;

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.base,
        {
          padding: spacing[400],
          borderRadius: radius.lg,
          borderWidth: 2,
          borderColor: border,
          backgroundColor: background
        }
      ]}>
      <View style={styles.row}>
        <View style={styles.textColumn}>
          {title != null &&
            (typeof title === 'string' ? (
              <Text style={{fontSize: fontSize.ui, fontWeight: fontWeight.bold, color: textColor, marginBottom: 4}}>
                {title}
              </Text>
            ) : (
              title
            ))}
          {children != null &&
            (typeof children === 'string' ? (
              <Text style={{fontSize: fontSize.ui, fontWeight: fontWeight.normal, color: textColor}}>
                {children}
              </Text>
            ) : (
              children
            ))}
        </View>
        {glyph != null && <Text style={[styles.icon, {color: iconColor}]}>{glyph}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    maxWidth: '100%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  textColumn: {
    flexShrink: 1
  },
  icon: {
    marginStart: 12,
    fontSize: fontSize.ui,
    fontWeight: fontWeight.bold
  }
});
