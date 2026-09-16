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

import React, {useState} from 'react';
import {
  ColorSchemeName,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View
} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';
import {
  borderWidth,
  buttonPaddingX,
  controlFontSize,
  controlHeight,
  ControlSize,
  crossIconSize,
  getColor,
  semanticColors,
  spacing
} from '../theme/tokens';

export type SearchFieldSize = ControlSize;

export interface SearchFieldProps {
  /** The label displayed above the field. */
  label?: string;
  /** The current search text (controlled). */
  value: string;
  /** Called as the user types. */
  onChangeText?: (value: string) => void;
  /** Called when the field is cleared, either via the (x) button or an empty submit. */
  onClear?: () => void;
  /** Placeholder text shown when the field is empty. */
  placeholder?: string;
  /**
   * The size of the SearchField.
   * @default 'M'
   */
  size?: SearchFieldSize;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is in an invalid/error state. */
  isInvalid?: boolean;
  /** An error message, displayed below the field when `isInvalid` is true. */
  errorMessage?: string;
  /** Help text displayed below the field when there is no error. */
  description?: string;
}

/**
 * A visual-only port of Spectrum 2's SearchField for React Native
 * (`packages/@react-spectrum/s2/src/SearchField.tsx`). Reuses the same field height/border/
 * background/font-size scale as `TextField.tsx` (both build on `FieldGroup` in `Field.tsx`), but
 * pill-shaped (`borderRadius: 'full'`, `paddingStart: 'pill'` — SearchField.tsx lines ~144-148,
 * `'pill'` = `height / 2`, reusing the `buttonPaddingX` token which is the same formula) with a
 * leading search-icon glyph and a trailing clear (x) button shown only when non-empty
 * (`!isEmpty`, line ~178). Icons are drawn with `react-native-svg` in place of the real
 * component's `SearchIcon`/`ClearButton`'s `CrossIcon` SVG imports.
 */
export function SearchField(props: SearchFieldProps): React.ReactElement {
  let {
    label,
    value,
    onChangeText,
    onClear,
    placeholder,
    size = 'M',
    isDisabled = false,
    isInvalid = false,
    errorMessage,
    description
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isFocused, setIsFocused] = useState(false);

  let height = controlHeight[size];
  let fontSize = controlFontSize[size];
  let iconSize = fontSize; // Real value is `1lh` (one line-height) — approximated as the font size.
  let clearIconSize = crossIconSize[size];
  let clearButtonSize = controlHeight[size]; // ClearButton.tsx: `width: controlSize()`, same md scale.

  function handleClear() {
    if (isDisabled) {
      return;
    }
    onChangeText?.('');
    onClear?.();
  }

  // borderColor / backgroundColor / text color: identical logic to TextField.tsx (which lifts
  // these from `fieldGroupStyles` in Field.tsx, lines ~208-236) — SearchField only overrides the
  // shape (pill) and padding, not the color logic.
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
  let iconColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];

  return (
    <View style={styles.container}>
      {label != null && (
        <Text style={[styles.label, {fontSize, color: labelColor}]}>{label}</Text>
      )}
      <View
        style={[
          styles.field,
          {
            height,
            borderRadius: height / 2, // borderRadius: 'full' (SearchField.tsx line ~145)
            borderWidth: borderWidth[200],
            borderColor,
            backgroundColor,
            paddingStart: buttonPaddingX[size], // paddingStart: 'pill' = height / 2
            paddingEnd: 0
          }
        ]}>
        <Svg width={iconSize} height={iconSize} viewBox="0 0 20 20" style={styles.searchIcon}>
          <Circle cx="8.5" cy="8.5" r="6" stroke={iconColor} strokeWidth={1.8} fill="none" />
          <Line x1="13" y1="13" x2="17.5" y2="17.5" stroke={iconColor} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!isDisabled}
          placeholder={placeholder}
          placeholderTextColor={getColor('gray-600', mode)}
          style={[styles.input, {fontSize, color: textColor}]}
        />
        {value.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            disabled={isDisabled}
            onPress={handleClear}
            style={[styles.clearButton, {width: clearButtonSize, height}]}>
            <Svg width={clearIconSize} height={clearIconSize} viewBox="0 0 20 20">
              <Line x1="4" y1="4" x2="16" y2="16" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
              <Line x1="16" y1="4" x2="4" y2="16" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </Pressable>
        )}
      </View>
      {isInvalid && errorMessage != null ? (
        <Text style={[styles.helpText, {color: helpColor}]}>{errorMessage}</Text>
      ) : description != null ? (
        <Text style={[styles.helpText, {color: helpColor}]}>{description}</Text>
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
  searchIcon: {
    marginEnd: spacing[75]
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  helpText: {
    marginTop: spacing[75],
    fontSize: 12
  }
});
