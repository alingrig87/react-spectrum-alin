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
import Svg, {Line} from 'react-native-svg';
import {
  actionControlFontSize,
  actionControlHeight,
  actionControlRadius,
  colors,
  crossIconSize,
  edgeToTextPaddingX,
  getColor,
  iconTextGap,
  semanticColors,
  spacing
} from '../theme/tokens';

export type TagSize = 'S' | 'M' | 'L';

export interface TagProps {
  /** The label to display in the Tag. */
  children: ReactNode;
  /** An optional icon to display before the label. */
  icon?: ReactNode;
  /**
   * The size of the Tag.
   * @default 'M'
   */
  size?: TagSize;
  /** Whether the tag should be displayed with an emphasized (accent) selected style. */
  isEmphasized?: boolean;
  /** Whether the tag is selected (e.g. as a filter chip). */
  isSelected?: boolean;
  /** Whether the tag is disabled. */
  isDisabled?: boolean;
  /** Called when the tag itself is pressed (e.g. to select it). Omit for a non-interactive tag. */
  onPress?: (event: GestureResponderEvent) => void;
  /** Called when the tag's remove (x) button is pressed. Renders the remove button when given. */
  onRemove?: () => void;
  /** Accessibility label, forwarded to the underlying `Pressable`. */
  accessibilityLabel?: string;
}

// Selected+emphasized background — same `lightDark('accent-900', 'accent-700')` pair `Button.tsx`
// (its 'accent' fill variant) and `ToggleButton.tsx` (`emphasizedSelectedBackground`) use.
const emphasizedSelectedBackground: {light: keyof typeof colors; dark: keyof typeof colors} = {
  light: 'accent-900',
  dark: 'accent-700'
};

/**
 * A visual-only port of Spectrum 2's Tag for React Native. Tag is defined as a sub-part of
 * `TagGroup` in the real S2 source — there's no standalone `Tag.tsx` — so this is ported from
 * `packages/@react-spectrum/s2/src/TagGroup.tsx`'s `tagStyles` style() object (lines ~506-572):
 * `control({shape: 'default', icon: true})` for its box sizing (height/radius/padding — the same
 * `actionControl*` tokens `ActionButton`/`ToggleButton` use, since Tag's box uses the identical
 * non-pill control formula), `margin: 4` between tags (line ~563), and the same selected/
 * selected+emphasized/disabled background+text color branches (lines ~522-557) `ToggleButton.tsx`
 * already models — reused here rather than re-derived. The remove (x) button is a plain `Pressable`
 * drawing an X with `react-native-svg` sized from `crossIconSize` (ported from the real
 * `ClearButton`'s `CrossIcon`, see `packages/@react-spectrum/s2/ui-icons/Cross.tsx`), rather than a
 * port of `ClearButton.tsx`'s own focus-ring/press-scale behavior.
 */
export function Tag(props: TagProps): React.ReactElement {
  let {
    children,
    icon,
    size = 'M',
    isEmphasized = false,
    isSelected = false,
    isDisabled = false,
    onPress,
    onRemove,
    accessibilityLabel
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let height = actionControlHeight[size];
  let fontSize = actionControlFontSize[size];
  let allowsRemoving = !!onRemove;

  // backgroundColor / color: see `emphasizedSelectedBackground` above and `ToggleButton.tsx`'s
  // matching block for the source citation — `tagStyles` (lines ~522-557) uses the exact same
  // default/selected/selected+emphasized/disabled branches ActionButton/ToggleButton's `btnStyles`
  // does, just with a plain 'gray-100' (not isQuiet-able) resting background.
  let background: string;
  let textColor: string;
  if (isDisabled) {
    background = semanticColors.disabledBackground[mode];
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
    background = getColor('gray-100', mode);
    textColor = semanticColors.neutralContent[mode];
  }

  let content = (
    <View style={[styles.row, {gap: iconTextGap[size]}]}>
      {icon != null && <View>{icon}</View>}
      {typeof children === 'string' ? (
        <Text
          style={{color: textColor, fontSize, flexShrink: 1}}
          numberOfLines={1}>
          {children}
        </Text>
      ) : (
        <View>{children}</View>
      )}
    </View>
  );

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled: isDisabled, selected: isSelected}}
      disabled={isDisabled || !onPress}
      onPress={onPress}
      style={({pressed}) => [
        styles.tag,
        {
          height,
          borderRadius: actionControlRadius[size],
          paddingStart: edgeToTextPaddingX[size],
          paddingEnd: allowsRemoving ? 0 : edgeToTextPaddingX[size],
          margin: spacing[75],
          backgroundColor: background,
          opacity: pressed && !isDisabled && onPress ? 0.85 : 1
        }
      ]}>
      {content}
      {allowsRemoving && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Remove"
          disabled={isDisabled}
          hitSlop={8}
          onPress={onRemove}
          style={[styles.removeButton, {width: height, opacity: isDisabled ? 0.5 : 1}]}>
          <Svg
            width={crossIconSize[size]}
            height={crossIconSize[size]}
            viewBox="0 0 20 20">
            <Line x1="4" y1="4" x2="16" y2="16" stroke={textColor} strokeWidth={2} strokeLinecap="round" />
            <Line x1="16" y1="4" x2="4" y2="16" stroke={textColor} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
