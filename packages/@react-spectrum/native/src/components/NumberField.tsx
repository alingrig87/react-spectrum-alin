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

import React, {useEffect, useState} from 'react';
import {
  ColorSchemeName,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View
} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {
  borderWidth,
  checkboxBoxRadius,
  controlFontSize,
  controlHeight,
  ControlSize,
  crossIconSize,
  edgeToTextPaddingX,
  getColor,
  semanticColors,
  spacing,
  textFieldRadius
} from '../theme/tokens';

export type NumberFieldSize = ControlSize;

export interface NumberFieldProps {
  /** The label displayed above the field. */
  label?: string;
  /** The current numeric value (controlled). */
  value: number;
  /** Called when the value changes, either by typing or via the stepper buttons. */
  onChange?: (value: number) => void;
  /** The smallest value the user can enter. */
  minValue?: number;
  /** The largest value the user can enter. */
  maxValue?: number;
  /**
   * The amount the stepper buttons increment/decrement by.
   * @default 1
   */
  step?: number;
  /** Placeholder text shown when the field is empty. */
  placeholder?: string;
  /**
   * Whether to hide the increment/decrement stepper buttons.
   * @default false
   */
  hideStepper?: boolean;
  /**
   * The size of the NumberField.
   * @default 'M'
   */
  size?: NumberFieldSize;
  /** Whether the field is disabled. */
  isDisabled?: boolean;
  /** Whether the field is in an invalid/error state. */
  isInvalid?: boolean;
  /** An error message, displayed below the field when `isInvalid` is true. */
  errorMessage?: string;
  /** Help text displayed below the field when there is no error. */
  description?: string;
}

// Stepper button size per size, from `inputButton.width` in
// `packages/@react-spectrum/s2/src/NumberField.tsx` (lines ~102-109). Component-local (like
// Button.tsx's own per-variant color maps) since nothing else in this port needs it.
const stepperButtonSize: Record<ControlSize, number> = {
  S: 16,
  M: 20,
  L: 24,
  XL: 32
};

// Gap between the decrement/increment buttons, from `stepperContainerStyles.gap` (NumberField.tsx
// lines ~151-161) — note M is deliberately *smaller* (4px) than S/L/XL (8px) in the real values.
const stepperGap: Record<ControlSize, number> = {
  S: 8,
  M: 4,
  L: 8,
  XL: 8
};

// Stepper container's distance from the field's trailing edge, from
// `stepperContainerStyles.marginEnd` (NumberField.tsx lines ~162-169): `space(n)` -> px for S/M,
// `space(6)` (6px) for L/XL.
const stepperMarginEnd: Record<ControlSize, number> = {
  S: 2,
  M: 4,
  L: 6,
  XL: 6
};

/**
 * A visual-only port of Spectrum 2's NumberField for React Native
 * (`packages/@react-spectrum/s2/src/NumberField.tsx`). Reuses the same field "chrome" as
 * `TextField.tsx` (border/background/focus/per-size height+radius, lifted from `FieldGroup` in
 * `Field.tsx`), but with `keyboardType="numeric"` in place of a plain text keyboard and optional
 * +/-  stepper buttons (`inputButton`/`stepperContainerStyles`, lines ~92-170) drawn with
 * `react-native-svg` glyphs instead of the real component's `Dash`/`Add` icon imports. Uses a
 * plain `TextInput` + string<->number parsing instead of react-aria's `AriaNumberField`
 * locale-aware number parsing/formatting.
 */
