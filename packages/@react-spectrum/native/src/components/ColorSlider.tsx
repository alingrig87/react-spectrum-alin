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
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import {controlFontSize, getColor, radius, semanticColors} from '../theme/tokens';
import {grayAlpha, hsbToRgb, rgbToHex} from '../utils/color';
import React, {useRef, useState} from 'react';
import Svg, {Defs, LinearGradient, Pattern, Rect, Stop} from 'react-native-svg';

/** Which channel of the color this slider edits. `hue`/`saturation`/`brightness` model an HSB
 * color; `alpha` models opacity. (S2's ColorSlider also supports raw RGB/HSL channels — dropped
 * here as an intentional simplification, same spirit as Slider's dropped `thumbStyle="precise"`.) */
export type ColorSliderChannel = 'hue' | 'saturation' | 'brightness' | 'alpha';

export interface ColorSliderProps {
  /** Which channel this slider controls. */
  channel: ColorSliderChannel;
  /** The current value of `channel` (0-360 for `hue`, 0-100 for the others). */
  value: number;
  /** Called as the user drags the thumb. */
  onChange?: (value: number) => void;
  /** Called when the user releases the thumb. */
  onChangeEnd?: (value: number) => void;
  /** The color's hue (0-360), used as context to render `saturation`/`brightness`/`alpha` gradients. */
  hue?: number;
  /** The color's saturation (0-100), used as context to render `brightness`/`alpha` gradients. */
  saturation?: number;
  /** The color's brightness (0-100), used as context to render `alpha` gradients. */
  brightness?: number;
  /** An optional label, displayed above the track with the current value. */
  label?: string;
  /** Whether the slider is disabled. */
  isDisabled?: boolean;
}

// Track width/height, lifted from the `width`/`height` style map in
// `packages/@react-spectrum/s2/src/ColorSlider.tsx` (lines ~76-90) — only the (default)
// horizontal orientation is ported, matching the S2 file's own note that the visible label is
// hidden in the vertical orientation.
const TRACK_WIDTH = 192;
const TRACK_HEIGHT = 24;
// ColorHandle.tsx HANDLE_SIZE (line ~21) — the shared thumb size used by ColorSlider/ColorArea/
// ColorWheel's `<ColorHandle>` in the real S2 source.
const THUMB_SIZE = 16;

/**
 * A visual-only port of Spectrum 2's ColorSlider for React Native. Real source:
 * `packages/@react-spectrum/s2/src/ColorSlider.tsx` (track sizing, `borderRadius: 'default'`
 * i.e. `radius.md` from `tokens.ts`, `outlineColor: 'gray-1000/10'`) plus `ColorHandle.tsx`
 * (16px thumb, 2px white border, 1px `black/42` outline). Dragging uses the same
 * `PanResponder` + `View.measure` pattern as the plain `Slider` component, in place of react-
 * aria's `useColorSlider`/keyboard handling. The gradient track is drawn with
 * `react-native-svg`'s `<LinearGradient>`; for the `alpha` channel a small tiled `<Pattern>`
 * checkerboard (same technique — and same coarse-approximation caveat — as `ColorHandle.tsx`'s
 * `ColorLoupe`, just sized down) is layered behind the gradient so the transparency reads
 * correctly.
 */
