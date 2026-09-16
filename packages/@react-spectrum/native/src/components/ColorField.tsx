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

import {
  borderWidth,
  controlFontSize,
  controlHeight,
  ControlSize,
  getColor,
  semanticColors,
  spacing,
  textFieldRadius
} from '../theme/tokens';
import {ColorSchemeName, StyleSheet, Text, TextInput, useColorScheme, View} from 'react-native';
import {ColorSwatch} from './ColorSwatch';
import {parseColor} from '../utils/color';
import React, {useEffect, useState} from 'react';

export type ColorFieldSize = ControlSize;

export interface ColorFieldProps {
  /** The current color, as a `#RGB`/`#RRGGBB`/`#RRGGBBAA` hex string (controlled). */
  value: string;
  /** Called with the new hex string whenever the typed text parses as a valid color. */
  onChange?: (value: string) => void;
  /** The label displayed above the field. */
  label?: string;
  /**
   * The size of the color field.
   * @default 'M'
   */
  size?: ColorFieldSize;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Help text displayed below the field. */
  description?: string;
}

/**
 * A visual-only port of Spectrum 2's ColorField for React Native. Real source:
 * `packages/@react-spectrum/s2/src/ColorField.tsx`, which is mostly react-aria `AriaColorField`
 * plumbing wired to the same `field()`/`FieldGroup` chrome `TextField` uses (border/background/
 * focus-ring tokens, per-size height/radius) — reuses this RN port's `TextField.tsx` chrome
 * (`../theme/tokens.ts`'s `controlHeight`/`textFieldRadius`/`controlFontSize`) rather than
 * duplicating it, plus a small `ColorSwatch` preview as the `prefix` slot the real `ColorField`
 * supports (`ColorField.tsx` line ~131: `<FieldGroup prefix={props.prefix} .../>`).
 *
 * Text is edited freely (a plain `TextInput`/`onChangeText`, not react-aria's
 * `useColorField`/numeric-stepper-style parsing); `onChange` only fires once the typed text
 * parses as a valid hex color (via `../utils/color.ts`'s `parseColor`), and the field shows an
 * invalid border otherwise instead of clamping/rejecting keystrokes.
 */
export function ColorField(props: ColorFieldProps): React.ReactElement {
  let {value, onChange, label, size = 'M', isDisabled = false, description} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isFocused, setIsFocused] = useState(false);
  let [text, setText] = useState(value);

  // Keep the displayed text in sync with externally-driven `value` changes (e.g. a ColorSlider
  // elsewhere in a ColorPicker updating the same color), without clobbering in-progress typing.
  useEffect(() => {
    setText(value);
  }, [value]);

  let parsed = parseColor(text.startsWith('#') ? text : `#${text}`);
  let isInvalid = text.length > 0 && parsed === null;

  let height = controlHeight[size];
  let cornerRadius = textFieldRadius[size];
  let fontSize = controlFontSize[size];

  let borderColor: string;
  if (isDisabled) {
    borderColor = semanticColors.disabledBorder[mode];
  } else if (isFocused) {
    borderColor = isInvalid ? getColor('negative-1000', mode) : getColor('gray-900', mode);
  } else if (isInvalid) {
    borderColor = getColor('negative-900', mode);
  } else {
    borderColor = getColor('gray-300', mode);
  }

  let backgroundColor = getColor('gray-25', mode);
  let textColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];
  let labelColor = semanticColors.neutralContent[mode];
  let helpColor = isInvalid ? getColor('negative-900', mode) : getColor('gray-600', mode);

  function handleChangeText(next: string) {
    setText(next);
    let candidate = parseColor(next.startsWith('#') ? next : `#${next}`);
    if (candidate != null) {
      onChange?.(next.startsWith('#') ? next.toUpperCase() : `#${next}`.toUpperCase());
    }
  }

  return (
    <View style={styles.container}>
      {label != null && <Text style={[styles.label, {fontSize, color: labelColor}]}>{label}</Text>}
      <View
        style={[
          styles.field,
          {
            height,
            borderRadius: cornerRadius,
            borderWidth: borderWidth[200],
            borderColor,
            backgroundColor,
            paddingHorizontal: spacing[200]
          }
        ]}>
        <View style={styles.swatch}>
          <ColorSwatch color={parsed ? text : '#FFFFFF00'} size="S" />
        </View>
        <TextInput
          value={text}
          editable={!isDisabled}
          autoCapitalize="characters"
          autoCorrect={false}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="#RRGGBB"
          placeholderTextColor={getColor('gray-600', mode)}
          style={[styles.input, {fontSize, color: textColor}]}
        />
      </View>
      {description != null && !isInvalid ? (
        <Text style={[styles.helpText, {color: helpColor}]}>{description}</Text>
      ) : isInvalid ? (
        <Text style={[styles.helpText, {color: helpColor}]}>Enter a valid hex color.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  },
  label: {
    marginBottom: spacing[75],
    fontWeight: '500'
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  swatch: {
    marginEnd: spacing[100]
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  helpText: {
    marginTop: spacing[75],
    fontSize: 12
  }
});
