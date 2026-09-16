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

import React, {useRef, useState} from 'react';
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
import {
  controlFontSize,
  ControlSize,
  getColor,
  radius,
  semanticColors,
  sliderBarHeight,
  sliderThumbSize,
  sliderTrackHeight
} from '../theme/tokens';

export type SliderSize = ControlSize;

export interface SliderProps {
  /** The current value (controlled). */
  value: number;
  /** Called as the user drags the thumb. */
  onChange?: (value: number) => void;
  /** Called when the user releases the thumb. */
  onChangeEnd?: (value: number) => void;
  /**
   * The slider's minimum value.
   * @default 0
   */
  minValue?: number;
  /**
   * The slider's maximum value.
   * @default 100
   */
  maxValue?: number;
  /**
   * The increment the thumb snaps to while dragging.
   * @default 1
   */
  step?: number;
  /** An optional label, displayed above the track with the current value. */
  label?: string;
  /**
   * The size of the Slider.
   * @default 'M'
   */
  size?: SliderSize;
  /** Whether the Slider should be displayed with an emphasized (accent) fill. */
  isEmphasized?: boolean;
  /** Whether the slider is disabled. */
  isDisabled?: boolean;
}

/**
 * A visual-only port of Spectrum 2's Slider for React Native (single-thumb only; the real
 * component's two-thumb `RangeSlider` variant isn't ported). Per-size dimensions are lifted from
 * `packages/@react-spectrum/s2/src/Slider.tsx`: the track hit-area height (`track`, lines
 * ~173-185, identical to `controlHeight`), the visible bar's thickness/radius (`trackStyling`,
 * lines ~287-301 — only the default `trackStyle="thin"` case is ported, see `sliderBarHeight` in
 * `../theme/tokens.ts`), and the thumb diameter (`thumb`, lines ~225-285, default `thumbStyle`
 * only). Dragging is implemented with a RN `PanResponder` measuring the track's on-screen
 * position, in place of react-aria's `useSlider`/keyboard-arrow/DOM-pointer handling.
 */
export function Slider(props: SliderProps): React.ReactElement {
  let {
    value,
    onChange,
    onChangeEnd,
    minValue = 0,
    maxValue = 100,
    step = 1,
    label,
    size = 'M',
    isEmphasized = false,
    isDisabled = false
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isDragging, setIsDragging] = useState(false);

  let trackHeight = sliderTrackHeight[size];
  let thumbSize = sliderThumbSize[size];
  let fontSize = controlFontSize[size];

  // Mutable latest-props refs so the PanResponder (created once) always reads current values
  // without needing to be recreated on every render.
  let valueRef = useRef(value);
  valueRef.current = value;
  let configRef = useRef({minValue, maxValue, step, isDisabled, onChange, onChangeEnd});
  configRef.current = {minValue, maxValue, step, isDisabled, onChange, onChangeEnd};
  let trackRef = useRef<View>(null);
  let trackPageX = useRef(0);
  let trackWidth = useRef(0);

  function clampToStep(raw: number): number {
    let {minValue: min, maxValue: max, step: s} = configRef.current;
    let stepped = Math.round((raw - min) / s) * s + min;
    return Math.min(max, Math.max(min, stepped));
  }

  function updateFromScreenX(screenX: number) {
    if (trackWidth.current <= 0) {
      return;
    }
    let {minValue: min, maxValue: max, onChange: change} = configRef.current;
    let ratio = Math.min(1, Math.max(0, (screenX - trackPageX.current) / trackWidth.current));
    let next = clampToStep(min + ratio * (max - min));
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
          trackWidth.current = width;
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
    trackWidth.current = e.nativeEvent.layout.width;
  }

  let percent = maxValue > minValue ? (Math.min(maxValue, Math.max(minValue, value)) - minValue) / (maxValue - minValue) : 0;

  // upperTrack/filledTrack colors lifted from Slider.tsx lines ~303-358: background bar gray-300,
  // fill gray-700 default / accent-900 when isEmphasized. thumb border lifted from lines ~271-280:
  // gray-800 default, gray-900 while hovered/dragging (approximated here from `isDragging` local
  // state only, since RN has no hover), 'disabled' (gray-400) when isDisabled.
  let barColor = getColor('gray-300', mode);
  let fillColor = isDisabled
    ? semanticColors.disabledBackground[mode]
    : isEmphasized
      ? getColor('accent-900', mode)
      : getColor('gray-700', mode);
  let thumbBorderColor = isDisabled
    ? semanticColors.disabledBorder[mode]
    : isDragging
      ? getColor('gray-900', mode)
      : getColor('gray-800', mode);
  let labelColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];

  return (
    <View style={styles.container}>
      {label != null && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, {fontSize, color: labelColor}]}>{label}</Text>
          <Text style={[styles.label, {fontSize, color: labelColor}]}>{Math.round(value)}</Text>
        </View>
      )}
      <View
        ref={trackRef}
        onLayout={handleTrackLayout}
        style={[styles.trackHitArea, {height: trackHeight}]}
        {...panResponder.panHandlers}>
        <View style={[styles.bar, {height: sliderBarHeight, borderRadius: radius.lg, backgroundColor: barColor}]}>
          <View
            style={[
              styles.fill,
              {
                width: `${percent * 100}%`,
                height: sliderBarHeight,
                borderRadius: radius.lg,
                backgroundColor: fillColor
              }
            ]}
          />
        </View>
        <View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              borderWidth: 2,
              borderColor: thumbBorderColor,
              backgroundColor: getColor('gray-25', mode),
              left: `${percent * 100}%`,
              marginStart: -thumbSize / 2,
              marginTop: -thumbSize / 2
            }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  label: {
    fontWeight: '500'
  },
  trackHitArea: {
    justifyContent: 'center'
  },
  bar: {
    width: '100%',
    overflow: 'hidden'
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0
  },
  thumb: {
    position: 'absolute',
    top: '50%'
  }
});
