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
import {ColorSchemeName, Pressable, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {colors, fontSize, fontWeight, getColor, radius} from '../theme/tokens';

export type CardSize = 'XS' | 'S' | 'M' | 'L' | 'XL';
export type CardVariant = 'primary' | 'secondary' | 'tertiary' | 'quiet';

// Card width per size, from the `width.size` branch of `card`'s `style()` call in
// `packages/@react-spectrum/s2/src/Card.tsx` (lines ~147-156).
const cardWidth: Record<CardSize, number> = {
  XS: 112,
  S: 192,
  M: 240,
  L: 320,
  XL: 400
};

// `--card-spacing` for `density: 'regular'` (`Card.tsx` lines ~171-179) — the internal padding
// used for both the content area and (halved) the footer/content gaps below. This port only
// implements the real component's default `'regular'` density; `'compact'`/`'spacious'` are
// dropped as an intentional simplification (a card's padding density is a fairly marginal visual
// knob for a mobile app screen, same spirit as `Accordion`/`Table` dropping their own density or
// scale variants elsewhere in this port).
const cardPadding: Record<CardSize, number> = {
  XS: 8,
  S: 12,
  M: 16,
  L: 20,
  XL: 24
};

// borderRadius: the shared `lg` (10, `radius.lg`) shape for M/L/XL, dropping to the 'default'
// shape (8, `radius.md`) for XS/S — from the `borderRadius` const (`Card.tsx` lines ~80-86).
const cardRadius: Record<CardSize, number> = {
  XS: radius.md,
  S: radius.md,
  M: radius.lg,
  L: radius.lg,
  XL: radius.lg
};

// title/description font sizes, from the `size` branches of `title`/`description` in `Card.tsx`
// (lines ~291-319: `title-xs`/`title-sm`/`title`/`title-lg`, `body-2xs`/`body-xs`/`body-sm`/
// `body`). Like `accordionHeaderFontSize` in tokens.ts, the `title-*` scale isn't a published
// token in `@adobe/spectrum-tokens` (only `heading-*`/`body-*`/`detail-*`/`code-*` are), so these
// are approximated onto this port's existing `ui`-scale `fontSize` steps instead — the same
// documented approximation strategy `tokens.ts` already uses for `accordionHeaderFontSize`.
const titleFontSize: Record<CardSize, number> = {
  XS: fontSize['ui-sm'],
  S: fontSize['ui-sm'],
  M: fontSize.ui,
  L: fontSize['ui-lg'],
  XL: fontSize['ui-xl']
};

const descriptionFontSize: Record<CardSize, number> = {
  XS: fontSize['ui-xs'],
  S: fontSize['ui-xs'],
  M: fontSize['ui-sm'],
  L: fontSize.ui,
  XL: fontSize['ui-lg']
};

// content's rowGap (space between title and description) per size, from `content.rowGap`
// (`Card.tsx` lines ~337-345): 4/4/6/6/8 for XS/S/M/L/XL.
const contentGap: Record<CardSize, number> = {
  XS: 4,
  S: 4,
  M: 6,
  L: 6,
  XL: 8
};

export interface CardProps {
  /**
   * The size of the Card, which drives its width and internal padding/type-scale.
   * @default 'M'
   */
  size?: CardSize;
  /**
   * The visual style of the Card: `'primary'`/`'secondary'` are elevated/flat filled surfaces,
   * `'tertiary'` is outlined, `'quiet'` has no background/border/shadow at all. Mirrors
   * `CardProps['variant']` in the real component.
   * @default 'primary'
   */
  variant?: CardVariant;
  /**
   * The card's preview image/media, rendered full-bleed at the top (no padding), e.g. an
   * `<Image>` element. Mirrors the real component's `<CardPreview>` slot.
   */
  image?: ReactNode;
  /** The card's title, shown in bold. */
  title?: ReactNode;
  /** The card's description/body text, shown below the title. */
  description?: ReactNode;
  /** Extra content rendered below the description and above the footer. */
  children?: ReactNode;
  /** Footer content, typically a row of `Button`/`ActionButton`s, right- or space-between-aligned. */
  footer?: ReactNode;
  /** Whether the card shows a selected-state ring border. */
  isSelected?: boolean;
  /** Called when the card is pressed. If omitted, the Card renders as a plain (non-pressable) `View`. */
  onPress?: () => void;
  /** Accessibility label, forwarded to the underlying `Pressable` when `onPress` is provided. */
  accessibilityLabel?: string;
}

/**
 * A visual-only port of Spectrum 2's Card for React Native: a bordered/elevated container with an
 * optional image slot, title, description, and a footer actions row. Real source:
 * `packages/@react-spectrum/s2/src/Card.tsx`, which is a `react-aria-components` `GridListItem`
 * supporting selection, hover/press/focus visual states, quiet "preview bleeds to the card edge"
 * layouts, and several purpose-built subtypes (`AssetCard`/`UserCard`/`ProductCard`) — all of that
 * collection/selection machinery is out of scope here; this port is a single standalone card with
 * a plain `Pressable`/`View` and a simple `isSelected` boolean for the selection-ring visual only
 * (no actual multi-select collection state).
 */
export function Card(props: CardProps): React.ReactElement {
  let {
    size = 'M',
    variant = 'primary',
    image,
    title,
    description,
    children,
    footer,
    isSelected = false,
    onPress,
    accessibilityLabel
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let padding = cardPadding[size];
  let cornerRadius = cardRadius[size];

  // backgroundColor: primary -> the `elevated` surface color (approximated the same way
  // `Dialog.tsx` approximates its own `layer-2` surface: white in light mode, a lighter-than-
  // background gray in dark mode, since neither token has a numeric value in this port's
  // `tokens.ts`); secondary -> `layer-1`, approximated as a flat `gray-100` in both modes;
  // tertiary/quiet -> transparent (`Card.tsx` lines ~94-110).
  let backgroundColor: string;
  if (variant === 'tertiary' || variant === 'quiet') {
    backgroundColor = 'transparent';
  } else if (variant === 'secondary') {
    backgroundColor = getColor('gray-100', mode);
  } else {
    backgroundColor = mode === 'dark' ? getColor('gray-100', 'dark') : getColor('gray-25', 'light');
  }

  // tertiary renders its "border" via an inset box-shadow in the real component (`Card.tsx` lines
  // ~117-127, `[0 0 0 2px ...]`) rather than an actual border (to avoid affecting layout) — this
  // port just uses a real 2px border instead, since RN layout doesn't have that box-shadow subtlety
  // to worry about.
  let borderWidth = variant === 'tertiary' ? 2 : 0;
  let borderColor = variant === 'tertiary' ? getColor('gray-100', mode) : 'transparent';

  // `boxShadow: 'emphasized'` (`Card.tsx` line ~112) has no direct RN equivalent; approximated with
  // a small platform shadow/elevation on the filled (primary/secondary) variants only — tertiary
  // uses its border instead, and quiet has no boxShadow in the real source either.
  let hasShadow = variant === 'primary' || variant === 'secondary';

  let titleColor = getColor('gray-900', mode);
  let descriptionColor = getColor('gray-700', mode);

  let content = (
    <>
      {image != null && <View style={styles.imageSlot}>{image}</View>}
      <View style={{paddingHorizontal: padding, paddingTop: padding, paddingBottom: padding * 0.75, gap: contentGap[size]}}>
        {title != null &&
          (typeof title === 'string' ? (
            <Text
              style={{fontSize: titleFontSize[size], fontWeight: fontWeight.bold, color: titleColor}}
              numberOfLines={3}>
              {title}
            </Text>
          ) : (
            title
          ))}
        {description != null &&
          (typeof description === 'string' ? (
            <Text
              style={{fontSize: descriptionFontSize[size], color: descriptionColor}}
              numberOfLines={3}>
              {description}
            </Text>
          ) : (
            description
          ))}
        {children}
      </View>
      {footer != null && (
        <View style={[styles.footer, {paddingHorizontal: padding, paddingBottom: padding, paddingTop: padding * 0.75}]}>
          {footer}
        </View>
      )}
    </>
  );

  let outerStyle = [
    styles.card,
    {
      width: cardWidth[size],
      borderRadius: cornerRadius,
      backgroundColor,
      borderWidth,
      borderColor
    },
    hasShadow && styles.shadow,
    isSelected && {
      borderWidth: 2,
      borderColor: colors['gray-1000'][mode]
    }
  ];

  if (onPress != null) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{selected: isSelected}}
        onPress={onPress}
        style={({pressed}) => [...outerStyle, {opacity: pressed ? 0.9 : 1}]}>
        {content}
      </Pressable>
    );
  }

  return <View style={outerStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden'
  },
  imageSlot: {
    width: '100%',
    aspectRatio: 3 / 2
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8
  },
  shadow: {
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2
  }
});
