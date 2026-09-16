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
  ActionControlSize,
  actionControlFontSize,
  actionControlHeight,
  actionControlRadius,
  edgeToTextPaddingX,
  fontWeight,
  getColor,
  semanticColors
} from '../theme/tokens';

export type ActionButtonSize = ActionControlSize;

export interface ActionButtonProps {
  /** The content to display in the ActionButton. Strings are wrapped in a `<Text>` automatically. */
  children: ReactNode;
  /**
   * The size of the ActionButton.
   * @default 'M'
   */
  size?: ActionButtonSize;
  /**
   * Whether the button should be displayed with a quiet style (transparent background even at
   * rest, rather than the default subtle gray fill).
   */
  isQuiet?: boolean;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /** Whether the button shows a pending/loading spinner in place of its content. */
  isPending?: boolean;
  /** Called when the button is pressed. */
  onPress?: (event: GestureResponderEvent) => void;
  /** Accessibility label, forwarded to the underlying `Pressable`. */
  accessibilityLabel?: string;
}

/**
 * A visual-only port of Spectrum 2's ActionButton for React Native. ActionButton is Spectrum's
 * "chrome" button style — a smaller, quieter control than `Button`, used for toolbar-style actions
 * rather than primary calls to action. Ported from `packages/@react-spectrum/s2/src/ActionButton.tsx`'s
 * `btnStyles` (shared with `ToggleButton`, see `../components/ToggleButton.tsx`), lines ~104-314:
 * `control({shape: 'default', icon: true})` for sizing (see `tokens.ts`'s `actionControl*` exports)
 * and the `backgroundColor`/`color` `default`/`isQuiet` branches (lines ~154-161, ~197-198) for its
 * resting-state colors. Like `Button.tsx`, this intentionally drops the `staticColor` variant (a
 * marketing-surface-over-photo special case) and any hover/focus-ring styling, since this is a
 * `Pressable` + `onPress` port, not a react-aria behavior reimplementation.
 */
export function ActionButton(props: ActionButtonProps): React.ReactElement {
  let {
    children,
    size = 'M',
    isQuiet = false,
    isDisabled = false,
    isPending = false,
    onPress,
    accessibilityLabel
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let height = actionControlHeight[size];
  let paddingX = edgeToTextPaddingX[size];
  let fontSize = actionControlFontSize[size];

  // backgroundColor / color lifted from `btnStyles` in ActionButton.tsx: default (unselected,
  // non-quiet) background is 'gray-100', isQuiet drops it to transparent; text is
  // `baseColor('neutral')` -> gray-800 either way (lines ~154-161, ~197-198). Disabled swaps to the
  // same disabled background/content pair `Button.tsx` uses for its own fill variant, since S2's
  // disabled ActionButton reads the same way (dim gray chrome, dim gray text).
  let background = isDisabled
    ? (isQuiet ? 'transparent' : semanticColors.disabledBackground[mode])
    : (isQuiet ? 'transparent' : getColor('gray-100', mode));
  let textColor = isDisabled
    ? semanticColors.disabledContent[mode]
    : semanticColors.neutralContent[mode];

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
          borderRadius: actionControlRadius[size],
          paddingHorizontal: paddingX,
          backgroundColor: background,
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
            fontWeight: fontWeight.medium,
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
