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

import {ColorSchemeName, StyleSheet, useColorScheme, View} from 'react-native';
import {colorSwatchSize, getColor, radius} from '../theme/tokens';
import {grayAlpha, parseColor} from '../utils/color';
import React from 'react';

export type ColorSwatchSize = 'XS' | 'S' | 'M' | 'L';
export type ColorSwatchRounding = 'default' | 'none' | 'full';

export interface ColorSwatchProps {
  /** The color to display, as a `#RGB`/`#RRGGBB`/`#RRGGBBAA` hex string or `rgb()`/`rgba()` string. */
  color: string;
  /**
   * The size of the ColorSwatch.
   * @default 'M'
   */
  size?: ColorSwatchSize;
  /**
   * The corner rounding of the ColorSwatch.
   * @default 'default'
   */
  rounding?: ColorSwatchRounding;
}

/**
 * A visual-only port of Spectrum 2's ColorSwatch for React Native. Real source:
 * `packages/@react-spectrum/s2/src/ColorSwatch.tsx`. The real component renders the color as a
 * CSS `background: linear-gradient(color, color), repeating-conic-gradient(...)` so any alpha
 * transparency in `color` shows the checkerboard through it (lines ~87-93); RN has no
 * `repeating-conic-gradient`, so this draws a coarse 4x4 gray/white grid of plain `View`s behind
 * the color instead — an approximation, not a real tileable pattern, but it reads the same way at
 * swatch sizes. When the color is fully transparent (`alpha === 0`), the real component shows a
 * diagonal red "no color" slash instead of the checkerboard (lines ~92-93); reproduced here with a
 * couple of rotated thin `View`s.
 */
export function ColorSwatch(props: ColorSwatchProps): React.ReactElement {
  let {color, size = 'M', rounding = 'default'} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let diameter = colorSwatchSize[size];
  // borderRadius mapping lifted from `borderRadius: {rounding: {...}}` in ColorSwatch.tsx
  // (lines ~105-111): 'default' -> the 'sm' radius step, 'none' -> 0, 'full' -> fully round.
  let cornerRadius = rounding === 'full' ? diameter / 2 : rounding === 'none' ? radius.none : radius.sm;

  let parsed = parseColor(color) ?? {r: 255, g: 255, b: 255, a: 0};
  let isTransparent = parsed.a <= 0;

  return (
    <View
      style={[
        styles.container,
        {
          width: diameter,
          height: diameter,
          borderRadius: cornerRadius,
          borderColor: grayAlpha(42, mode), // ColorSwatch.tsx line ~112: borderColor: 'gray-1000/42'
          borderWidth: 1
        }
      ]}>
      {isTransparent ? (
        <View style={[StyleSheet.absoluteFill, styles.noColor]}>
          <View style={styles.slash} />
        </View>
      ) : (
        <>
          <Checkerboard size={diameter} />
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a})`}
            ]}
          />
        </>
      )}
    </View>
  );
}

/** Coarse 4x4 gray/white checkerboard, approximating the real `repeating-conic-gradient` backdrop
 * that shows alpha transparency (see file doc comment above). */
function Checkerboard({size}: {size: number}): React.ReactElement {
  let cells = 4;
  let cellSize = size / cells;
  let squares: React.ReactElement[] = [];
  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      let isLight = (row + col) % 2 === 0;
      squares.push(
        <View
          key={`${row}-${col}`}
          style={{
            position: 'absolute',
            top: row * cellSize,
            left: col * cellSize,
            width: cellSize,
            height: cellSize,
            backgroundColor: isLight ? '#FFFFFF' : '#E1E1E1'
          }}
        />
      );
    }
  }
  return <View style={StyleSheet.absoluteFill}>{squares}</View>;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  noColor: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slash: {
    position: 'absolute',
    top: '50%',
    left: '-10%',
    width: '120%',
    height: 2,
    backgroundColor: getColor('negative-900', 'light'),
    transform: [{rotate: '-45deg'}]
  }
});
