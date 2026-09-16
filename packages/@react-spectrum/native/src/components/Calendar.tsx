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
import {ColorSchemeName, Pressable, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {getColor, semanticColors} from '../theme/tokens';

// The day cell's content size ("--cell-max-width") and the title/nav header's row gap, from
// `calendarStyles`/`headerStyles` in `packages/@react-spectrum/s2/src/Calendar.tsx` (lines ~94-136:
// `--cell-max-width: 32`, `headerStyles.columnGap: 24`). The real grid also reserves a 4px
// horizontal / 2px vertical gap *around* each cell via padding (`--cell-gap`, `cellStyles`, lines
// ~104-107, ~170-199), which combined with the cell's own content-box sizing produces a specific
// fixed per-cell footprint and an overall grid `width: calc(7 * 32px + 4px * 12)` (272px). This
// port instead lays each week out as 7 equal `flex: 1` columns (each just centering a fixed 32px
// circle) rather than replicating that exact px-gap arithmetic, so the calendar naturally adapts to
// whatever width its parent gives it — a deliberate, documented deviation from the real fixed-width
// CSS grid, in the same spirit as `Table.tsx`'s own flex-based column sizing.
const cellSize = 32;
const headerGap = 24;

export interface CalendarProps {
  /** The currently selected date (controlled), or `null`/`undefined` for no selection. */
  value?: Date | null;
  /** Called when the user selects a date. */
  onChange?: (date: Date) => void;
  /** The earliest selectable date (inclusive). Earlier dates are shown disabled. */
  minValue?: Date;
  /** The latest selectable date (inclusive). Later dates are shown disabled. */
  maxValue?: Date;
  /** Whether the whole calendar is disabled. */
  isDisabled?: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Hardcoded English, Sunday-first weekday abbreviations. Real S2 Calendar gets these from
// `@internationalized/date`'s locale-aware `getDayOfWeek`/`CalendarGridHeader` (which also lets
// `firstDayOfWeek` vary per-locale or via an explicit prop) — building that same locale machinery
// from scratch is explicitly out of scope per this component's task description ("don't try to
// port react-aria's `@internationalized/date` machinery"), so this port always starts the week on
// Sunday with fixed English labels, using plain JS `Date` arithmetic (`Date.prototype.getDay()`,
// which is itself 0=Sunday-indexed) for all of the month-grid math below.
const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface DayCellData {
  date: Date;
  isOutsideMonth: boolean;
}

function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (a == null || b == null) {
    return false;
  }
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Builds the 6-week (42-cell) grid for a given month, including the leading/trailing days from
 * the adjacent months needed to fill out complete weeks (Sunday-first). Plain Gregorian-calendar
 * `Date` arithmetic — see the `WEEKDAY_LABELS` comment above for why this doesn't use
 * `@internationalized/date`.
 */
function getMonthGrid(year: number, month: number): DayCellData[][] {
  let firstOfMonth = new Date(year, month, 1);
  let startWeekday = firstOfMonth.getDay();
  let daysInMonth = new Date(year, month + 1, 0).getDate();

  let cells: DayCellData[] = [];
  // Leading days from the previous month.
  for (let i = startWeekday; i > 0; i--) {
    cells.push({date: new Date(year, month, 1 - i), isOutsideMonth: true});
  }
  // This month's days.
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({date: new Date(year, month, d), isOutsideMonth: false});
  }
  // Trailing days to complete the final week.
  while (cells.length % 7 !== 0) {
    let last = cells[cells.length - 1].date;
    cells.push({date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), isOutsideMonth: true});
  }

  let weeks: DayCellData[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

/**
 * A visual-only port of Spectrum 2's Calendar for React Native: a month grid (day-of-week header +
 * weeks of day cells) with single-date selection, today/selected highlighting, and month
 * navigation. Real source: `packages/@react-spectrum/s2/src/Calendar.tsx` — a `react-aria-
 * components` `Calendar`/`CalendarGrid` built on `@internationalized/date` and `useCalendarState`,
 * supporting range selection, multiple visible months, and full keyboard navigation. This port only
 * implements single-date selection with one visible month, built from scratch with plain JS `Date`
 * math (see `getMonthGrid` above) rather than porting that state/date machinery, and uses
 * `Pressable` + `onPress` per cell instead of `useCalendarState`'s keyboard/focus handling.
 */
export function Calendar(props: CalendarProps): React.ReactElement {
  let {value, onChange, minValue, maxValue, isDisabled = false} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let initial = value ?? new Date();
  let [viewedYear, setViewedYear] = useState(initial.getFullYear());
  let [viewedMonth, setViewedMonth] = useState(initial.getMonth());

  // If the controlled `value` changes to a different month (e.g. set programmatically by the
  // parent), follow it. Purely-internal Prev/Next navigation doesn't touch `value`, so it isn't
  // fought by this effect. Same "sync from external value" spirit as `NumberField.tsx`'s own
  // `useEffect` re-syncing its displayed text from an externally-changed `value`.
  let valueTime = value != null ? startOfDay(value).getTime() : null;
  useEffect(() => {
    if (value != null) {
      setViewedYear(value.getFullYear());
      setViewedMonth(value.getMonth());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueTime]);

  let weeks = getMonthGrid(viewedYear, viewedMonth);
  let today = startOfDay(new Date());
  let min = minValue != null ? startOfDay(minValue) : null;
  let max = maxValue != null ? startOfDay(maxValue) : null;

  function goToPreviousMonth() {
    let d = new Date(viewedYear, viewedMonth - 1, 1);
    setViewedYear(d.getFullYear());
    setViewedMonth(d.getMonth());
  }

  function goToNextMonth() {
    let d = new Date(viewedYear, viewedMonth + 1, 1);
    setViewedYear(d.getFullYear());
    setViewedMonth(d.getMonth());
  }

  let navColor = semanticColors.neutralContent[mode];
  let headerCellColor = getColor('gray-600', mode); // title-sm header cell, approximated as a muted neutral.
  let titleColor = getColor('gray-900', mode);

  return (
    <View style={styles.root}>
      <View style={[styles.header, {gap: headerGap}]}>
        <NavButton direction="previous" color={navColor} onPress={goToPreviousMonth} isDisabled={isDisabled} />
        <Text style={[styles.title, {color: titleColor}]}>
          {MONTH_NAMES[viewedMonth]} {viewedYear}
        </Text>
        <NavButton direction="next" color={navColor} onPress={goToNextMonth} isDisabled={isDisabled} />
      </View>
      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map(label => (
          <View key={label} style={styles.dayColumn}>
            <Text style={[styles.headerCell, {color: headerCellColor}]}>{label}</Text>
          </View>
        ))}
      </View>
      {weeks.map((week, weekIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={weekIndex} style={styles.weekRow}>
          {week.map(cell => (
            <DayCell
              key={cell.date.toISOString()}
              cell={cell}
              isSelected={isSameDay(cell.date, value)}
              isToday={isSameDay(cell.date, today)}
              isDisabled={isDisabled || (min != null && cell.date < min) || (max != null && cell.date > max)}
              mode={mode}
              onPress={() => onChange?.(cell.date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function NavButton(props: {
  direction: 'previous' | 'next';
  color: string;
  isDisabled: boolean;
  onPress: () => void;
}): React.ReactElement {
  let {direction, color, isDisabled, onPress} = props;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={direction === 'previous' ? 'Previous month' : 'Next month'}
      disabled={isDisabled}
      onPress={onPress}
      style={({pressed}) => [styles.navButton, {opacity: isDisabled ? 0.4 : pressed ? 0.6 : 1}]}>
      <Text style={[styles.navGlyph, {color}]}>{direction === 'previous' ? '‹' : '›'}</Text>
    </Pressable>
  );
}

function DayCell(props: {
  cell: DayCellData;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  mode: 'light' | 'dark';
  onPress: () => void;
}): React.ReactElement {
  let {cell, isSelected, isToday, isDisabled, mode, onPress} = props;

  if (cell.isOutsideMonth) {
    // Real S2 hides outside-month cells entirely (`cellStyles.display: {isOutsideMonth: 'none'}`,
    // `Calendar.tsx` line ~192) rather than rendering a grayed-out date — this port matches that:
    // an empty placeholder keeps the 7-column grid aligned without showing a number.
    return <View style={styles.dayColumn} />;
  }

  // backgroundColor/color, lifted from `cellInnerStyles`' `default`/`isSelected` branches
  // (`Calendar.tsx` lines ~228-335, single-selection-mode case only — range selection is out of
  // scope): selected -> `accent-900`/`accent-700` (light/dark) fill with white text; otherwise
  // transparent fill with `baseColor('neutral')` (gray-800) text, dimmed to the disabled content
  // color when unavailable.
  let backgroundColor = isSelected ? getColor('accent-900', mode) : 'transparent';
  let textColor: string;
  if (isSelected) {
    textColor = getColor('white', mode);
  } else if (isDisabled) {
    textColor = getColor('gray-400', mode);
  } else {
    textColor = getColor('gray-800', mode);
  }
  // The "today" dot inherits the cell's own text color in the real source
  // (`todayStyles.backgroundColor: '[currentColor]'`, line ~345) — reused here directly.
  let dotColor = textColor;

  return (
    <View style={styles.dayColumn}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{selected: isSelected, disabled: isDisabled}}
        disabled={isDisabled}
        onPress={onPress}
        style={({pressed}) => [
          styles.dayCell,
          {
            backgroundColor,
            opacity: isDisabled ? 0.5 : pressed && !isSelected ? 0.7 : 1
          }
        ]}>
        <Text style={[styles.dayText, {color: textColor}]}>{cell.date.getDate()}</Text>
        {isToday && <View style={[styles.todayDot, {backgroundColor: dotColor}]} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'flex-start'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  navButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navGlyph: {
    fontSize: 20,
    fontWeight: '700'
  },
  title: {
    flex: 1,
    fontSize: 18, // approximated 'title-lg' — see the header comment on `cellSize`/`headerGap` above.
    fontWeight: '700',
    textAlign: 'center'
  },
  weekRow: {
    flexDirection: 'row'
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    paddingBottom: 12
  },
  dayCell: {
    width: cellSize,
    height: cellSize,
    borderRadius: cellSize / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayText: {
    fontSize: 14
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2
  }
});
