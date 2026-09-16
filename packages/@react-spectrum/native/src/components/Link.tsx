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
  Linking,
  Pressable,
  Text,
  useColorScheme
} from 'react-native';
import {colors, fontSize, fontWeight, getColor, semanticColors} from '../theme/tokens';

export type LinkVariant = 'primary' | 'secondary';

export interface LinkProps {
  /** The text content of the Link. */
  children: ReactNode;
  /**
   * The visual style of the link.
   * @default 'primary'
   */
  variant?: LinkVariant;
  /** Whether the link is on its own vs. inline inside a longer run of text. */
  isStandalone?: boolean;
  /**
   * Whether the link should be displayed with a quiet style (no underline at rest — only while
   * pressed). Has no effect when `isStandalone` is false, since inline links must always be
   * underlined for accessibility.
   */
  isQuiet?: boolean;
  /** Whether the link is disabled. */
  isDisabled?: boolean;
  /** A URL to open (via `Linking.openURL`) when the link is pressed, if `onPress` isn't given. */
  href?: string;
  /** Called when the link is pressed. Overrides the default `href`-opening behavior. */
  onPress?: (event: GestureResponderEvent) => void;
  /** Accessibility label, forwarded to the underlying `Pressable`. */
  accessibilityLabel?: string;
}

/**
 * A visual-only port of Spectrum 2's Link for React Native. Ported from
 * `packages/@react-spectrum/s2/src/Link.tsx`'s `link` style() object (lines ~67-108): `variant`
 * picks the text color (`baseColor('accent')` -> `accent-900`/`dark:accent-700`, the same values
 * `Button.tsx` uses for its own 'accent' variant text, vs. `baseColor('neutral')` -> `gray-800`),
 * `borderRadius: 'sm'` isn't visible without a background/focus ring so is dropped, and the
 * underline logic (lines ~89-98: always underlined unless `isQuiet && isStandalone`) is kept as-is.
 * Since RN text has no CSS `font-size: inherit`, the non-standalone (inline) case can't actually
 * inherit a surrounding paragraph's size the way the real component's bare `font` (unset unless
 * `isStandalone`) does — this always renders at the `ui` (14px) control font size as an
 * approximation, whether or not `isStandalone` is set. Uses `Pressable` + `onPress`/`Linking`
 * instead of react-aria's `Link`'s keyboard/focus/anchor semantics.
 */
export function Link(props: LinkProps): React.ReactElement {
  let {
    children,
    variant = 'primary',
    isStandalone = false,
    isQuiet = false,
    isDisabled = false,
    href,
    onPress,
    accessibilityLabel
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  // `accent-900`/dark `accent-700`: `baseColor('accent')` -> `accent-content-color-default`.
  // Approximated to the same single-token-per-variant treatment `Button.tsx`'s outline text colors
  // use, since the real `accent-content-color-default` value isn't resolvable without the
  // `@adobe/spectrum-tokens` JSON this RN port's `tokens.ts` was hand-extracted from (see that
  // file's top comment) — `accent-900` is the closest already-verified token for accent-colored text.
  let accentTextToken: keyof typeof colors = variant === 'primary' ? 'accent-900' : 'gray-800';
  let textColor = isDisabled
    ? semanticColors.disabledContent[mode]
    : getColor(accentTextToken, mode);

  function handlePress(event: GestureResponderEvent) {
    if (isDisabled) {
      return;
    }
    if (onPress) {
      onPress(event);
    } else if (href) {
      Linking.openURL(href);
    }
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled: isDisabled}}
      disabled={isDisabled}
      onPress={handlePress}
      hitSlop={4}
      style={({pressed}) => ({
        alignSelf: 'flex-start',
        opacity: pressed && !isDisabled ? 0.7 : 1
      })}>
      {({pressed}) => {
        // Quiet standalone links have no underline at rest and gain one on press — this port's
        // nearest RN equivalent to the real component's `isHovered`/`isFocusVisible` branches
        // (`Link.tsx` lines ~89-98), which have no direct RN counterpart. Every other combination
        // (including all non-standalone/non-quiet links) is always underlined, matching the real
        // component's accessibility requirement that inline links stay underlined.
        let showUnderline = !(isStandalone && isQuiet) || pressed;
        return (
          <Text
            style={{
              color: textColor,
              fontSize: fontSize.ui,
              fontWeight: isStandalone ? fontWeight.medium : fontWeight.normal,
              textDecorationLine: showUnderline ? 'underline' : 'none'
            }}>
            {children}
          </Text>
        );
      }}
    </Pressable>
  );
}
