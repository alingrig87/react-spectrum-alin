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

import React from 'react';
import {ColorSchemeName, useColorScheme, View, ViewStyle} from 'react-native';
import {dividerThickness, getColor} from '../theme/tokens';

export type DividerSize = 'S' | 'M' | 'L';

export interface DividerProps {
  /**
   * How thick the Divider should be.
   * @default 'M'
   */
  size?: DividerSize;
  /**
   * The orientation of the Divider.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * A visual-only port of Spectrum 2's Divider for React Native, ported from the `divider`
 * `style()` call in `packages/@react-spectrum/s2/src/Divider.tsx` (lines ~65-96). Thickness comes
 * from `dividerThickness` in `tokens.ts` (S=1px, M=2px, L=4px); color is `gray-200` for S/M and
 * `gray-800` for L (the real component's `backgroundColor` block explicitly overrides to
 * `gray-800` only for `size: 'L'`, keeping S/M at the default `gray-200`). `staticColor` (for
 * dividers drawn over a colored/photo background) is dropped — this port has no notion of "on a
 * colored surface", same simplification spirit as `Button`'s dropped `premium`/`genai` variants.
 */
export function Divider(props: DividerProps): React.ReactElement {
  let {size = 'M', orientation = 'horizontal'} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let thickness = dividerThickness[size];
  let backgroundColor = getColor(size === 'L' ? 'gray-800' : 'gray-200', mode);

  let style: ViewStyle =
    orientation === 'horizontal'
      ? {alignSelf: 'stretch', height: thickness, backgroundColor, borderRadius: thickness / 2}
      : {alignSelf: 'stretch', width: thickness, backgroundColor, borderRadius: thickness / 2};

  return <View accessibilityRole="none" style={style} />;
}