export function NumberField(props: NumberFieldProps): React.ReactElement {
  let {
    label,
    value,
    onChange,
    minValue,
    maxValue,
    step = 1,
    placeholder,
    hideStepper = false,
    size = 'M',
    isDisabled = false,
    isInvalid = false,
    errorMessage,
    description
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isFocused, setIsFocused] = useState(false);
  // The text currently being edited. Kept separate from `value` so an in-progress entry like
  // "-" or "1." isn't clobbered by re-formatting on every keystroke.
  let [text, setText] = useState(() => String(value));

  // Keep the displayed text in sync with an externally-changed `value`, but not while the user is
  // actively typing (so a stray re-render mid-edit, e.g. "-" or "1.", doesn't get clobbered).
  useEffect(() => {
    if (!isFocused) {
      setText(String(value));
    }
  }, [value, isFocused]);

  let height = controlHeight[size];
  let cornerRadius = textFieldRadius[size];
  let fontSize = controlFontSize[size];
  let stepperSize = stepperButtonSize[size];
  let stepperRadius = checkboxBoxRadius[size]; // controlBorderRadius('sm') — same formula/values.
  let iconSize = crossIconSize[size];

  function clamp(n: number): number {
    let result = n;
    if (minValue != null) {
      result = Math.max(minValue, result);
    }
    if (maxValue != null) {
      result = Math.min(maxValue, result);
    }
    return result;
  }

  function commit(next: number) {
    let clamped = clamp(next);
    setText(String(clamped));
    onChange?.(clamped);
  }

  function handleChangeText(raw: string) {
    setText(raw);
    let parsed = Number(raw);
    if (raw.trim() !== '' && !Number.isNaN(parsed)) {
      onChange?.(clamp(parsed));
    }
  }

  function handleBlur() {
    setIsFocused(false);
    // Re-format to the committed numeric value once editing finishes.
    commit(Number.isNaN(Number(text)) || text.trim() === '' ? value : Number(text));
  }

  function handleStep(delta: number) {
    return (_event: GestureResponderEvent) => {
      if (isDisabled) {
        return;
      }
      commit(value + delta);
    };
  }

  // borderColor / backgroundColor / text color: identical logic to TextField.tsx (which lifts
  // these from `fieldGroupStyles` in Field.tsx, lines ~208-236).
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
  let stepperBg = isDisabled ? semanticColors.disabledBackground[mode] : getColor('gray-100', mode);
  let stepperColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];

  let canDecrement = !isDisabled && (minValue == null || value > minValue);
  let canIncrement = !isDisabled && (maxValue == null || value < maxValue);

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
            borderRadius: cornerRadius,
            borderWidth: borderWidth[200],
            borderColor,
            backgroundColor,
            // Real paddingStart is always 'edge-to-text'; paddingEnd is 0 when the stepper is
            // shown (the stepper group carries its own `stepperMarginEnd` instead) and
            // 'edge-to-text' when hidden (NumberField.tsx lines ~250-257).
            paddingStart: edgeToTextPaddingX[size],
            paddingEnd: hideStepper ? edgeToTextPaddingX[size] : 0
          }
        ]}>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          editable={!isDisabled}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={getColor('gray-600', mode)}
          style={[styles.input, {fontSize, color: textColor}]}
        />
        {!hideStepper && (
          <View style={[styles.stepperGroup, {gap: stepperGap[size], marginEnd: stepperMarginEnd[size]}]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Decrement"
              disabled={!canDecrement}
              onPress={handleStep(-step)}
              style={[
                styles.stepperButton,
                {
                  width: stepperSize,
                  height: stepperSize,
                  borderRadius: stepperRadius,
                  backgroundColor: stepperBg
                }
              ]}>
              <Svg width={iconSize} height={iconSize} viewBox="0 0 20 20">
                <Line x1="4" y1="10" x2="16" y2="10" stroke={stepperColor} strokeWidth={2.5} strokeLinecap="round" />
              </Svg>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Increment"
              disabled={!canIncrement}
              onPress={handleStep(step)}
              style={[
                styles.stepperButton,
                {
                  width: stepperSize,
                  height: stepperSize,
                  borderRadius: stepperRadius,
                  backgroundColor: stepperBg
                }
              ]}>
              <Svg width={iconSize} height={iconSize} viewBox="0 0 20 20">
                <Line x1="4" y1="10" x2="16" y2="10" stroke={stepperColor} strokeWidth={2.5} strokeLinecap="round" />
                <Line x1="10" y1="4" x2="10" y2="16" stroke={stepperColor} strokeWidth={2.5} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>
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
  input: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  stepperGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepperButton: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  helpText: {
    marginTop: spacing[75],
    fontSize: 12
  }
});
