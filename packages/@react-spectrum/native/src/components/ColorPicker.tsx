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

import {
  ColorSchemeName,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import {ColorArea} from './ColorArea';
import {ColorField} from './ColorField';
import {ColorSlider} from './ColorSlider';
import {ColorSwatch, ColorSwatchSize} from './ColorSwatch';
import {getColor, semanticColors, spacing} from '../theme/tokens';
import {grayAlpha, hsbToRgb, parseColor, rgbaToHex, rgbToHsb} from '../utils/color';
import React, {useEffect, useState} from 'react';

export interface ColorPickerProps {
  /** The current color, as a `#RGB`/`#RRGGBB`/`#RRGGBBAA` hex string (controlled). */
  value: string;
  /** Called with the new hex string whenever the color changes, from any control in the popover. */
  onChange?: (value: string) => void;
  /** An optional label, displayed next to the swatch trigger. */
  label?: string;
  /**
   * The size of the ColorSwatch trigger.
   * @default 'M'
   */
  size?: ColorSwatchSize;
  /** Whether the color picker is disabled. */
  isDisabled?: boolean;
}

/**
 * A visual-only port of Spectrum 2's ColorPicker for React Native.
 *
 * Note on "real source": unlike the other five components in this family, S2 doesn't actually
 * ship a `packages/@react-spectrum/s2/src/ColorPicker.tsx` — searched for one and confirmed it
 * doesn't exist; S2's `ColorSwatch`/`ColorArea`/`ColorSlider`/`ColorField` are meant to be
 * composed by the consumer into their own trigger + popover (see the older, non-S2
 * `packages/@adobe/react-spectrum/src/color/ColorPicker.tsx` for the shape this follows: an
 * `AriaColorPicker` wrapping a `ColorSwatch`-in-a-`Button` trigger + `DialogTrigger`
 * `type="popover"` + `Dialog`). This RN port follows that same composition shape — a
 * `ColorSwatch` `Pressable` trigger that opens a popover containing `ColorArea` + two
 * `ColorSlider`s (hue, alpha) + a `ColorField` — using it as the blueprint for which controls
 * belong together, not for pixel values (it predates S2 entirely, using the old style-macro-s1).
 *
 * No `Dialog`/`Modal`-based RN component exists yet from a concurrent batch (checked
 * `packages/@react-spectrum/native/src/components/` — none present at the time this was
 * written), so the popover itself is a minimal one built directly on RN's own `Modal`: a
 * translucent full-screen backdrop `Pressable` (tap to dismiss) behind a centered card. This is a
 * deliberate simplification of a real anchored Popover (which would appear next to the swatch and
 * reposition to stay on-screen) — RN's `Modal` has no built-in anchoring to a trigger's on-screen
 * position, and reimplementing that (measuring the trigger, tracking scroll/rotation) was judged
 * out of scope for a visual-only popover whose actual content (ColorArea/ColorSlider/ColorField)
 * is the point of this task.
 */
export function ColorPicker(props: ColorPickerProps): React.ReactElement {
  let {value, onChange, label, size = 'M', isDisabled = false} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isOpen, setIsOpen] = useState(false);

  let initial = parseColor(value) ?? {r: 255, g: 0, b: 0, a: 1};
  let initialHsb = rgbToHsb(initial.r, initial.g, initial.b);
  let [hue, setHue] = useState(initialHsb.h);
  let [saturation, setSaturation] = useState(initialHsb.s);
  let [brightness, setBrightness] = useState(initialHsb.b);
  let [alpha, setAlpha] = useState(initial.a * 100);

  // Resync from an externally-driven `value` change (e.g. a parent resetting the color). Doesn't
  // try to distinguish "external change" from "our own last onChange echoed back" beyond the
  // value comparison react runs on every render via useEffect's dependency array.
  useEffect(() => {
    let parsed = parseColor(value);
    if (parsed) {
      let hsb = rgbToHsb(parsed.r, parsed.g, parsed.b);
      setHue(hsb.h);
      setSaturation(hsb.s);
      setBrightness(hsb.b);
      setAlpha(parsed.a * 100);
    }
  }, [value]);

  let currentHex = rgbaToHex({...hsbToRgb(hue, saturation, brightness), a: alpha / 100});

  function commit(nextHue: number, nextSaturation: number, nextBrightness: number, nextAlpha: number) {
    onChange?.(rgbaToHex({...hsbToRgb(nextHue, nextSaturation, nextBrightness), a: nextAlpha / 100}));
  }

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={isDisabled}
        onPress={() => setIsOpen(true)}
        style={({pressed}) => ({opacity: pressed && !isDisabled ? 0.85 : isDisabled ? 0.5 : 1})}>
        <ColorSwatch color={currentHex} size={size} />
      </Pressable>
      {label != null && (
        <Text style={[styles.label, {color: semanticColors.neutralContent[mode]}]}>{label}</Text>
      )}

      <Modal transparent visible={isOpen} animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)} accessibilityLabel="Dismiss color picker" />
        <View style={styles.popoverWrap} pointerEvents="box-none">
          <View
            style={[
              styles.popover,
              {
                backgroundColor: getColor('gray-25', mode),
                borderColor: grayAlpha(10, mode)
              }
            ]}>
            <ColorArea
              hue={hue}
              saturation={saturation}
              brightness={brightness}
              onChange={({saturation: s, brightness: b}) => {
                setSaturation(s);
                setBrightness(b);
                commit(hue, s, b, alpha);
              }}
            />
            <ColorSlider
              channel="hue"
              value={hue}
              label="Hue"
              onChange={h => {
                setHue(h);
                commit(h, saturation, brightness, alpha);
              }}
            />
            <ColorSlider
              channel="alpha"
              value={alpha}
              hue={hue}
              saturation={saturation}
              brightness={brightness}
              label="Opacity"
              onChange={a => {
                setAlpha(a);
                commit(hue, saturation, brightness, a);
              }}
            />
            <ColorField
              value={currentHex}
              label="Hex"
              onChange={hex => {
                let parsed = parseColor(hex);
                if (parsed) {
                  let hsb = rgbToHsb(parsed.r, parsed.g, parsed.b);
                  setHue(hsb.h);
                  setSaturation(hsb.s);
                  setBrightness(hsb.b);
                  setAlpha(parsed.a * 100);
                  onChange?.(hex);
                }
              }}
            />
            <Pressable onPress={() => setIsOpen(false)} style={styles.doneButton}>
              <Text style={[styles.doneText, {color: getColor('accent-900', mode)}]}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing[100]
  },
  label: {
    fontSize: 14,
    fontWeight: '500'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  popoverWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  popover: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing[300],
    gap: spacing[300],
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 8
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing[75],
    paddingHorizontal: spacing[200]
  },
  doneText: {
    fontSize: 14,
    fontWeight: '700'
  }
});
