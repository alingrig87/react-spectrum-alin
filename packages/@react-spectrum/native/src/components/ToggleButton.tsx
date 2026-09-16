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
  colors,
  edgeToTextPaddingX,
  fontWeight,
  getColor,
  semanticColors
} from '../theme/tokens';

export type ToggleButtonSize = ActionControlSize;

export interface ToggleButtonProps {
  /** The content to display in the ToggleButton. Strings are wrapped in a `<Text>` automatically. */
  children: ReactNode;
  /** Whether the button is selected (controlled). */
  isSelected?: boolean;
  /**
   * The size of the ToggleButton.
   * @default 'M'
   */
  size?: ToggleButtonSize;
  /** Whether the button should be displayed with a quiet style when unselected. */
  isQuiet?: boolean;
  /**
   * Whether the button should be displayed with an emphasized (accent-filled) selected style,
   * rather than the default neutral (gray-filled) selected style.
   */
  isEmphasized?: boolean;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /** Called when the user toggles the button. Receives the new selection state. */
  onChange?: (isSelected: boolean) => void;
  /** Accessibility label, forwarded to the underlying `Pressable`. */
  accessibilityLabel?: string;
}

// Selected+emphasized background, lifted from `btnStyles`'s `backgroundColor.isSelected.isEmphasized`
// branch (`ActionButton.tsx` lines ~164-169): `lightDark('accent-900', 'accent-700')`. Same values
// (and same light/dark-swaps-scale-step, not just the pair's own dark half) `Button.tsx` uses for
// its own 'accent' fill variant — see that file's `fillBackground`/`fillBackgroundDarkScheme` comment.
const emphasizedSelectedBackground: {light: keyof typeof colors; dark: keyof typeof colors} = {
  light: 'accent-900',
  dark: 'accent-700'
};

/**
 * A visual-only port of Spectrum 2's ToggleButton for React Native. Like `ActionButton` (its
 * closest sibling — same `btnStyles` shared style object in the real source, see
 * `packages/@react-spectrum/s2/src/ActionButton.tsx` lines ~104-314), but with an `isSelected`
 * boolean that switches it into a filled state: a neutral gray-800 fill by default, or an accent
 * fill when `isEmphasized`. Built as a plain `Pressable` + `onChange` callback, not a port of
 * react-aria's `ToggleButton`/selection-state hooks (see `packages/@react-spectrum/s2/src/ToggleButton.tsx`
 * for the real behavioral implementation this only matches visually).
 */
export function ToggleButton(props: ToggleButtonProps): React.ReactElement {
  let {
    children,
    isSelected = false,
    size = 'M',
    isQuiet = false,
    isEmphasized = false,
    isDisabled = false,
    onChange,
    accessibilityLabel
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let height = actionControlHeight[size];
  let paddingX = edgeToTextPaddingX[size];
  let fontSize = actionControlFontSize[size];

  function handlePress(_event: GestureResponderEvent) {
    if (isDisabled) {
      return;
    }
    onChange?.(!isSelected);
  }

  // backgroundColor / color lifted from `btnStyles`'s `backgroundColor`/`color` maps
  // (`ActionButton.tsx` lines ~154-216): unselected matches ActionButton's own default/isQuiet
  // background (gray-100 / transparent) with gray-800 text; selected -> gray-800 bg (baseColor
  // 'neutral') + gray-25 text, or the accent fill + white text when isEmphasized; disabled swaps to
  // the same disabled background/content pair used throughout this port.
  let background: string;
  let textColor: string;
  if (isDisabled) {
    background = isQuiet ? 'transparent' : semanticColors.disabledBackground[mode];
    textColor = semanticColors.disabledContent[mode];
  } else if (isSelected) {
    if (isEmphasized) {
      background = getColor(emphasizedSelectedBackground[mode], mode);
      textColor = getColor('white', mode);
    } else {
      background = getColor('gray-800', mode);
      textColor = getColor('gray-25', mode);
    }
  } else {
    background = isQuiet ? 'transparent' : getColor('gray-100', mode);
    textColor = semanticColors.neutralContent[mode];
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled: isDisabled, selected: isSelected}}
      disabled={isDisabled}
      onPress={handlePress}
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
      {typeof children === 'string' ? (
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
