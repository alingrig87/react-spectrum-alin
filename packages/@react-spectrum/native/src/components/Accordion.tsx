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

import React, {ReactNode, useState} from 'react';
import {
  ColorSchemeName,
  LayoutAnimation,
  Platform,
  Pressable,
  Text,
  UIManager,
  useColorScheme,
  View
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {accordionHeaderFontSize, controlHeight, ControlSize, fontWeight, getColor} from '../theme/tokens';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type AccordionSize = ControlSize;

export interface AccordionProps {
  /** The `AccordionItem`s contained within. */
  children: ReactNode;
  /**
   * The size of the Accordion's items.
   * @default 'M'
   */
  size?: AccordionSize;
}

/**
 * A visual-only port of Spectrum 2's Accordion for React Native. Real source:
 * `packages/@react-spectrum/s2/src/Accordion.tsx`, which is a thin wrapper (`AccordionItem` etc.)
 * around the more general `Disclosure`/`DisclosureGroup` in `Disclosure.tsx` — this port follows
 * the same relationship (`Accordion` is just a bordered column of `AccordionItem`s; each
 * `AccordionItem` IS a Disclosure). `Accordion` itself carries no extra styling in the real source
 * beyond `display: flex; flex-direction: column` (`Accordion.tsx` lines ~66-72) — the borders live
 * on each item.
 */
export function Accordion(props: AccordionProps): React.ReactElement {
  let {children, size = 'M'} = props;
  return (
    <View>
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<AccordionItemProps>, {size}) : child
      )}
    </View>
  );
}

export interface AccordionItemProps {
  /** The header title, shown next to the expand/collapse chevron. */
  title: ReactNode;
  /** The collapsible content, shown when expanded. */
  children: ReactNode;
  /**
   * Whether the item is expanded by default (uncontrolled).
   * @default false
   */
  defaultExpanded?: boolean;
  /** Whether the item is disabled. */
  isDisabled?: boolean;
  /** @private Injected by the parent `Accordion`. */
  size?: AccordionSize;
}

/** A right-pointing chevron that rotates 90° when expanded — see `Breadcrumbs.tsx`'s `ChevronRight`
 * for why this is a hand-drawn `react-native-svg` `Path` rather than a ported icon asset. */
function Chevron({size, color, isExpanded}: {size: number; color: string; isExpanded: boolean}): React.ReactElement {
  return (
    <View style={{transform: [{rotate: isExpanded ? '90deg' : '0deg'}]}}>
      <Svg width={size} height={size} viewBox="0 0 20 20">
        <Path
          d="M7 4L13 10L7 16"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

/**
 * An individual, collapsible Accordion section (header + panel). Must be rendered inside an
 * `Accordion`. Real source: `Disclosure.tsx`'s `Disclosure`/`DisclosureTitle`/`DisclosurePanel`
 * (lines ~84-395) — border (`gray-200`, 1px bottom), header (`buttonStyles`: bold text at the
 * `title-*` scale — approximated here via `accordionHeaderFontSize`, see that token's comment in
 * `tokens.ts` for why — `minHeight` from the real `regular`-density table, which is numerically
 * identical to the shared `controlHeight` scale) and panel (`panelInner`'s padding, lines
 * ~361-372) sizes are all lifted from the real `style()` calls. The real panel animates its
 * `height` between 0 and its measured content height via a CSS transition
 * (`packages/@react-spectrum/s2/src/Disclosure.tsx` lines ~351-359, `--disclosure-panel-height`);
 * RN has no equivalent CSS custom-property-driven height transition, so this port approximates it
 * with `LayoutAnimation.configureNext` (a basic, built-in cross-fade/expand on the next render)
 * around a plain conditional-render toggle instead of a true measured height animation.
 */
export function AccordionItem(props: AccordionItemProps): React.ReactElement {
  let {title, children, defaultExpanded = false, isDisabled = false, size = 'M'} = props;
  let [isExpanded, setIsExpanded] = useState(defaultExpanded);

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let minHeight = controlHeight[size];
  let headerFontSize = accordionHeaderFontSize[size];
  let borderColor = getColor('gray-200', mode);
  let headerColor = getColor('gray-900', mode);
  let bodyColor = getColor('gray-800', mode);

  function toggle() {
    if (isDisabled) {
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(v => !v);
  }

  return (
    <View style={{borderBottomWidth: 1, borderColor}}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{expanded: isExpanded, disabled: isDisabled}}
        disabled={isDisabled}
        onPress={toggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          minHeight,
          paddingHorizontal: Math.round((minHeight * 3) / 8),
          opacity: isDisabled ? 0.5 : 1
        }}>
        <Chevron size={14} color={headerColor} isExpanded={isExpanded} />
        {typeof title === 'string' ? (
          <Text style={{flex: 1, fontSize: headerFontSize, fontWeight: fontWeight.bold, color: headerColor}}>
            {title}
          </Text>
        ) : (
          <View style={{flex: 1}}>{title}</View>
        )}
      </Pressable>
      {isExpanded && (
        <View style={{paddingHorizontal: 12, paddingTop: 8, paddingBottom: 16}}>
          {typeof children === 'string' ? (
            <Text style={{fontSize: 16, color: bodyColor}}>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
}
