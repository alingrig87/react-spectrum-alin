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

import React, {createContext, ReactNode, useContext} from 'react';
import {
  ColorSchemeName,
  GestureResponderEvent,
  Pressable,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {
  controlFontSize,
  controlHeight,
  ControlSize,
  edgeToTextPaddingX,
  getColor,
  semanticColors
} from '../theme/tokens';

export type MenuSize = ControlSize;

export interface MenuProps {
  /** The `MenuItem`s (and optionally `Divider`s) making up this menu. */
  children: ReactNode;
  /**
   * The size of the Menu.
   * @default 'M'
   */
  size?: MenuSize;
}

interface MenuContextValue {
  size: MenuSize;
}

const MenuContext = createContext<MenuContextValue>({size: 'M'});

/**
 * A visual-only port of Spectrum 2's Menu for React Native — just the menu's own list visuals
 * (`Menu`/`MenuItem`), rendered inline rather than inside a floating popover. Real source:
 * `packages/@react-spectrum/s2/src/Menu.tsx`. The real `Menu` is a `react-aria-components`
 * collection that (when triggered from a `MenuTrigger`) renders itself inside a `Popover` (lines
 * ~469-586) with full keyboard navigation, type-ahead, sections, submenus and async loading; this
 * port drops all of that and is just a plain `View` list of `MenuItem`s — wiring an actual
 * floating/overlay `Popover` is explicitly out of scope per this port's task. Sizing is exact: menu
 * item min-height reuses the same `controlHeight` scale the real `menuItemGrid` (`edgeToText(24|32|
 * 40|48)`, lines ~143-150) is built from, and horizontal padding reuses `edgeToTextPaddingX`
 * (the same `'edge-to-text'` token `Badge.tsx` already uses in this port).
 */
export function Menu(props: MenuProps): React.ReactElement {
  let {children, size = 'M'} = props;
  return (
    <MenuContext.Provider value={{size}}>
      <View accessibilityRole="menu">{children}</View>
    </MenuContext.Provider>
  );
}

export interface MenuItemProps {
  /** The item's label. */
  children: ReactNode;
  /** An optional leading icon/glyph, rendered before the label. */
  icon?: ReactNode;
  /** An optional trailing keyboard-shortcut string (e.g. `'⌘S'`), rendered right-aligned. */
  shortcut?: string;
  /** Whether this item shows a leading checkmark (e.g. for a single-selection menu). */
  isSelected?: boolean;
  /** Whether this item is disabled. */
  isDisabled?: boolean;
  /** Called when this item is pressed. */
  onPress?: (event: GestureResponderEvent) => void;
}

/** A small checkmark glyph, hand-drawn the same way `Checkbox.tsx`'s own checkmark is (a plain
 * `react-native-svg` `Path`) rather than porting the real `CheckmarkIcon`'s exact bezier path. */
function Checkmark({size, color}: {size: number; color: string}): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path
        d="M4 10.5L8 14.5L16 5.5"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * An individual Menu item. Must be rendered inside a `Menu`.
 */
export function MenuItem(props: MenuItemProps): React.ReactElement {
  let {children, icon, shortcut, isSelected = false, isDisabled = false, onPress} = props;
  let {size} = useContext(MenuContext);

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let minHeight = controlHeight[size];
  let paddingX = edgeToTextPaddingX[size];
  let fontSize = controlFontSize[size];

  // menuitem's backgroundColor.isFocused (Menu.tsx line ~223, `baseColor('gray-100').
  // isFocusVisible`) has no RN keyboard-focus equivalent, so this port uses it as the `pressed`
  // background instead — the nearest touch-equivalent affordance.
  let pressedBackground = getColor('gray-100', mode);
  let labelColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];
  let shortcutColor = isDisabled ? semanticColors.disabledContent[mode] : getColor('gray-600', mode);
  let checkmarkColor = getColor('accent-900', mode);

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{disabled: isDisabled, selected: isSelected}}
      disabled={isDisabled}
      onPress={onPress}
      style={({pressed}) => ({
        flexDirection: 'row',
        alignItems: 'center',
        minHeight,
        paddingHorizontal: paddingX,
        borderRadius: 4,
        backgroundColor: pressed && !isDisabled ? pressedBackground : 'transparent'
      })}>
      <View style={{width: 20, alignItems: 'center', marginEnd: 4}}>
        {isSelected && <Checkmark size={14} color={checkmarkColor} />}
      </View>
      {icon != null && <View style={{marginEnd: 8}}>{icon}</View>}
      {typeof children === 'string' ? (
        <Text style={{flex: 1, fontSize, fontWeight: '500', color: labelColor}} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        <View style={{flex: 1}}>{children}</View>
      )}
      {shortcut != null && (
        <Text style={{fontSize, color: shortcutColor, marginStart: 8}}>{shortcut}</Text>
      )}
    </Pressable>
  );
}
