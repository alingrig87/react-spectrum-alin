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
import {ColorSchemeName, Pressable, StyleSheet, Text, useColorScheme} from 'react-native';
import {getColor, semanticColors} from '../theme/tokens';
import {Dialog} from './Dialog';

export type ContextualHelpVariant = 'info' | 'help';
export type ContextualHelpSize = 'XS' | 'S';

// The trigger's per-size diameter, from `actionControlHeight`'s own XS/S steps in tokens.ts (which
// in turn come from `controlSizeM` in `packages/@react-spectrum/s2/src/style-utils.ts`) — real
// ContextualHelp renders its trigger as an icon-only `ActionButton` (`ContextualHelp.tsx` lines
// ~197-207, `size` default `'XS'`), but this port draws a dedicated small circular glyph button
// here instead of reusing this repo's `ActionButton` component, since a real icon-only Spectrum
// button is a perfect circle/square (`aspectRatio: 'square'`) while this port's `ActionButton`
// always reserves `edgeToTextPaddingX` horizontal padding meant for a text label — not what a
// bare "?" glyph trigger should look like. Same spirit as `Dialog.tsx`'s own hand-drawn circular
// close button.
const triggerSize: Record<ContextualHelpSize, number> = {
  XS: 20,
  S: 24
};

const triggerGlyphFontSize: Record<ContextualHelpSize, number> = {
  XS: 12,
  S: 14
};

export interface ContextualHelpProps {
  /**
   * Indicates whether contents are informative or provide helpful guidance — swaps the trigger
   * glyph between "i" and "?". Mirrors `ContextualHelpStyleProps['variant']` in
   * `packages/@react-spectrum/s2/src/ContextualHelp.tsx`.
   * @default 'help'
   */
  variant?: ContextualHelpVariant;
  /**
   * The size of the trigger button.
   * @default 'XS'
   */
  size?: ContextualHelpSize;
  /** The popover's heading, shown in the reused `Dialog`'s title slot. */
  title?: ReactNode;
  /** The popover's body content. */
  children?: ReactNode;
  /** Optional footer content (e.g. a `Link` to more docs), shown below the body. */
  footer?: ReactNode;
  /**
   * Whether the popover is open by default (uncontrolled — this port has no controlled
   * `isOpen`/`onOpenChange` pair, matching `AccordionItem.tsx`'s `defaultExpanded`-only
   * convention rather than `Checkbox`/`TextField`'s fully-controlled one, since a help popover's
   * open state isn't normally something a parent screen needs to drive).
   * @default false
   */
  defaultOpen?: boolean;
  /** Whether the trigger is disabled. */
  isDisabled?: boolean;
  /**
   * Accessibility label for the trigger button.
   * @default 'Help' for variant='help', 'Information' for variant='info'
   */
  accessibilityLabel?: string;
}

/**
 * A visual-only port of Spectrum 2's ContextualHelp for React Native: a small "?"/"i" icon button
 * that, on press, shows a title + body popover. Real source:
 * `packages/@react-spectrum/s2/src/ContextualHelp.tsx`. The real component anchors a floating
 * `Popover` (`ContextualHelpPopover`, lines ~54-115: fixed `width: 268`, `padding: 24`,
 * `heading-xs` title font) next to the trigger via `DialogTrigger`/`react-aria-components`; per
 * this port's house style (no floating-popover/portal system — see `Dialog.tsx`'s own header
 * comment) this instead reuses the existing `Dialog` component at its smallest size ('S', 400px
 * wide) as a centered modal. That's a real fidelity gap worth calling out: the popover is both
 * wider (400 vs. 268) and centered instead of anchored beneath the trigger, and its title renders
 * at `Dialog`'s fixed large title style rather than the real `heading-xs` scale — accepted per the
 * task's explicit guidance to reuse `Dialog` for this component.
 */
export function ContextualHelp(props: ContextualHelpProps): React.ReactElement {
  let {
    variant = 'help',
    size = 'XS',
    title,
    children,
    footer,
    defaultOpen = false,
    isDisabled = false,
    accessibilityLabel
  } = props;

  let [isOpen, setIsOpen] = useState(defaultOpen);

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  // Trigger glyph/background colors: real icon-only quiet ActionButtons use `baseColor('neutral')`
  // (gray-800) for the icon and a transparent background at rest — see `ActionButton.tsx`'s own
  // `isQuiet` branch comment for the same token. A light `gray-100` fill is added here (absent in
  // the real quiet trigger) purely so the small circular glyph reads as a tappable control against
  // an arbitrary background, since this port has no hover state to hint interactivity otherwise.
  let glyphColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];
  let backgroundColor = getColor('gray-100', mode);

  let label = accessibilityLabel ?? (variant === 'info' ? 'Information' : 'Help');
  let glyph = variant === 'info' ? 'i' : '?';
  let diameter = triggerSize[size];

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{disabled: isDisabled}}
        disabled={isDisabled}
        onPress={() => setIsOpen(true)}
        style={({pressed}) => [
          styles.trigger,
          {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            backgroundColor,
            opacity: isDisabled ? 0.5 : pressed ? 0.7 : 1
          }
        ]}>
        <Text style={[styles.glyph, {fontSize: triggerGlyphFontSize[size], color: glyphColor}]}>{glyph}</Text>
      </Pressable>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} isDismissible size="S" title={title} footer={footer}>
        {children}
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  glyph: {
    fontWeight: '700',
    fontStyle: 'italic'
  }
});
