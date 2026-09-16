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
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  useColorScheme,
  View
} from 'react-native';
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

export type TextFieldSize = ControlSize;

export interface TextFieldProps
  extends Pick<
    TextInputProps,
    'value' | 'placeholder' | 'onChangeText' | 'onFocus' | 'onBlur' | 'secureTextEntry' | 'keyboardType' | 'autoCapitalize' | 'multiline'
  > {
  /** The label displayed above the field. */
  label?: string;
  /**
   * The size of the text field.
   * @default 'M'
   */
  size?: TextFieldSize;
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
 * A visual-only port of Spectrum 2's TextField for React Native. The field "chrome" (border,
 * background, focus ring, per-size height/radius) is lifted from `FieldGroup` in
 * `packages/@react-spectrum/s2/src/Field.tsx` (`fieldGroupStyles`, lines ~201-241) — that's where
 * the real border/background/focus tokens live, not in `TextField.tsx` itself, which mostly wires
 * up react-aria's `AriaTextField`/`FieldGroup`/`Input` plumbing. Uses a plain `TextInput` +
 * `onChangeText` instead of react-aria's `Input`/form-state integration.
 */
export function TextField(props: TextFieldProps): React.ReactElement {
  let {label, size = 'M', isDisabled = false, isInvalid = false, errorMessage, description, ...inputProps} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isFocused, setIsFocused] = useState(false);

  let height = controlHeight[size];
  let cornerRadius = textFieldRadius[size];
  let fontSize = controlFontSize[size];

  // borderColor states lifted from `fieldGroupStyles.borderColor` in Field.tsx (lines ~208-224):
  // default gray-300, isFocusWithin gray-900 (negative-1000 if invalid), isDisabled -> disabled
  // border color (gray-300), invalid (not focused) -> negative-900.
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

  // backgroundColor: gray-25 always (Field.tsx line ~226). color (text): baseColor('neutral')
  // (gray-800), or the disabled content color when disabled (Field.tsx lines ~229-236).
  let backgroundColor = getColor('gray-25', mode);
  let textColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];
  let labelColor = semanticColors.neutralContent[mode];
  let helpColor = isInvalid ? getColor('negative-900', mode) : getColor('gray-600', mode);

  return (
    <View style={styles.container}>
      {label != null && (
        <Text style={[styles.label, {fontSize, color: labelColor}]}>{label}</Text>
      )}
      <View
        style={[
          styles.field,
          {
            height: inputProps.multiline ? undefined : height,
            minHeight: height,
            borderRadius: cornerRadius,
            borderWidth: borderWidth[200],
            borderColor,
            backgroundColor,
            paddingHorizontal: spacing[200]
          }
        ]}>
        <TextInput
          {...inputProps}
          editable={!isDisabled}
          onFocus={e => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
          placeholderTextColor={getColor('gray-600', mode)}
          style={[
            styles.input,
            {
              fontSize,
              color: textColor
            }
          ]}
        />
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
    justifyContent: 'center'
  },
  input: {
    padding: 0,
    margin: 0
  },
  helpText: {
    marginTop: spacing[75],
    fontSize: 12
  }
});
