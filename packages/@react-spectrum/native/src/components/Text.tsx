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
import {ColorSchemeName, Text as RNText, TextProps as RNTextProps, useColorScheme} from 'react-native';
import {
  bodyFontSize,
  bodyFontWeight,
  ControlSize,
  detailFontSize,
  detailFontWeight,
  getColor,
  headingFontSize,
  headingFontWeight
} from '../theme/tokens';

/**
 * Real source: `packages/@react-spectrum/s2/src/Content.tsx` doesn't itself carry any type-scale
 * styling for `Text` (it just forwards `styles`/`className` from the `style()` macro at each call
 * site — see e.g. `Dialog.tsx`'s `font: 'body'` / `ContextualHelp.tsx`'s `font: 'body-sm'`), so the
 * `variant`/`size` -> px/weight/color mapping here is assembled from the same `body-*`/`detail-*`
 * `fontSize` scale entries `packages/@react-spectrum/s2/style/spectrum-theme.ts` (lines ~664-676)
 * reads, plus `body-color`/`detail-color` (`{gray-800}`/`{gray-600}`, already-verified tokens in
 * this port's `tokens.ts`). Only S/M/L/XL sizes are exposed (not the real scale's XS/2XL/3XL steps)
 * to stay consistent with the rest of this port's `ControlSize`-keyed components.
 */
export type TextVariant = 'body' | 'detail';
export type TextSize = ControlSize;

export interface TextProps extends Pick<RNTextProps, 'numberOfLines' | 'accessibilityLabel'> {
  /** The text content. */
  children: ReactNode;
  /**
   * `'body'` is Spectrum's default running/paragraph text; `'detail'` is smaller, medium-weight
   * text used for secondary/supporting content (e.g. metadata, captions).
   * @default 'body'
   */
  variant?: TextVariant;
  /**
   * The type-scale size.
   * @default 'M'
   */
  size?: TextSize;
}

/**
 * A visual-only port of Spectrum 2's `Text` (from `Content.tsx`) for React Native. See the
 * module-level comment above for how `variant`/`size` were resolved to concrete px/weight/color.
 */
export function Text(props: TextProps): React.ReactElement {
  let {children, variant = 'body', size = 'M', numberOfLines, accessibilityLabel} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let fontSize = variant === 'detail' ? detailFontSize[size] : bodyFontSize[size];
  let fontWeight = variant === 'detail' ? detailFontWeight : bodyFontWeight;
  let color = getColor(variant === 'detail' ? 'gray-600' : 'gray-800', mode);

  return (
    <RNText
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      style={{fontSize, fontWeight, color}}>
      {children}
    </RNText>
  );
}

export type HeadingSize = ControlSize;

export interface HeadingProps extends Pick<RNTextProps, 'numberOfLines' | 'accessibilityLabel'> {
  /** The heading content. */
  children: ReactNode;
  /**
   * The type-scale size.
   * @default 'M'
   */
  size?: HeadingSize;
}

/**
 * A visual-only port of Spectrum 2's `Heading` (from `Content.tsx`) for React Native. The real
 * `Heading` is a semantic-only wrapper (it renders an `<h1>`-`<h6>` via RAC's `Heading` based on a
 * `level` prop and otherwise carries no styles of its own — callers apply `font: 'heading-*'` via
 * `styles`, same as `Text` above). RN has no heading-level DOM semantics, so this port drops
 * `level` entirely and just renders bold text at the `heading` type-scale size
 * (`headingFontSize`/`headingFontWeight` in `tokens.ts`, sourced from `heading-size-*` /
 * `heading-sans-serif-font-weight` in `@adobe/spectrum-tokens`) with `heading-color` (`gray-900`).
 */
export function Heading(props: HeadingProps): React.ReactElement {
  let {children, size = 'M', numberOfLines, accessibilityLabel} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let fontSize = headingFontSize[size];
  let color = getColor('gray-900', mode);

  return (
    <RNText
      accessibilityRole="header"
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      style={{fontSize, fontWeight: headingFontWeight, color}}>
      {children}
    </RNText>
  );
}
