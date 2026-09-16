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

import React, {createContext, ReactNode, useContext} from 'react';
import {
  ColorSchemeName,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import {
  checkboxBoxSize,
  ControlSize,
  controlFontSize,
  getColor,
  semanticColors,
  spacing
} from '../theme/tokens';

export type RadioSize = ControlSize;

export interface RadioGroupProps {
  /** The Radios contained within the group. */
  children: ReactNode;
  /** The currently selected value (controlled). */
  value?: string | null;
  /** Called when the selected value changes. */
  onChange?: (value: string) => void;
  /** An optional label for the group. */
  label?: string;
  /**
   * The size of the Radios within the group.
   * @default 'M'
   */
  size?: RadioSize;
  /**
   * The axis the Radio elements should align with.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
  /** Whether the group should be displayed with an emphasized (accent) fill when selected. */
  isEmphasized?: boolean;
  /** Whether the whole group is disabled. */
  isDisabled?: boolean;
  /** Whether the group is in an invalid/error state. */
  isInvalid?: boolean;
}

interface RadioGroupContextValue {
  value?: string | null;
  onChange?: (value: string) => void;
  size: RadioSize;
  isEmphasized: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/**
 * A visual-only port of Spectrum 2's RadioGroup for React Native
 * (`packages/@react-spectrum/s2/src/RadioGroup.tsx`). The real component lays its children out
 * with react-aria's `AriaRadioGroup` (`display: flex`, `flexDirection` driven by `orientation`,
 * lines ~150-169) and shares `size`/`isEmphasized` down to each `Radio` via `FormContext`
 * (line ~170); here that's a plain React context instead, and selection is a simple controlled
 * `value`/`onChange` pair rather than react-aria's form-state integration.
 */
export function RadioGroup(props: RadioGroupProps): React.ReactElement {
  let {
    children,
    value,
    onChange,
    label,
    size = 'M',
    orientation = 'vertical',
    isEmphasized = false,
    isDisabled = false,
    isInvalid = false
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let fontSize = controlFontSize[size];
  let labelColor = semanticColors.neutralContent[mode];

  let contextValue: RadioGroupContextValue = {value, onChange, size, isEmphasized, isDisabled, isInvalid};

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <View accessibilityRole="radiogroup" style={styles.group}>
        {label != null && (
          <Text style={[styles.label, {fontSize, color: labelColor}]}>{label}</Text>
        )}
        <View
          style={[
            orientation === 'horizontal' ? styles.rowLayout : styles.columnLayout,
            // Real per-orientation gaps: 16px fixed column gap for horizontal (RadioGroup.tsx
            // line ~167), and a `calc(var(--field-height) - 1lh)` row gap for vertical (line
            // ~168) that depends on line-height, which RN doesn't expose the same way — we
            // approximate that with a flat spacing[200] (12px), matching how Checkbox.tsx
            // approximates its own text-gap constants.
            orientation === 'horizontal' ? {columnGap: spacing[300]} : {rowGap: spacing[200]}
          ]}>
          {children}
        </View>
      </View>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps {
  /** The value this Radio represents within its RadioGroup. */
  value: string;
  /** The label for the Radio. */
  children?: ReactNode;
  /** Whether this specific Radio is disabled (in addition to the group's `isDisabled`). */
  isDisabled?: boolean;
}

/**
 * A visual-only port of Spectrum 2's Radio for React Native, matching the real component's
 * unselected/selected circle per-size dimensions (`Radio.tsx`'s `circle` style, lines ~275-308).
 * Must be rendered inside a `RadioGroup`. Uses a plain `Pressable` + the group's `onChange`
 * callback instead of react-aria's `RadioButton`/keyboard/focus handling.
 */
export function Radio(props: RadioProps): React.ReactElement {
  let {value, children, isDisabled: ownDisabled = false} = props;
  let group = useContext(RadioGroupContext);
  if (!group) {
    throw new Error('Radio must be rendered inside a RadioGroup');
  }

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let {value: groupValue, onChange, size, isEmphasized, isDisabled: groupDisabled, isInvalid} = group;
  let isSelected = groupValue === value;
  let isDisabled = ownDisabled || groupDisabled;

  let boxSize = checkboxBoxSize[size];
  let fontSize = controlFontSize[size];

  function handlePress(_event: GestureResponderEvent) {
    if (isDisabled) {
      return;
    }
    onChange?.(value);
  }

  // borderColor states lifted from `circle.borderColor` in Radio.tsx (lines ~292-307): default
  // baseColor('gray-800'); selected -> baseColor('accent-900') if isEmphasized, else stays
  // gray-800; isInvalid -> baseColor('negative'); isDisabled -> gray-400. backgroundColor is a
  // constant 'gray-25' regardless of state (line ~291) — unlike Checkbox, Radio never fills its
  // background, it only thickens its border (see borderWidth below) to draw the selected dot.
  let borderColor: string;
  if (isDisabled) {
    borderColor = getColor('gray-400', mode);
  } else if (isInvalid) {
    borderColor = getColor('negative-900', mode);
  } else if (isSelected && isEmphasized) {
    borderColor = getColor('accent-900', mode);
  } else {
    borderColor = getColor('gray-800', mode);
  }

  // borderWidth states lifted from `circle.borderWidth` (lines ~286-289): default space(2) (2px);
  // isSelected -> `calc((self(height) - (4/16)*1rem) / 2)`, i.e. (boxSize - 4px) / 2. Since 1rem
  // is 16px, (4/16)*1rem = 4px. Making the border this thick relative to the circle's own
  // diameter is how Spectrum draws a "filled dot" using only a border (no separate inner element):
  // the gray-25 background peeks through only as a sliver in the very center.
  let borderWidth = isSelected ? (boxSize - 4) / 2 : 2;

  let labelColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{disabled: isDisabled, selected: isSelected}}
      disabled={isDisabled}
      onPress={handlePress}
      style={styles.row}>
      <View
        style={[
          styles.circle,
          {
            width: boxSize,
            height: boxSize,
            borderRadius: boxSize / 2,
            borderWidth,
            backgroundColor: getColor('gray-25', mode),
            borderColor
          }
        ]}
      />
      {children != null && (
        <Text style={{marginStart: 8, fontSize, color: labelColor}}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    alignSelf: 'flex-start'
  },
  label: {
    marginBottom: spacing[75],
    fontWeight: '500'
  },
  columnLayout: {
    flexDirection: 'column'
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
