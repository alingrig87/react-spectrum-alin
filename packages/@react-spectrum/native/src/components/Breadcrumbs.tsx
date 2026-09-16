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

import React, {ReactElement} from 'react';
import {
  ColorSchemeName,
  GestureResponderEvent,
  Pressable,
  Text,
  useColorScheme,
  View
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {breadcrumbsChevronSize, breadcrumbsGap, controlFontSize, controlHeight, getColor} from '../theme/tokens';

export type BreadcrumbsSize = 'M' | 'L';

export interface BreadcrumbsProps {
  /** The `Breadcrumb` items contained within. The last one is automatically rendered as the
   * current (non-interactive) item. */
  children: ReactElement<BreadcrumbProps> | Array<ReactElement<BreadcrumbProps>>;
  /**
   * The size of the Breadcrumbs.
   * @default 'M'
   */
  size?: BreadcrumbsSize;
  /** Whether the whole trail is disabled. */
  isDisabled?: boolean;
}

/** A small right-pointing chevron, hand-drawn the same way `Checkbox.tsx`'s checkmark/dash glyphs
 * are (a plain `react-native-svg` `Path` on a 0-0-20-20 viewBox) rather than porting the real
 * component's exact `ChevronIcon` bezier path (`packages/@react-spectrum/s2/ui-icons/
 * S2_ChevronSize100.svg`) — visually equivalent, not a pixel-exact glyph trace. */
function ChevronRight({size, color}: {size: number; color: string}): React.ReactElement {
  return (
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
  );
}

/**
 * A visual-only port of Spectrum 2's Breadcrumbs for React Native. Real source:
 * `packages/@react-spectrum/s2/src/Breadcrumbs.tsx`. The real component is a `RACBreadcrumbs`
 * collection that automatically collapses overflowing items into a "..." folder menu (lines
 * ~431-560, `CollapsingCollection`/`useCollectionRender`, driven by `useResizeObserver` measuring
 * real DOM layout) — that collapsing behavior has no simple RN equivalent (no DOM `offsetWidth`),
 * so this port always renders every `Breadcrumb` and instead just lets the row wrap onto multiple
 * lines (`flexWrap: 'wrap'`) when it doesn't fit, a deliberate, documented simplification. Gap
 * (`breadcrumbsGap`) and chevron size (`breadcrumbsChevronSize`) come from `tokens.ts`; item height
 * from the shared `controlHeight` scale (`breadcrumbStyles`'s `height: controlSize()` in the real
 * source is numerically the same scale Button/TextField use).
 */
export function Breadcrumbs(props: BreadcrumbsProps): React.ReactElement {
  let {children, size = 'M', isDisabled = false} = props;
  let items = React.Children.toArray(children) as ReactElement<BreadcrumbProps>[];
  let gap = breadcrumbsGap[size];

  return (
    <View
      accessibilityRole="none"
      style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', rowGap: gap, columnGap: gap}}>
      {items.map((child, i) =>
        React.cloneElement(child, {
          size,
          isDisabled: isDisabled || child.props.isDisabled,
          isCurrent: i === items.length - 1,
          key: child.key ?? i
        })
      )}
    </View>
  );
}

export interface BreadcrumbProps {
  /** The text content of this breadcrumb. */
  children: React.ReactNode;
  /** Called when this breadcrumb is pressed. Ignored on the current (last) item. */
  onPress?: (event: GestureResponderEvent) => void;
  /** Whether this specific item is disabled. Set automatically by `Breadcrumbs` for the rest of
   * the trail when its own `isDisabled` is set. */
  isDisabled?: boolean;
  /** @private Injected by the parent `Breadcrumbs` — true for the last item in the trail. */
  isCurrent?: boolean;
  /** @private Injected by the parent `Breadcrumbs`. */
  size?: BreadcrumbsSize;
}

/**
 * An individual Breadcrumb item. Must be rendered as a direct child of `Breadcrumbs`, which
 * injects `size`/`isCurrent`/`isDisabled`.
 */
export function Breadcrumb(props: BreadcrumbProps): React.ReactElement {
  let {children, onPress, isDisabled = false, isCurrent = false, size = 'M'} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let height = controlHeight[size === 'L' ? 'L' : 'M'];
  let fontSize = controlFontSize[size === 'L' ? 'L' : 'M'];
  let chevronSize = breadcrumbsChevronSize[size];

  // linkStyles' color states (Breadcrumbs.tsx lines ~299-329): default `neutral-subdued`
  // (gray-700-ish), `isCurrent` -> `neutral` (gray-800), `isDisabled` -> disabled gray-400.
  let textColor = isDisabled
    ? getColor('gray-400', mode)
    : isCurrent
      ? getColor('gray-800', mode)
      : getColor('neutral-subdued', mode);
  let chevronColor = getColor('gray-800', mode);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', height}}>
      {isCurrent ? (
        <Text style={{fontSize, fontWeight: '700', color: textColor}} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        <>
          <Pressable disabled={isDisabled} onPress={onPress} hitSlop={4}>
            {({pressed}) => (
              <Text
                style={{
                  fontSize,
                  color: textColor,
                  textDecorationLine: pressed ? 'underline' : 'none'
                }}
                numberOfLines={1}>
                {children}
              </Text>
            )}
          </Pressable>
          <View style={{marginStart: 6}}>
            <ChevronRight size={chevronSize} color={chevronColor} />
          </View>
        </>
      )}
    </View>
  );
}
