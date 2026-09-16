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
import {ColorSchemeName, Pressable, StyleSheet, Text, useColorScheme, View} from 'react-native';
import Svg, {Line, Rect} from 'react-native-svg';
import {
  borderWidth,
  checkboxBoxRadius,
  controlFontSize,
  controlHeight,
  ControlSize,
  getColor,
  semanticColors,
  spacing,
  textFieldRadius
} from '../theme/tokens';
import {Calendar} from './Calendar';
import {Dialog} from './Dialog';

export type DatePickerSize = ControlSize;

// The trailing calendar-icon button's per-size square dimensions, from `inputButton`'s `width`
// branch in `packages/@react-spectrum/s2/src/DatePicker.tsx` (lines ~110-117: 16/20/24/32 for
// S/M/L/XL — `height: 'auto'` + `aspectRatio: 'square'` makes it a square of that width). Its
// corner radius reuses `controlBorderRadius('sm')`, the same formula this port's `tokens.ts`
// already resolved once as `checkboxBoxRadius` (`inputButton`'s own `...controlBorderRadius('sm')`
// spread, line ~94).
const calendarButtonSize: Record<ControlSize, number> = {
  S: 16,
  M: 20,
  L: 24,
  XL: 32
};

/** Zero-padded `M/D/YYYY` formatting, deliberately not `Date.prototype.toLocaleDateString()` —
 * this port avoids relying on the host JS engine's `Intl`/locale data being present at all (Hermes
 * builds vary in `Intl` support), the same reasoning `Calendar.tsx` gives for hand-rolling its own
 * month/weekday names instead of `@internationalized/date`. Not locale-aware; always US-style
 * month/day/year order. */
function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export interface DatePickerProps {
  /** The label displayed above the field. */
  label?: string;
  /** The currently selected date (controlled), or `null`/`undefined` for no selection. */
  value?: Date | null;
  /** Called when the user selects a date from the calendar popover. */
  onChange?: (date: Date) => void;
  /** Placeholder text shown when no date is selected. */
  placeholder?: string;
  /** The earliest selectable date (inclusive). */
  minValue?: Date;
  /** The latest selectable date (inclusive). */
  maxValue?: Date;
  /**
   * The size of the DatePicker.
   * @default 'M'
   */
  size?: DatePickerSize;
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
 * A visual-only port of Spectrum 2's DatePicker for React Native: a `TextField`-like trigger
 * showing the selected date, which on press shows a `Calendar` inside the existing `Dialog`. Real
 * source: `packages/@react-spectrum/s2/src/DatePicker.tsx`, which combines a segmented, directly-
 * editable `DateField` (typeable month/day/year segments) with a `Calendar` inside an anchored
 * `Popover` (`CalendarPopover`, lines ~292-314). This port drops the segmented text-entry field
 * entirely (no `DateInput`/per-segment keyboard editing — RN has no equivalent to react-aria's
 * per-segment `ARIA` spinbutton widgets) in favor of a single `Pressable` that reads like
 * `TextField.tsx`'s field chrome (same border/background/per-size height+radius, lifted from the
 * same `FieldGroup` styles `TextField.tsx` itself cites) but opens the calendar on press instead of
 * accepting typed input — selecting a date in the popover both sets the value and closes the
 * popover in one tap, a deliberately simpler single-step interaction than the real component's
 * separate "open popover" / "commit date" / "close popover" steps.
 */
