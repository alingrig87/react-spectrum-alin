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
import React, {useRef, useState} from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

export interface ColorWheelProps {
  /** The current hue (0-360). */
  value: number;
  /** Called as the user drags the thumb around the ring. */
  onChange?: (value: number) => void;
  /** Called when the user releases the thumb. */
  onChangeEnd?: (value: number) => void;
  /**
   * The overall diameter of the ColorWheel.
   * @default 192
   */
  size?: number;
  /** Whether the ColorWheel is disabled. */
  isDisabled?: boolean;
}

const DEFAULT_SIZE = 192; // ColorWheel.tsx line ~61: size = 192
const THICKNESS = 24; // ColorWheel.tsx line ~63: thickness = 24
const THUMB_SIZE = 16; // ColorHandle.tsx HANDLE_SIZE, line ~21.
// Number of angular wedges the ring is built from — a conic-gradient approximation, since RN/
// react-native-svg has no native conic/angular gradient primitive. 36 segments (10° each) is
// within the "24-36 segments reads as smooth enough" guidance.
const WEDGE_COUNT = 36;

/**
 * A visual-only port of Spectrum 2's ColorWheel for React Native. Real source:
 * `packages/@react-spectrum/s2/src/ColorWheel.tsx`: `outerRadius = Math.max(size, 175) / 2`
 * (lines ~61-64 — note the real component floors the usable radius at 175px regardless of a
 * smaller requested `size`, presumably for a minimum touch target; kept verbatim here) and
 * `thickness = 24`, giving `innerRadius = outerRadius - 24`. The two 1px `gray-1000/10` outlines
 * (outer ring edge, inner ring edge) come from the same file's `ColorWheelTrack`/inner-border
 * `<div>` (lines ~79-113); the 16px thumb from `ColorHandle.tsx`.
 *
 * The ring itself is drawn as `WEDGE_COUNT` solid-fill angular `<Path>` wedges (an annulus slice
 * per wedge, each filled with the pure hue color at its mid-angle) rather than a true conic
 * gradient, which `react-native-svg` doesn't support. Angle convention: 0°/`hue=0` is at 3
 * o'clock, increasing clockwise (standard screen coordinates — `y` grows downward — so this is
 * just `atan2`/`cos`/`sin` with no sign flips), used consistently for both the wedges and the
 * thumb position. Dragging sets the hue from the touch point's angle around the wheel's center
 * only; unlike the real `useColorWheel`, radial distance from center is ignored (dragging
 * anywhere, not just on the ring, moves the thumb) — a deliberate UX simplification for a plain
 * `PanResponder`.
 */
export function ColorWheel(props: ColorWheelProps): React.ReactElement {
  let {value, onChange, onChangeEnd, size = DEFAULT_SIZE, isDisabled = false} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  let [isDragging, setIsDragging] = useState(false);

  let outerRadius = Math.max(size, 175) / 2;
  let innerRadius = outerRadius - THICKNESS;
  let canvasSize = outerRadius * 2;

  let valueRef = useRef(value);
  valueRef.current = value;
  let configRef = useRef({isDisabled, onChange, onChangeEnd});
  configRef.current = {isDisabled, onChange, onChangeEnd};
  let wheelRef = useRef<View>(null);
  let center = useRef({x: 0, y: 0});

  function updateFromScreen(screenX: number, screenY: number) {
    let dx = screenX - center.current.x;
    let dy = screenY - center.current.y;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    let hue = Math.round(((angle % 360) + 360) % 360);
    if (hue !== valueRef.current) {
      valueRef.current = hue;
      configRef.current.onChange?.(hue);
    }
  }

  let panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !configRef.current.isDisabled,
      onMoveShouldSetPanResponder: () => !configRef.current.isDisabled,
      onPanResponderGrant: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        setIsDragging(true);
        wheelRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
          center.current = {x: pageX + width / 2, y: pageY + height / 2};
          updateFromScreen(gestureState.x0, gestureState.y0);
        });
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        updateFromScreen(gestureState.moveX, gestureState.moveY);
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

  let wedges: React.ReactElement[] = [];
  let step = 360 / WEDGE_COUNT;
  for (let i = 0; i < WEDGE_COUNT; i++) {
    let startAngle = i * step;
    let endAngle = startAngle + step;
    let midHue = startAngle + step / 2;
    wedges.push(
      <Path
        key={i}
        d={wedgePath(outerRadius, outerRadius, innerRadius, outerRadius, startAngle, endAngle)}
        fill={rgbToHex(hsbToRgb(midHue, 100, 100))}
      />
    );
  }

  let thumbRadius = outerRadius - THICKNESS / 2;
  let thumbAngleRad = (value * Math.PI) / 180;
  let thumbX = outerRadius + thumbRadius * Math.cos(thumbAngleRad);
  let thumbY = outerRadius + thumbRadius * Math.sin(thumbAngleRad);
  let thumbColorHex = rgbToHex(hsbToRgb(value, 100, 100));

  return (
    <View
      ref={wheelRef}
      style={{width: canvasSize, height: canvasSize, opacity: isDisabled ? 0.5 : 1}}
      {...panResponder.panHandlers}>
      <Svg width={canvasSize} height={canvasSize}>
        {wedges}
        {/* Outer ring edge, ColorWheel.tsx's `ColorWheelTrack` outline (`gray-1000/10`). */}
        <Circle
          cx={outerRadius}
          cy={outerRadius}
          r={outerRadius - 0.5}
          fill="none"
          stroke={grayAlpha(10, mode)}
          strokeWidth={1}
        />
        {/* Inner ring edge, ColorWheel.tsx's separate inner-border `<div>` outline. */}
        <Circle
          cx={outerRadius}
          cy={outerRadius}
          r={innerRadius + 0.5}
          fill="none"
          stroke={grayAlpha(10, mode)}
          strokeWidth={1}
        />
      </Svg>
      <View
        pointerEvents="none"
        style={[
          styles.thumb,
          {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            left: thumbX - THUMB_SIZE / 2,
            top: thumbY - THUMB_SIZE / 2,
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

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): {x: number; y: number} {
  let rad = (angleDeg * Math.PI) / 180;
  return {x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad)};
}

/** Builds a single annular wedge (a slice of the ring between `innerR` and `outerR`, from
 * `startAngle` to `endAngle`) as an SVG path — the building block of the wedge-based conic-
 * gradient approximation described in the file doc comment above. */
function wedgePath(cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number): string {
  let outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  let outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  let innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  let innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z'
  ].join(' ');
}

const styles = StyleSheet.create({
  thumb: {
    position: 'absolute',
    borderWidth: 2
  }
});
