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
import {View} from 'react-native';
import {ActionControlSize} from '../theme/tokens';
import {ToggleButton} from './ToggleButton';

export type ActionGroupSelectionMode = 'none' | 'single' | 'multiple';
export type ActionGroupOrientation = 'horizontal' | 'vertical';
export type ActionGroupDensity = 'compact' | 'regular';

export interface ActionGroupItem {
  /** A stable identifier for this item, used in `selectedKeys`/`onSelectionChange`. */
  key: string;
  /** The label to display on the item's button. */
  label: ReactNode;
  /** Whether this individual item is disabled. */
  isDisabled?: boolean;
}

export interface ActionGroupProps {
  /** The items to render as buttons, in order. */
  items: ActionGroupItem[];
  /**
   * Whether zero, one, or multiple items may be selected at once, like a segmented control
   * (`'single'`) or a set of independent toggles (`'multiple'`). `'none'` renders plain
   * (non-toggling) ActionButton-style items.
   * @default 'single'
   */
  selectionMode?: ActionGroupSelectionMode;
  /** The currently selected item keys (controlled). Ignored when `selectionMode` is `'none'`. */
  selectedKeys?: string[];
  /** Called with the new set of selected keys when the user presses an item. */
  onSelectionChange?: (keys: string[]) => void;
  /** Called when an item is pressed, regardless of `selectionMode`. */
  onAction?: (key: string) => void;
  /**
   * The size of the items in the group.
   * @default 'M'
   */
  size?: ActionControlSize;
  /**
   * The spacing between items — `'compact'` packs them with a 2px gap (edge-to-edge, as in a
   * segmented control); `'regular'` (the default) leaves Spectrum's normal per-size gap between
   * separate buttons.
   * @default 'regular'
   */
  density?: ActionGroupDensity;
  /**
   * The axis the group should lay its items out along.
   * @default 'horizontal'
   */
  orientation?: ActionGroupOrientation;
  /** Whether the buttons should be displayed with an emphasized (accent) selected style. */
  isEmphasized?: boolean;
  /** Whether the buttons should be displayed with a quiet style when unselected. */
  isQuiet?: boolean;
  /** Whether the whole group is disabled. */
  isDisabled?: boolean;
}

// Gap-per-size (regular density), lifted directly from `actionGroupStyle`'s `gap` map in
// `packages/@react-spectrum/s2/src/ActionButtonGroup.tsx` (lines ~64-89) — the same style object
// `ToggleButtonGroup` reuses for its own selection-capable version
// (`packages/@react-spectrum/s2/src/ToggleButtonGroup.tsx`), which is the real source this
// selection-aware `ActionGroup` most closely matches. Compact density collapses to a flat 2px gap
// at every size (segmented-control look); regular density's gap scales with the button size.
const regularGapForSize: Record<ActionControlSize, number> = {
  XS: 4,
  S: 4,
  M: 8,
  L: 8,
  XL: 8
};

const COMPACT_GAP = 2;

/**
 * A visual-only port of Spectrum 2's selection-capable action button group — like a segmented
 * control. There's no single S2 component with this exact shape: `ActionButtonGroup`
 * (`packages/@react-spectrum/s2/src/ActionButtonGroup.tsx`) has the right *layout* (gap-by-size/
 * density, orientation — see `regularGapForSize` above) but no selection state at all, while
 * `ToggleButtonGroup` (`packages/@react-spectrum/s2/src/ToggleButtonGroup.tsx`) reuses that same
 * layout and adds single/multiple selection via react-aria's `Selection` type. This component
 * combines the two for RN: `ActionButtonGroup`'s real gap values, plus a small, controlled
 * `selectedKeys: string[]` API in place of react-aria's `Selection`/`Key` machinery. Each item is
 * rendered with this port's own `ToggleButton` (or, when `selectionMode` is `'none'`, a plain
 * unselectable one) rather than a `Pressable` reimplementation, so its visual states stay in sync
 * with `ToggleButton.tsx`.
 */
export function ActionGroup(props: ActionGroupProps): React.ReactElement {
  let {
    items,
    selectionMode = 'single',
    selectedKeys = [],
    onSelectionChange,
    onAction,
    size = 'M',
    density = 'regular',
    orientation = 'horizontal',
    isEmphasized = false,
    isQuiet = false,
    isDisabled = false
  } = props;

  function toggle(key: string) {
    onAction?.(key);
    if (selectionMode === 'none') {
      return;
    }
    if (selectionMode === 'single') {
      // Pressing the already-selected item deselects it, matching react-aria's single-selection
      // toggle behavior for `ToggleButtonGroup`/`ListBox` when `disallowEmptySelection` is unset.
      onSelectionChange?.(selectedKeys.includes(key) ? [] : [key]);
    } else {
      onSelectionChange?.(
        selectedKeys.includes(key) ? selectedKeys.filter(k => k !== key) : [...selectedKeys, key]
      );
    }
  }

  let isVertical = orientation === 'vertical';
  let gap = density === 'compact' ? COMPACT_GAP : regularGapForSize[size];

  return (
    <View
      accessibilityRole={selectionMode === 'none' ? 'toolbar' : undefined}
      style={{
        flexDirection: isVertical ? 'column' : 'row',
        gap,
        alignSelf: 'flex-start'
      }}>
      {items.map(item => (
        <ToggleButton
          key={item.key}
          size={size}
          isQuiet={isQuiet}
          isEmphasized={isEmphasized}
          isSelected={selectionMode !== 'none' && selectedKeys.includes(item.key)}
          isDisabled={isDisabled || item.isDisabled}
          onChange={() => toggle(item.key)}>
          {item.label}
        </ToggleButton>
      ))}
    </View>
  );
}
