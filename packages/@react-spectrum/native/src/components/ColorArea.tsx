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
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  useColorScheme,
  View
} from 'react-native';
import {grayAlpha, hsbToRgb, rgbToHex} from '../utils/color';
import {radius, semanticColors} from '../theme/tokens';
import React, {useRef, useState} from 'react';
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';

export interface ColorAreaProps {
  /** The color's hue (0-360). ColorArea edits saturation x brightness at this fixed hue. */
  hue?: number;
  /** The current saturation (0-100, x axis). */
  saturation: number;
  /** The current brightness (0-100, y axis; 100 at the top, 0 at the bottom). */
  brightness: number;
  /** Called as the user drags the thumb. */
  onChange?: (value: {saturation: number; brightness: number}) => void;
  /** Called when the user releases the thumb. */
  onChangeEnd?: (value: {saturation: number; brightness: number}) => void;
  /**
   * The size (both width and height — ColorArea is always square) of the ColorArea.
   * @default 192
   */
  size?: number;
  /** Whether the ColorArea is disabled. */
  isDisabled?: boolean;
}

const DEFAULT_SIZE = 192; // ColorArea.tsx line ~67: size: 192
const THUMB_SIZE = 16; // ColorHandle.tsx HANDLE_SIZE, line ~21.

/**
 * A visual-only port of Spectrum 2's ColorArea for React Native. Real source:
 * `packages/@react-spectrum/s2/src/ColorArea.tsx` (192px default size, `borderRadius: 'default'`
 * i.e. `radius.md`, `outlineColor: 'gray-1000/10'`) plus `ColorHandle.tsx` (16px thumb).
 *
 * This models a fixed saturation (x) x brightness (y) HSB square at a caller-supplied hue — the
 * real component's `xChannel`/`yChannel`/`colorSpace` flexibility (RGB/HSL/HSB, any channel pair)
 * is dropped since a visual-only port only needs one representative gradient square, not the full
 * channel matrix. The gradient itself is the standard two-layer approximation most color pickers
 * use: a horizontal `react-native-svg` `<LinearGradient>` from white (saturation 0) to the pure
 * hue color (saturation 100), with a second vertical gradient layered on top going from
 * transparent (brightness 100, at the top) to opaque black (brightness 0, at the bottom). It is
 * visually very close to a true HSB square but isn't colorimetrically exact (a true HSB square's
 * hue channel also interacts with the vertical axis; this two-layer version keeps hue constant
 * top-to-bottom).
 */
export function ColorArea(props: ColorAreaProps): React.ReactElement {
  let {hue = 0, saturation, brightness, onChange, onChangeEnd, size = DEFAULT_SIZE, isDisabled = false} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isDragging, setIsDragging] = useState(false);

  let stateRef = useRef({saturation, brightness});
  stateRef.current = {saturation, brightness};
  let configRef = useRef({isDisabled, onChange, onChangeEnd});
  configRef.current = {isDisabled, onChange, onChangeEnd};
  let areaRef = useRef<View>(null);
  let areaOrigin = useRef({x: 0, y: 0});
  let areaSize = useRef({width: size, height: size});

  function updateFromScreen(screenX: number, screenY: number) {
    let {width, height} = areaSize.current;
    if (width <= 0 || height <= 0) {
      return;
    }
    let x = Math.min(1, Math.max(0, (screenX - areaOrigin.current.x) / width));
    let y = Math.min(1, Math.max(0, (screenY - areaOrigin.current.y) / height));
    let nextSaturation = Math.round(x * 100);
    let nextBrightness = Math.round((1 - y) * 100);
    let {saturation: curS, brightness: curB} = stateRef.current;
    if (nextSaturation !== curS || nextBrightness !== curB) {
      stateRef.current = {saturation: nextSaturation, brightness: nextBrightness};
      configRef.current.onChange?.({saturation: nextSaturation, brightness: nextBrightness});
    }
  }

  let panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !configRef.current.isDisabled,
      onMoveShouldSetPanResponder: () => !configRef.current.isDisabled,
      onPanResponderGrant: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        setIsDragging(true);
        areaRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
          areaSize.current = {width, height};
          areaOrigin.current = {x: pageX, y: pageY};
          updateFromScreen(gestureState.x0, gestureState.y0);
        });
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        updateFromScreen(gestureState.moveX, gestureState.moveY);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        configRef.current.onChangeEnd?.(stateRef.current);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      }
    })
  ).current;

  let hueHex = rgbToHex(hsbToRgb(hue, 100, 100));
  let thumbColorHex = rgbToHex(hsbToRgb(hue, saturation, brightness));
  let thumbLeft = (Math.min(100, Math.max(0, saturation)) / 100) * size;
  let thumbTop = (1 - Math.min(100, Math.max(0, brightness)) / 100) * size;

  return (
    <View
      ref={areaRef}
      style={[
        styles.area,
        {
          width: size,
          height: size,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: grayAlpha(10, mode),
          backgroundColor: isDisabled ? semanticColors.disabledBackground[mode] : undefined,
          opacity: isDisabled ? 0.6 : 1
        }
      ]}
      {...panResponder.panHandlers}>
      {!isDisabled && (
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="colorAreaSaturation" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
              <Stop offset="100%" stopColor={hueHex} stopOpacity={1} />
            </LinearGradient>
            <LinearGradient id="colorAreaBrightness" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#000000" stopOpacity={0} />
              <Stop offset="100%" stopColor="#000000" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#colorAreaSaturation)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#colorAreaBrightness)" />
        </Svg>
      )}
      <View
        pointerEvents="none"
        style={[
          styles.thumb,
          {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            left: thumbLeft - THUMB_SIZE / 2,
            top: thumbTop - THUMB_SIZE / 2,
            backgroundColor: thumbColorHex,
            borderColor: '#FFFFFF',
            shadowColor: isDragging ? '#000000' : 'rgba(0,0,0,0.42)',
            shadowOpacity: 1,
            shadowRadius: 1,
            shadowOffset: {width: 0, height: 0}
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    position: 'relative',
    overflow: 'hidden'
  },
  thumb: {
    position: 'absolute',
    borderWidth: 2
  }
});
