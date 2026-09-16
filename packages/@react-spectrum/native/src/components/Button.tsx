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

import React, {ReactNode, useMemo} from 'react';
import {
  ActivityIndicator,
  ColorSchemeName,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import {
  borderWidth,
  buttonPaddingX,
  colors,
  controlFontSize,
  controlHeight,
  ControlSize,
  fontWeight,
  getColor,
  semanticColors
} from '../theme/tokens';

/**
 * Visual variants ported from `packages/@react-spectrum/s2/src/Button.tsx`'s `ButtonStyleProps`.
 * `'premium'`/`'genai'` (S2's gradient variants) are intentionally dropped — they're a
 * marketing-surface special case, not something a typical RN app screen needs, and their
 * gradient background is one of the genuinely non-trivial things this visual-only port chooses
 * not to chase.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'negative';

export type ButtonFillStyle = 'fill' | 'outline';

export type ButtonSize = ControlSize;

export interface ButtonProps {
  /** The content to display in the Button. Strings are wrapped in a `<Text>` automatically. */
  children: ReactNode;
  /**
   * The visual style of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * The background style of the Button.
   * @default 'fill'
   */
  fillStyle?: ButtonFillStyle;
  /**
   * The size of the Button.
   * @default 'M'
   */
  size?: ButtonSize;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /** Whether the button shows a pending/loading spinner in place of its content. */
  isPending?: boolean;
  /** Called when the button is pressed. */
  onPress?: (event: GestureResponderEvent) => void;
  /** Accessibility label, forwarded to the underlying `Pressable`. */
  accessibilityLabel?: string;
}

// Real per-size fill/outline colors, lifted from the `button` style() call in
// `packages/@react-spectrum/s2/src/Button.tsx` (lines ~147-293). Only the 'default' (resting)
// state of each variant is modeled directly; hover has no RN equivalent, and the pressed state is
// approximated below with a fixed opacity overlay instead of re-deriving each variant's
// "isPressed" background color (S2 typically pressed = the same value as hovered).
const fillBackground: Record<ButtonVariant, keyof typeof colors> = {
  primary: 'gray-800', // baseColor('neutral') -> neutral-background-color-default -> gray-800
  secondary: 'gray-100',
  accent: 'accent-900', // lightDark('accent-900', 'accent-700'); dark-mode value approximated, see getColor() usage below
  negative: 'negative-900' // lightDark('negative-900', 'negative-700')
};

// Dark-scheme fill background needs the *other* light/dark pair S2 swaps to, not just the dark
// half of the same pair (`lightDark('accent-900', 'accent-700')` swaps to a different scale step
// entirely in dark mode, not just accent-900's own dark value). Modeled explicitly here.
const fillBackgroundDarkScheme: Partial<Record<ButtonVariant, keyof typeof colors>> = {
  accent: 'accent-700',
  negative: 'negative-700'
};

const fillTextColor: Record<ButtonVariant, keyof typeof colors> = {
  primary: 'gray-25',
  secondary: 'gray-800', // baseColor('neutral')
  accent: 'white',
  negative: 'white'
};

const outlineBorderColor: Record<ButtonVariant, keyof typeof colors> = {
  // S2's outline border color is only explicitly defined for primary/secondary; accent/negative
  // are approximated here to their own fill color so an outline accent/negative button still
  // reads as accent/negative rather than falling back to plain gray.
  primary: 'gray-800',
  secondary: 'gray-300',
  accent: 'accent-900',
  negative: 'negative-900'
};

const outlineTextColor: Record<ButtonVariant, keyof typeof colors> = {
  primary: 'gray-800',
  secondary: 'gray-800',
  accent: 'accent-900',
  negative: 'negative-900'
};

/**
 * A visual-only port of Spectrum 2's Button for React Native. Matches the real component's
 * `variant` x `fillStyle` x `size` visual matrix (see `Button.tsx` in `@react-spectrum/s2/src`)
 * using `Pressable` + `onPress` instead of react-aria's DOM press/keyboard/focus handling — this
 * is NOT a reimplementation of react-aria's accessibility behavior.
 */
export function Button(props: ButtonProps): React.ReactElement {
  let {
    children,
    variant = 'primary',
    fillStyle = 'fill',
    size = 'M',
    isDisabled = false,
    isPending = false,
    onPress,
    accessibilityLabel
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let height = controlHeight[size];
  let paddingX = buttonPaddingX[size];
  let fontSize = controlFontSize[size];

  let background = useMemo(() => {
    if (fillStyle !== 'fill') {
      return 'transparent';
    }
    let token = (mode === 'dark' ? fillBackgroundDarkScheme[variant] : undefined) ?? fillBackground[variant];
    return getColor(token, mode);
  }, [fillStyle, mode, variant]);

  let textColor = useMemo(() => {
    if (isDisabled) {
      return semanticColors.disabledContent[mode];
    }
    return fillStyle === 'fill' ? getColor(fillTextColor[variant], mode) : getColor(outlineTextColor[variant], mode);
  }, [fillStyle, isDisabled, mode, variant]);

  let borderColor = fillStyle === 'outline' ? getColor(outlineBorderColor[variant], mode) : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled: isDisabled || isPending}}
      disabled={isDisabled || isPending}
      onPress={onPress}
      style={({pressed}) => [
        styles.base,
        {
          height,
          borderRadius: height / 2,
          paddingHorizontal: paddingX,
          backgroundColor: isDisabled && fillStyle === 'fill'
            ? semanticColors.disabledBackground[mode]
            : background,
          borderWidth: fillStyle === 'outline' ? borderWidth[200] : 0,
          borderColor: isDisabled ? semanticColors.disabledBorder[mode] : borderColor,
          opacity: pressed && !isDisabled ? 0.85 : 1
        }
      ]}>
      {isPending ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : typeof children === 'string' ? (
        <Text
          style={{
            color: textColor,
            fontSize,
            fontWeight: fontWeight.bold,
            textAlign: 'center'
          }}
          numberOfLines={1}>
          {children}
        </Text>
      ) : (
        <View>{children}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start'
  }
});
