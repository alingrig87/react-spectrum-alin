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

import React, {createContext, ReactNode, useContext, useState} from 'react';
import {ColorSchemeName, Pressable, ScrollView, Text, useColorScheme, View} from 'react-native';
import {fontSize, getColor, semanticColors, tabGap, tabHeight, tabIndicatorThickness} from '../theme/tokens';

export type TabsDensity = 'compact' | 'regular';
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsProps {
  /** The `TabList` and `TabPanel`(s) making up this Tabs instance. */
  children: ReactNode;
  /** The key of the currently selected tab (controlled). */
  selectedKey?: string;
  /** The key of the initially selected tab (uncontrolled). */
  defaultSelectedKey?: string;
  /** Called when the selected tab changes. */
  onSelectionChange?: (key: string) => void;
  /**
   * The amount of space between tabs, and each tab's height.
   * @default 'regular'
   */
  density?: TabsDensity;
  /**
   * The orientation of the Tabs.
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;
  /** Whether all tabs are disabled. */
  isDisabled?: boolean;
}

interface TabsContextValue {
  selectedKey: string | undefined;
  setSelectedKey: (key: string) => void;
  density: TabsDensity;
  orientation: TabsOrientation;
  isDisabled: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * A visual-only, simplified port of Spectrum 2's Tabs for React Native. Real source:
 * `packages/@react-spectrum/s2/src/Tabs.tsx`. This is a much smaller compound component than the
 * real one: no keyboard/roving-tabindex navigation (react-aria's `RACTabs`/`RACTabList`), no
 * automatic collapsing into a `TabsPicker` dropdown when tabs overflow (`CollapsingTabs`, lines
 * ~755-862 of the real source — dropped for the same "no DOM layout measurement" reason
 * `Breadcrumbs.tsx` in this port drops its own collapsing-menu behavior; a horizontally-scrolling
 * `TabList` is used instead), and no animated *sliding* selection indicator (`SelectionIndicator`
 * + a measured `translate`/`width` transition, lines ~350-399 — RN has no free layout
 * measurement to slide between two arbitrary tab positions without extra `onLayout` bookkeeping, so
 * each `Tab` just draws its own static underline when selected instead of one indicator sliding
 * between tabs). Sizing (`tabHeight`/`tabGap`/`tabIndicatorThickness`) is exact, taken from the real
 * `tab`/`tablist`/`selectedIndicator` `style()` calls (see `tokens.ts` for the line references).
 */
export function Tabs(props: TabsProps): React.ReactElement {
  let {
    children,
    selectedKey: controlledKey,
    defaultSelectedKey,
    onSelectionChange,
    density = 'regular',
    orientation = 'horizontal',
    isDisabled = false
  } = props;

  let [internalKey, setInternalKey] = useState<string | undefined>(defaultSelectedKey);
  let selectedKey = controlledKey ?? internalKey;

  function setSelectedKey(key: string) {
    if (controlledKey == null) {
      setInternalKey(key);
    }
    onSelectionChange?.(key);
  }

  return (
    <TabsContext.Provider value={{selectedKey, setSelectedKey, density, orientation, isDisabled}}>
      <View style={{flexDirection: orientation === 'vertical' ? 'row' : 'column'}}>{children}</View>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  /** The `Tab` children. */
  children: ReactNode;
}

/** The horizontal (or vertical) row of `Tab`s. Scrolls instead of collapsing into a menu when it
 * overflows — see the module-level comment on `Tabs` above. */
export function TabList(props: TabListProps): React.ReactElement {
  let ctx = useContext(TabsContext);
  let orientation = ctx?.orientation ?? 'horizontal';

  return (
    <ScrollView
      horizontal={orientation === 'horizontal'}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: tabGap[ctx?.density ?? 'regular']
      }}>
      {props.children}
    </ScrollView>
  );
}

export interface TabProps {
  /** A stable key identifying this tab — matched against a `TabPanel`'s own `id`. */
  id: string;
  /** The tab's label. */
  children: ReactNode;
  /** Whether this specific tab is disabled. */
  isDisabled?: boolean;
}

/**
 * An individual Tab. Must be rendered inside a `TabList`, inside a `Tabs`.
 */
export function Tab(props: TabProps): React.ReactElement {
  let {id, children, isDisabled: ownDisabled = false} = props;
  let ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tab must be rendered inside a Tabs');
  }

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let isSelected = ctx.selectedKey === id;
  let isDisabled = ownDisabled || ctx.isDisabled;
  let height = tabHeight[ctx.density];

  let color = isDisabled
    ? semanticColors.disabledContent[mode]
    : isSelected
      ? getColor('gray-900', mode)
      : getColor('neutral-subdued', mode);
  let indicatorColor = isDisabled ? semanticColors.disabledContent[mode] : getColor('gray-900', mode);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{selected: isSelected, disabled: isDisabled}}
      disabled={isDisabled}
      onPress={() => ctx!.setSelectedKey(id)}
      style={{
        height,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: tabIndicatorThickness,
        borderBottomColor: isSelected ? indicatorColor : 'transparent'
      }}>
      {typeof children === 'string' ? (
        <Text style={{fontSize: fontSize.ui, fontWeight: isSelected ? '700' : '400', color}}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface TabPanelProps {
  /** The key of the `Tab` this panel belongs to. Only rendered while that tab is selected. */
  id: string;
  /** The panel's content. */
  children: ReactNode;
}

/** The content shown for a given `Tab`. Must be rendered inside a `Tabs`, as a sibling of
 * `TabList`. Only the panel whose `id` matches the currently selected tab is rendered. */
export function TabPanel(props: TabPanelProps): React.ReactElement | null {
  let ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('TabPanel must be rendered inside a Tabs');
  }
  if (ctx.selectedKey !== props.id) {
    return null;
  }
  return <View style={{marginTop: 4}}>{props.children}</View>;
}
