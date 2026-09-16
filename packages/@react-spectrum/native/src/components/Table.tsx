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

import React, {Fragment, ReactNode} from 'react';
import {ColorSchemeName, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {controlFontSize, fontWeight, getColor} from '../theme/tokens';

export type TableDensity = 'compact' | 'regular' | 'spacious';
export type TableColumnAlign = 'start' | 'center' | 'end';

// Table's outer border radius, from `table`'s `style()` call in
// `packages/@react-spectrum/s2/src/TableView.tsx` (line ~283: `borderRadius: '[6px]'`) — a raw
// pixel value outside this port's normal `radius` scale in tokens.ts, so it's a local constant
// here (same pattern as `Dialog.tsx`'s own local `dialogWidth`).
const tableBorderRadius = 6;

// Header row height ("component-height-100" for the 'medium' density scale) and per-density body
// row heights, from `DEFAULT_HEADER_HEIGHT`/`ROW_HEIGHTS` (`TableView.tsx` lines ~317-335). The
// real table auto-selects between a 'medium' (mouse) and 'large' (touch) scale; this port always
// uses the 'medium' numbers regardless of input method — RN has no way to distinguish pointer type
// the way the real DOM-based `useTableState` does, and 'medium' keeps rows closer to this port's
// other controls' `controlHeight` scale (e.g. a 'regular' density row is 40px, same as a size='M'
// `Button`/`TextField`).
const headerHeight = 32;
const rowHeights: Record<TableDensity, number> = {
  compact: 32,
  regular: 40,
  spacious: 48
};

// Cell horizontal padding ("table-edge-to-content"), from `commonCellStyles`/`columnStyles`
// (`TableView.tsx` lines ~719, ~1259: `paddingX: 16`).
const cellPaddingX = 16;

export interface TableColumn {
  /** A stable key identifying this column, used to look up each row's cell value. */
  key: string;
  /** The column header label. */
  title: ReactNode;
  /**
   * The alignment of the column's header and cell contents.
   * @default 'start'
   */
  align?: TableColumnAlign;
  /** A fixed column width in px. Columns without a `width` share the remaining space equally. */
  width?: number;
}

export interface TableRow {
  /** A stable key identifying this row. */
  key: string;
  /** Cell contents for this row, keyed by `TableColumn['key']`. */
  cells: Record<string, ReactNode>;
}

export interface TableProps {
  /** The table's columns. */
  columns: TableColumn[];
  /** The table's rows. */
  rows: TableRow[];
  /**
   * The amount of vertical padding within each row, which drives the row height.
   * @default 'regular'
   */
  density?: TableDensity;
}

function alignToFlex(align: TableColumnAlign): 'flex-start' | 'center' | 'flex-end' {
  if (align === 'center') {
    return 'center';
  }
  if (align === 'end') {
    return 'flex-end';
  }
  return 'flex-start';
}

/**
 * A visual-only port of Spectrum 2's Table for React Native: a header row of column labels above
 * body rows of cells, with basic per-column alignment and row dividers. Real source:
 * `packages/@react-spectrum/s2/src/TableView.tsx` (2300+ lines) — a `react-aria-components`
 * `GridList`-based grid with sorting, column resizing, drag-and-drop, tree/nested rows, and
 * virtualized scrolling via `TableLayout`. None of that collection/virtualization machinery is in
 * scope here; this port takes plain `columns`/`rows` data props and maps them directly to nested
 * `View`s (no `FlatList` — this port's other list-shaped components, e.g. `Menu.tsx`, also just map
 * `View`s rather than virtualizing, and a plain map keeps the API simple: wrap the whole `Table` in
 * your own `ScrollView` if a data set is long enough to need scrolling).
 */
export function Table(props: TableProps): React.ReactElement {
  let {columns, rows, density = 'regular'} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let borderColor = getColor('gray-300', mode);
  let backgroundColor = getColor('gray-25', mode);
  let headerTextColor = getColor('gray-800', mode); // baseColor('neutral'), columnStyles.color
  let cellTextColor = getColor('gray-800', mode);
  let fontSizePx = controlFontSize.M; // controlFont() with no size override -> the base 'ui' (14px) step.
  let rowHeight = rowHeights[density];

  function widthStyle(column: TableColumn) {
    return column.width != null ? {width: column.width} : {flex: 1};
  }

  return (
    <View style={[styles.table, {borderRadius: tableBorderRadius, borderColor, backgroundColor}]}>
      <View style={[styles.row, {height: headerHeight, borderBottomColor: borderColor}]}>
        {columns.map(column => (
          <View
            key={column.key}
            style={[
              styles.cell,
              widthStyle(column),
              {paddingHorizontal: cellPaddingX, justifyContent: alignToFlex(column.align ?? 'start')}
            ]}>
            {typeof column.title === 'string' ? (
              <Text
                style={{fontSize: fontSizePx, fontWeight: fontWeight.bold, color: headerTextColor}}
                numberOfLines={1}>
                {column.title}
              </Text>
            ) : (
              column.title
            )}
          </View>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <Fragment key={row.key}>
          <View
            style={[
              styles.row,
              {
                height: rowHeight,
                borderBottomColor: borderColor,
                borderBottomWidth: rowIndex === rows.length - 1 ? 0 : 1
              }
            ]}>
            {columns.map(column => {
              let cell = row.cells[column.key];
              return (
                <View
                  key={column.key}
                  style={[
                    styles.cell,
                    widthStyle(column),
                    {paddingHorizontal: cellPaddingX, justifyContent: alignToFlex(column.align ?? 'start')}
                  ]}>
                  {typeof cell === 'string' || typeof cell === 'number' ? (
                    <Text style={{fontSize: fontSizePx, color: cellTextColor}} numberOfLines={1}>
                      {cell}
                    </Text>
                  ) : (
                    cell
                  )}
                </View>
              );
            })}
          </View>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  cell: {
    justifyContent: 'center'
  }
});
