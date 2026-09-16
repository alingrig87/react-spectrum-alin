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

import React, {useMemo} from 'react';
import {ColorSchemeName, Image, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {getColor} from '../theme/tokens';

/**
 * The enumerated sizes `packages/@react-spectrum/s2/src/Avatar.tsx`'s `AvatarProps['size']` lists
 * (lines ~41-57) as `rem`-based presets (`${size / 16}rem`), plus an escape hatch for an arbitrary
 * number since the real prop also accepts `(number & {})`.
 */
export type AvatarSize = 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 56 | 64 | 80 | 96 | 112 | (number & {});

export interface AvatarProps {
  /** The image URL for the avatar. */
  src?: string;
  /**
   * Text description of the avatar. Also used, when no `src` is given, to derive the initials
   * shown in the placeholder circle (an addition beyond the real S2 component — see below).
   */
  alt?: string;
  /**
   * The size of the avatar, in pixels.
   * @default 24
   */
  size?: AvatarSize;
  /** Whether the avatar is over a color background. */
  isOverBackground?: boolean;
}

/**
 * A visual-only port of Spectrum 2's Avatar for React Native. Matches the real component's size
 * scale and its `isOverBackground` outline behavior (`imageStyles` in `Avatar.tsx`, lines ~62-84:
 * `outlineWidth` is 1px normally, 2px once `size >= 64` ("isLarge" — `Avatar.tsx` line ~119), and
 * only drawn at all when `isOverBackground`). The real component's outline color is the CSS custom
 * property `--s2-container-bg` (whatever surface color the avatar is currently painted on); this
 * port has no such "current surface" concept, so it approximates with a fixed `white`/`gray-25`
 * page-background color instead — noted here since it's the one deliberate color approximation in
 * this file.
 *
 * Unlike the real (DOM-only, `<img>`-based) S2 Avatar, this port also renders an initials
 * placeholder — derived from `alt` — when no `src` is given, since a RN app has no broken-image
 * fallback. This is an intentional addition beyond the ported component, not something read out of
 * the S2 source.
 */
export function Avatar(props: AvatarProps): React.ReactElement {
  let {src, alt = '', size = 24, isOverBackground = false} = props;
  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let isLarge = size >= 64;
  let outlineWidth = isOverBackground ? (isLarge ? 2 : 1) : 0;
  // Approximation: real S2 uses `--s2-container-bg` (the ambient surface color) here; we don't
  // have a "current surface" concept in this port, so a fixed page-background color is used.
  let outlineColor = getColor('gray-25', mode);

  let initials = useMemo(() => {
    let words = alt.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return '';
    }
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }, [alt]);

  let dimensionStyle = {width: size, height: size, borderRadius: size / 2};

  if (src) {
    return (
      <Image
        source={{uri: src}}
        accessibilityLabel={alt}
        style={[
          dimensionStyle,
          {
            borderWidth: outlineWidth,
            borderColor: outlineColor
          }
        ]}
      />
    );
  }

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={alt}
      style={[
        dimensionStyle,
        styles.placeholder,
        {
          backgroundColor: getColor('gray-300', mode),
          borderWidth: outlineWidth,
          borderColor: outlineColor
        }
      ]}>
      <Text
        style={{
          color: getColor('gray-800', mode),
          fontSize: Math.max(8, Math.round(size * 0.4)),
          fontWeight: '600'
        }}
        numberOfLines={1}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
});
