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
import {
  ColorSchemeName,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Svg, {Line, Path} from 'react-native-svg';
import {
  checkboxBoxRadius,
  checkboxBoxSize,
  checkboxIconSize,
  ControlSize,
  controlFontSize,
  getColor,
  semanticColors
} from '../theme/tokens';

export type CheckboxSize = ControlSize;

export interface CheckboxProps {
  /** The label for the checkbox. */
  children?: ReactNode;
  /** Whether the checkbox is checked (controlled). */
  isSelected?: boolean;
  /** Whether the checkbox is in the indeterminate visual state. Takes precedence over `isSelected`. */
  isIndeterminate?: boolean;
  /**
   * The size of the Checkbox.
   * @default 'M'
   */
  size?: CheckboxSize;
  /** Whether the Checkbox should be displayed with an emphasized (accent) fill when selected. */
  isEmphasized?: boolean;
  /** Whether the checkbox is disabled. */
  isDisabled?: boolean;
  /** Whether the checkbox is in an invalid/error state. */
  isInvalid?: boolean;
  /** Called when the user toggles the checkbox. */
  onChange?: (isSelected: boolean) => void;
}

/**
 * A visual-only port of Spectrum 2's Checkbox for React Native, matching the real component's
 * checked/unchecked/indeterminate states and per-size box dimensions
 * (`packages/@react-spectrum/s2/src/Checkbox.tsx`'s `box` style, lines ~139-182). Uses
 * `react-native-svg` for the checkmark/dash glyph in place of the real component's
 * `CheckmarkIcon`/`DashIcon` SVG imports, and a plain `Pressable` + `onChange` callback instead of
 * react-aria's `CheckboxButton`/keyboard/focus handling.
 */
export function Checkbox(props: CheckboxProps): React.ReactElement {
  let {
    children,
    isSelected = false,
    isIndeterminate = false,
    size = 'M',
    isEmphasized = false,
    isDisabled = false,
    isInvalid = false,
    onChange
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let boxSize = checkboxBoxSize[size];
  let boxRadius = checkboxBoxRadius[size];
  let iconSize = checkboxIconSize[size];
  let fontSize = controlFontSize[size];
  let checked = isSelected || isIndeterminate;

  function handlePress(_event: GestureResponderEvent) {
    if (isDisabled) {
      return;
    }
    onChange?.(!isSelected);
  }

  // backgroundColor / borderColor lifted from `box` in Checkbox.tsx (lines ~152-182):
  // unselected -> bg gray-25, border gray-800 (baseColor('neutral')); selected -> bg/border
  // baseColor('neutral') (gray-800), or accent-900 when isEmphasized; invalid swaps to
  // negative-900; disabled swaps bg to gray-400 (selected) and border to gray-400.
  let backgroundColor: string;
  let borderColor: string;
  if (isDisabled) {
    backgroundColor = checked ? getColor('gray-400', mode) : getColor('gray-25', mode);
    borderColor = getColor('gray-400', mode);
  } else if (checked) {
    if (isInvalid) {
      backgroundColor = getColor('negative-900', mode);
    } else if (isEmphasized) {
      backgroundColor = getColor('accent-900', mode);
    } else {
      backgroundColor = getColor('gray-800', mode);
    }
    borderColor = 'transparent';
  } else {
    backgroundColor = getColor('gray-25', mode);
    borderColor = isInvalid ? getColor('negative-900', mode) : getColor('gray-800', mode);
  }

  let iconColor = getColor('gray-25', mode);
  let labelColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{disabled: isDisabled, checked: isIndeterminate ? 'mixed' : isSelected}}
      disabled={isDisabled}
      onPress={handlePress}
      style={styles.row}>
      <View
        style={[
          styles.box,
          {
            width: boxSize,
            height: boxSize,
            borderRadius: boxRadius,
            borderWidth: 2, // space(2) in `box` style, Checkbox.tsx line ~147
            backgroundColor,
            borderColor
          }
        ]}>
        {isIndeterminate ? (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 20 20">
            <Line x1="4" y1="10" x2="16" y2="10" stroke={iconColor} strokeWidth={2.5} strokeLinecap="round" />
          </Svg>
        ) : isSelected ? (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 20 20">
            <Path
              d="M4 10.5L8 14.5L16 5.5"
              stroke={iconColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        ) : null}
      </View>
      {children != null && (
        <Text style={{marginStart: 8, fontSize, color: labelColor}}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