export function ColorSlider(props: ColorSliderProps): React.ReactElement {
  let {
    channel,
    value,
    onChange,
    onChangeEnd,
    hue = 0,
    saturation = 100,
    brightness = 100,
    label,
    isDisabled = false
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isDragging, setIsDragging] = useState(false);

  let minValue = 0;
  let maxValue = channel === 'hue' ? 360 : 100;
  let fontSize = controlFontSize.M;

  let valueRef = useRef(value);
  valueRef.current = value;
  let configRef = useRef({minValue, maxValue, isDisabled, onChange, onChangeEnd});
  configRef.current = {minValue, maxValue, isDisabled, onChange, onChangeEnd};
  let trackRef = useRef<View>(null);
  let trackPageX = useRef(0);
  let trackWidthPx = useRef(0);

  function updateFromScreenX(screenX: number) {
    if (trackWidthPx.current <= 0) {
      return;
    }
    let {minValue: min, maxValue: max, onChange: change} = configRef.current;
    let ratio = Math.min(1, Math.max(0, (screenX - trackPageX.current) / trackWidthPx.current));
    let next = Math.round(min + ratio * (max - min));
    if (next !== valueRef.current) {
      valueRef.current = next;
      change?.(next);
    }
  }

  let panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !configRef.current.isDisabled,
      onMoveShouldSetPanResponder: () => !configRef.current.isDisabled,
      onPanResponderGrant: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        setIsDragging(true);
        trackRef.current?.measure((_x, _y, width, _height, pageX) => {
          trackWidthPx.current = width;
          trackPageX.current = pageX;
          updateFromScreenX(gestureState.x0);
        });
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        updateFromScreenX(gestureState.moveX);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        configRef.current.onChangeEnd?.(valueRef.current);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      }
    })
  ).current;

  function handleTrackLayout(e: LayoutChangeEvent) {
    trackWidthPx.current = e.nativeEvent.layout.width;
  }

  let percent = (Math.min(maxValue, Math.max(minValue, value)) - minValue) / (maxValue - minValue);

  let gradientId = `colorSliderGradient-${channel}`;
  let checkerId = `colorSliderChecker-${channel}`;
  let stops = buildStops(channel, hue, saturation, brightness);
  let thumbColorHex = channelThumbColor(channel, hue, saturation, brightness, value);
  let labelColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];

  return (
    <View style={styles.container}>
      {label != null && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, {fontSize, color: labelColor}]}>{label}</Text>
          <Text style={[styles.label, {fontSize, color: labelColor}]}>
            {channel === 'hue' ? `${Math.round(value)}°` : `${Math.round(value)}%`}
          </Text>
        </View>
      )}
      <View
        ref={trackRef}
        onLayout={handleTrackLayout}
        style={[
          styles.track,
          {
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: grayAlpha(10, mode),
            opacity: isDisabled ? 0.5 : 1
          }
        ]}
        {...panResponder.panHandlers}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            {channel === 'alpha' && (
              <Pattern id={checkerId} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <Rect fill="#FFFFFF" x="0" y="0" width="8" height="8" />
                <Rect fill="#E1E1E1" x="0" y="0" width="4" height="4" />
                <Rect fill="#E1E1E1" x="4" y="4" width="4" height="4" />
              </Pattern>
            )}
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              {stops.map((stop, i) => (
                <Stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />
              ))}
            </LinearGradient>
          </Defs>
          {channel === 'alpha' && <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${checkerId})`} />}
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradientId})`} />
        </Svg>
        <View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              left: `${percent * 100}%`,
              marginStart: -THUMB_SIZE / 2,
              marginTop: -THUMB_SIZE / 2,
              backgroundColor: thumbColorHex,
              borderColor: isDisabled ? semanticColors.disabledBorder[mode] : '#FFFFFF',
              // Extra ring approximating ColorHandle.tsx's `outlineColor: 'black/42'` (RN has no
              // separate outline; a second border-ish shadow ring is approximated with elevation-
              // free `borderWidth` layering isn't possible on one View, so a subtle shadow stands in).
              shadowColor: isDragging ? getColor('gray-900', mode) : 'rgba(0,0,0,0.42)',
              shadowOpacity: 1,
              shadowRadius: 1,
              shadowOffset: {width: 0, height: 0}
            }
          ]}
        />
      </View>
    </View>
  );
}

interface GradientStop {
  offset: string;
  color: string;
  opacity: number;
}

function buildStops(channel: ColorSliderChannel, hue: number, saturation: number, brightness: number): GradientStop[] {
  switch (channel) {
    case 'hue': {
      // 7 stops at 60° increments -- enough for a linear gradient to read as a smooth hue ramp.
      let stops: GradientStop[] = [];
      for (let h = 0; h <= 360; h += 60) {
        stops.push({offset: `${(h / 360) * 100}%`, color: rgbToHex(hsbToRgb(h, 100, 100)), opacity: 1});
      }
      return stops;
    }
    case 'saturation':
      return [
        {offset: '0%', color: rgbToHex(hsbToRgb(hue, 0, brightness)), opacity: 1},
        {offset: '100%', color: rgbToHex(hsbToRgb(hue, 100, brightness)), opacity: 1}
      ];
    case 'brightness':
      return [
        {offset: '0%', color: rgbToHex(hsbToRgb(hue, saturation, 0)), opacity: 1},
        {offset: '100%', color: rgbToHex(hsbToRgb(hue, saturation, 100)), opacity: 1}
      ];
    case 'alpha': {
      let hex = rgbToHex(hsbToRgb(hue, saturation, brightness));
      return [
        {offset: '0%', color: hex, opacity: 0},
        {offset: '100%', color: hex, opacity: 1}
      ];
    }
  }
}

function channelThumbColor(channel: ColorSliderChannel, hue: number, saturation: number, brightness: number, value: number): string {
  switch (channel) {
    case 'hue':
      return rgbToHex(hsbToRgb(value, 100, 100));
    case 'saturation':
      return rgbToHex(hsbToRgb(hue, value, brightness));
    case 'brightness':
      return rgbToHex(hsbToRgb(hue, saturation, value));
    case 'alpha':
      return rgbToHex(hsbToRgb(hue, saturation, brightness));
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start'
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    width: TRACK_WIDTH
  },
  label: {
    fontWeight: '500'
  },
  track: {
    justifyContent: 'center',
    overflow: 'hidden'
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    borderWidth: 2
  }
});