export function DatePicker(props: DatePickerProps): React.ReactElement {
  let {
    label,
    value,
    onChange,
    placeholder = 'Select a date',
    minValue,
    maxValue,
    size = 'M',
    isDisabled = false,
    isInvalid = false,
    errorMessage,
    description
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isOpen, setIsOpen] = useState(false);

  let height = controlHeight[size];
  let cornerRadius = textFieldRadius[size];
  let fontSize = controlFontSize[size];
  let iconButtonSize = calendarButtonSize[size];

  // borderColor/backgroundColor/text color: same `fieldGroupStyles` logic `TextField.tsx` and
  // `NumberField.tsx` already lift (`Field.tsx` lines ~208-236) — this port has no separate
  // "isFocusWithin" state for a `Pressable` trigger the way a real focusable text input would, so
  // only the default/invalid/disabled branches apply here.
  let fieldBorderColor: string;
  if (isDisabled) {
    fieldBorderColor = semanticColors.disabledBorder[mode];
  } else if (isInvalid) {
    fieldBorderColor = getColor('negative-900', mode);
  } else {
    fieldBorderColor = getColor('gray-300', mode);
  }
  let fieldBackgroundColor = getColor('gray-25', mode);
  let valueColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];
  let placeholderColor = getColor('gray-600', mode);
  let labelColor = semanticColors.neutralContent[mode];
  let helpColor = isInvalid ? getColor('negative-900', mode) : getColor('gray-600', mode);

  // inputButton's backgroundColor/color: `baseColor('gray-100')` fill, `isOpen` darkens to
  // `gray-200`, `baseColor('neutral')` (gray-800) icon color (`DatePicker.tsx` lines ~126-141).
  let iconButtonBackground = isDisabled
    ? semanticColors.disabledBackground[mode]
    : getColor(isOpen ? 'gray-200' : 'gray-100', mode);
  let iconColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];

  function handlePress() {
    if (!isDisabled) {
      setIsOpen(true);
    }
  }

  function handleSelect(date: Date) {
    onChange?.(date);
    setIsOpen(false);
  }

  return (
    <View style={styles.container}>
      {label != null && <Text style={[styles.label, {fontSize, color: labelColor}]}>{label}</Text>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{disabled: isDisabled, expanded: isOpen}}
        disabled={isDisabled}
        onPress={handlePress}
        style={({pressed}) => [
          styles.field,
          {
            height,
            borderRadius: cornerRadius,
            borderWidth: borderWidth[200],
            borderColor: fieldBorderColor,
            backgroundColor: fieldBackgroundColor,
            paddingStart: spacing[200],
            paddingEnd: spacing[75],
            opacity: pressed && !isDisabled ? 0.85 : 1
          }
        ]}>
        {value != null ? (
          <Text style={[styles.value, {fontSize, color: valueColor}]} numberOfLines={1}>
            {formatDate(value)}
          </Text>
        ) : (
          <Text style={[styles.value, {fontSize, color: placeholderColor}]} numberOfLines={1}>
            {placeholder}
          </Text>
        )}
        <View
          style={[
            styles.calendarGlyphButton,
            {width: iconButtonSize, height: iconButtonSize, borderRadius: checkboxBoxRadius[size], backgroundColor: iconButtonBackground}
          ]}>
          <CalendarGlyph size={Math.round(iconButtonSize * 0.6)} color={iconColor} />
        </View>
      </Pressable>
      {isInvalid && errorMessage != null ? (
        <Text style={[styles.helpText, {color: helpColor}]}>{errorMessage}</Text>
      ) : description != null ? (
        <Text style={[styles.helpText, {color: helpColor}]}>{description}</Text>
      ) : null}
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} isDismissible size="S">
        <Calendar value={value} onChange={handleSelect} minValue={minValue} maxValue={maxValue} />
      </Dialog>
    </View>
  );
}

/** A small hand-drawn calendar glyph (rounded rect "page" + a ring binding line), same
 * `react-native-svg`-glyph-instead-of-ported-icon-asset approach `Checkbox.tsx`/`Menu.tsx` use for
 * their own checkmark glyphs, standing in for the real `CalendarIcon` SVG import. */
function CalendarGlyph({size, color}: {size: number; color: string}): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Rect x="2" y="4" width="16" height="14" rx="2" stroke={color} strokeWidth={1.6} fill="none" />
      <Line x1="2" y1="8" x2="18" y2="8" stroke={color} strokeWidth={1.6} />
      <Line x1="6" y1="2" x2="6" y2="6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1="14" y1="2" x2="14" y2="6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
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
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  value: {
    flex: 1
  },
  calendarGlyphButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 8
  },
  helpText: {
    marginTop: spacing[75],
    fontSize: 12
  }
});
