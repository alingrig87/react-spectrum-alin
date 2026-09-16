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
import {ButtonSize} from './Button';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';
export type ButtonGroupAlign = 'start' | 'end' | 'center';

export interface ButtonGroupProps {
  /** The Buttons/ActionButtons contained within the ButtonGroup. */
  children: ReactNode;
  /**
   * The axis the ButtonGroup should lay its children out along.
   * @default 'horizontal'
   */
  orientation?: ButtonGroupOrientation;
  /**
   * The alignment of the buttons within the ButtonGroup, along the cross axis.
   * @default 'start'
   */
  align?: ButtonGroupAlign;
  /**
   * The size of the Buttons within the ButtonGroup. Purely informational in this port (unlike the
   * real S2 component, this doesn't propagate a size down to child `Button`s via context — see the
   * note below) — kept so callers porting real S2 code have a matching prop to pass.
   */
  size?: ButtonSize;
}

// gap-per-size, lifted directly from the `buttongroup` style() call in
// `packages/@react-spectrum/s2/src/ButtonGroup.tsx` (lines ~64-108): 8px at 'S', 12px at 'M'/'L'/'XL'.
const gapForSize: Record<ButtonSize, number> = {
  S: 8,
  M: 12,
  L: 12,
  XL: 12
};

const alignToFlex: Record<ButtonGroupAlign, 'flex-start' | 'flex-end' | 'center'> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center'
};

/**
 * A visual-only port of Spectrum 2's ButtonGroup for React Native — lays out a row (or column) of
 * `Button`/`ActionButton`s with Spectrum's spacing between them. Ported from
 * `packages/@react-spectrum/s2/src/ButtonGroup.tsx`'s `buttongroup` style() object (lines ~64-108)
 * for the gap/alignment values. The real component's automatic horizontal-overflow-to-vertical
 * switching (`checkForOverflow`, lines ~131-158, driven by a DOM `ResizeObserver`) has no RN
 * equivalent and is intentionally dropped here — callers who want a vertical layout on narrow
 * screens should pass `orientation="vertical"` themselves. It also doesn't propagate `size`/
 * `isDisabled` down to its children via context the way the real component does (`ButtonContext`/
 * `LinkButtonContext`, lines ~181-204) — `Button.tsx` in this port has no context-based defaults
 * mechanism yet, so pass `size`/`isDisabled` to each child directly.
 */
export function ButtonGroup(props: ButtonGroupProps): React.ReactElement {
  let {children, orientation = 'horizontal', align = 'start', size = 'M'} = props;

  let isVertical = orientation === 'vertical';

  return (
    <View
      style={{
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: isVertical ? alignToFlex[align] : 'center',
        justifyContent: isVertical ? alignToFlex[align] : 'flex-start',
        gap: gapForSize[size],
        alignSelf: 'flex-start',
        maxWidth: '100%'
      }}>
      {children}
    </View>
  );
}
