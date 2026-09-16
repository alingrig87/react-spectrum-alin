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
import {ColorSchemeName, Text, useColorScheme, View} from 'react-native';
import {controlFontSize, ControlSize, getColor, semanticColors} from '../theme/tokens';

export type LabelSize = ControlSize;

export interface LabelProps {
  /** The label text. */
  children: ReactNode;
  /**
   * The size of the Label.
   * @default 'M'
   */
  size?: LabelSize;
  /** Whether the field this labels is required. Shows a trailing `*` when combined with the
   * default `necessityIndicator="icon"`. */
  isRequired?: boolean;
  /**
   * Whether to show a `*` glyph (`'icon'`) or a `(required)`/`(optional)` text suffix (`'label'`)
   * next to the label.
   * @default 'icon'
   */
  necessityIndicator?: 'icon' | 'label';
  /** Whether the labeled field is disabled. */
  isDisabled?: boolean;
}

/**
 * A visual-only port of Spectrum 2's field `Label` for React Native. Real source:
 * `packages/@react-spectrum/s2/src/Field.tsx`'s `FieldLabel` (lines ~63-190), specifically the
 * `fieldLabel()` style mixin it applies (`style-utils.ts` lines ~96-106: `font: controlFont()`,
 * `color: 'neutral-subdued'` at rest / `'disabled'` when the field is disabled) — this port reuses
 * the exact same `controlFontSize` scale Button/Badge/TextField already use, since `controlFont()`
 * is that same scale. The real component's necessity indicator is an `AsteriskIcon` SVG
 * (`Field.tsx` lines ~133-149, `currentColor` fill, i.e. the same color as the label text, NOT
 * red — Spectrum 2 doesn't use a red asterisk); this port approximates that glyph with a plain
 * `*` character in the same color instead of drawing the SVG, and keeps the real `necessityIndicator:
 * 'label'` text-suffix ("(required)"/"(optional)") behavior as a literal string rather than a
 * localized `stringFormatter` lookup (no i18n in this port).
 */
export function Label(props: LabelProps): React.ReactElement {
  let {children, size = 'M', isRequired = false, necessityIndicator = 'icon', isDisabled = false} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let fontSize = controlFontSize[size];
  let color = isDisabled ? semanticColors.disabledContent[mode] : getColor('neutral-subdued', mode);

  return (
    <View style={{flexDirection: 'row', alignItems: 'baseline', alignSelf: 'flex-start'}}>
      <Text style={{fontSize, color}}>{children}</Text>
      {isRequired && necessityIndicator === 'icon' && (
        <Text style={{fontSize, color, marginStart: 4}}>*</Text>
      )}
      {necessityIndicator === 'label' && (
        <Text style={{fontSize, color, marginStart: 4}}>
          {isRequired ? '(required)' : '(optional)'}
        </Text>
      )}
    </View>
  );
}
