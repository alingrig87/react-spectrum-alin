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
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import {colors, fontWeight, getColor, radius, semanticColors, spacing} from '../theme/tokens';

export type DialogSize = 'S' | 'M' | 'L' | 'XL';

/**
 * Dialog width per size, straight from the `size` branch of `RACModal`'s `width` style in
 * `packages/@react-spectrum/s2/src/Modal.tsx` (lines ~108-118: S 400, M 480, L 640, XL 960 — the
 * source comments these as "copied from designs, not sure if correct", so they're the real numbers
 * S2 itself ships, not an approximation on our end). The real component also caps `maxWidth: '90vw'`
 * (line ~126), which we mirror with a percentage `maxWidth` below since RN has no viewport unit.
 */
const dialogWidth: Record<DialogSize, number> = {
  S: 400,
  M: 480,
  L: 640,
  XL: 960
};

export interface DialogProps {
  /** Whether the Dialog is visible. */
  isOpen: boolean;
  /** Called when the dialog should close (backdrop tap when dismissible, or the close button). */
  onClose?: () => void;
  /** The dialog's heading, shown in bold at the top of the card. */
  title?: ReactNode;
  /** The dialog's body content. Wrapped in a `ScrollView` so long content can scroll. */
  children?: ReactNode;
  /** Optional footer content, typically a row of `Button`s — right-aligned like the real ButtonGroup slot. */
  footer?: ReactNode;
  /**
   * Whether the Dialog shows a close ("×") button and can be dismissed by tapping the backdrop.
   * Mirrors `DialogProps['isDismissible']` in `packages/@react-spectrum/s2/src/Dialog.tsx`.
   */
  isDismissible?: boolean;
  /**
   * The size of the Dialog.
   * @default 'M'
   */
  size?: DialogSize;
}

/**
 * A visual-only port of Spectrum 2's Dialog for React Native: a dimmed backdrop with a centered
 * card containing a title, body content, and an optional footer button row. Built on RN's built-in
 * `Modal` (`transparent` + `animationType="fade"`) rather than a custom portal system, per this
 * port's house style — real S2 uses `ModalOverlay`/`RACModal` from react-aria-components, which
 * this trades for a plain RN `Modal` + `Pressable` backdrop (no focus trap, no `Escape`-key
 * handling — RN has no keyboard events on mobile — tapping the dimmed backdrop is the dismiss
 * gesture instead).
 *
 * Sizing/padding values are lifted from the real source:
 * - Card width per size, `maxWidth: 90vw`, `borderRadius: 'xl'` (16, matches `radius.xl` in
 *   tokens.ts) and `maxHeight: '90%'`: `Modal.tsx` lines ~101-133.
 * - Header/content/footer padding (32 = `spacing[500]`, the close-button top margin of 12 =
 *   `spacing[200]`): `Dialog.tsx` lines ~144-160 (header wrapper), ~68-83 (content, `paddingX: 32`),
 *   ~223-239 (footer, `paddingX/paddingBottom/paddingTop: 32`, `gap: 24`).
 * - Backdrop color: real S2 uses the `transparent-black-500` token (`Modal.tsx` line ~41), whose
 *   exact opacity isn't resolvable from this shallow clone (no `@adobe/spectrum-tokens` package
 *   present to read `variables.json` from) — approximated here as a conventional ~40%/55% black
 *   scrim for light/dark mode.
 * - The `layer-2` elevated-surface background (`Modal.tsx` line ~147) has no numeric token in this
 *   port's `tokens.ts` either; approximated as white in light mode (`colors['gray-25'].light`,
 *   already used as the surface color for TextField/Checkbox) and `colors['gray-100'].dark` in dark
 *   mode — a lighter shade than the app background so the card still reads as "elevated" against a
 *   near-black dark background, rather than reusing `gray-25`'s own near-black dark value.
 */
export function Dialog(props: DialogProps): React.ReactElement {
  let {isOpen, onClose, title, children, footer, isDismissible = false, size = 'M'} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let surfaceBackground = mode === 'dark' ? getColor('gray-100', 'dark') : getColor('gray-25', 'light');
  let backdropColor = mode === 'dark' ? 'rgba(0, 0, 0, 0.55)' : 'rgba(0, 0, 0, 0.4)';
  let titleColor = semanticColors.neutralContent[mode];
  let bodyColor = getColor('gray-800', mode);

  function handleBackdropPress() {
    if (isDismissible) {
      onClose?.();
    }
  }

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, {backgroundColor: backdropColor}]}
        onPress={handleBackdropPress}>
        {/* A no-op onPress on the card itself claims the touch responder so taps inside the card
            don't bubble up to the backdrop `Pressable` above and dismiss the dialog. */}
        <Pressable
          onPress={() => {}}
          style={[
            styles.card,
            {
              width: dialogWidth[size],
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: radius.xl,
              backgroundColor: surfaceBackground
            }
          ]}>
          {(title != null || isDismissible) && (
            <View style={[styles.header, {paddingTop: spacing[500], paddingBottom: spacing[300]}]}>
              <View style={styles.headerTitle}>
                {typeof title === 'string' ? (
                  <Text style={[styles.title, {color: titleColor}]}>{title}</Text>
                ) : (
                  title
                )}
              </View>
              {isDismissible && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  onPress={onClose}
                  style={({pressed}) => [styles.closeButton, {opacity: pressed ? 0.6 : 1}]}>
                  <Text style={[styles.closeGlyph, {color: titleColor}]}>×</Text>
                </Pressable>
              )}
            </View>
          )}
          {children != null && (
            <ScrollView
              style={styles.content}
              contentContainerStyle={{paddingHorizontal: spacing[500], paddingBottom: spacing[500]}}>
              {typeof children === 'string' ? (
                <Text style={[styles.body, {color: bodyColor}]}>{children}</Text>
              ) : (
                children
              )}
            </ScrollView>
          )}
          {footer != null && (
            <View
              style={[
                styles.footer,
                {
                  paddingHorizontal: spacing[500],
                  paddingTop: spacing[400],
                  paddingBottom: spacing[500],
                  gap: spacing[300]
                }
              ]}>
              {footer}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 32
  },
  headerTitle: {
    flex: 1
  },
  title: {
    fontSize: 25, // title-2xl, see file header comment
    fontWeight: fontWeight.bold
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 12
  },
  closeGlyph: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    lineHeight: 20
  },
  content: {
    flexGrow: 0,
    flexShrink: 1
  },
  body: {
    fontSize: 14,
    lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});
