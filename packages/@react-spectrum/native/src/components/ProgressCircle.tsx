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

import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, ColorSchemeName, Easing, useColorScheme} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {getColor, progressCircleSize, progressCircleStrokeWidth, ProgressCircleSize} from '../theme/tokens';

export type {ProgressCircleSize};

export interface ProgressCircleProps {
  /**
   * The current value.
   * @default 0
   */
  value?: number;
  /**
   * The minimum value.
   * @default 0
   */
  minValue?: number;
  /**
   * The maximum value.
   * @default 100
   */
  maxValue?: number;
  /** Whether presentation is indeterminate when progress isn't known. */
  isIndeterminate?: boolean;
  /**
   * The size of the ProgressCircle.
   * @default 'M'
   */
  size?: ProgressCircleSize;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * A visual-only port of Spectrum 2's ProgressCircle for React Native, using `react-native-svg`.
 * Diameter and stroke width per size come straight from `wrapper`/`track`/`fill` in
 * `packages/@react-spectrum/s2/src/ProgressCircle.tsx` (lines ~53-105): S/M/L are 16/32/64px with
 * 2/3/4px strokes (there is no XL size for this component, unlike most others in this port — see
 * `progressCircleSize`/`progressCircleStrokeWidth` in tokens.ts). The track is `gray-300` (exact,
 * same token as Meter/ProgressBar's track) and the determinate fill is the real component's
 * hardcoded `blue-900` (exact — no `variant` prop exists on the real ProgressCircle). The real
 * indeterminate animation combines a CSS rotation keyframe with a `stroke-dashoffset` keyframe
 * (lines ~140-159) for an accelerating/decelerating sweep; this port approximates it with a
 * simpler constant-speed full rotation of a fixed ~25%-of-circumference arc, which reads as the
 * same kind of spinner without reproducing the exact easing curve.
 */
export function ProgressCircle(props: ProgressCircleProps): React.ReactElement {
  let {value = 0, minValue = 0, maxValue = 100, isIndeterminate = false, size = 'M'} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let diameter = progressCircleSize[size];
  let strokeWidth = progressCircleStrokeWidth[size];
  let radius = (diameter - strokeWidth) / 2;
  let circumference = 2 * Math.PI * radius;

  let percentage = useMemo(() => {
    let range = maxValue - minValue;
    let clamped = Math.min(maxValue, Math.max(minValue, value));
    return range <= 0 ? 0 : ((clamped - minValue) / range) * 100;
  }, [value, minValue, maxValue]);

  let rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isIndeterminate) {
      return;
    }
    rotation.setValue(0);
    let loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isIndeterminate, rotation]);

  let rotate = rotation.interpolate({inputRange: [0, 1], outputRange: ['-90deg', '270deg']});

  let dashOffset = isIndeterminate ? circumference * 0.75 : circumference * (1 - percentage / 100);

  return (
    <Animated.View style={{width: diameter, height: diameter, transform: isIndeterminate ? [{rotate}] : undefined}}>
      <Svg width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`}>
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={getColor('gray-300', mode)}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={getColor('blue-900', mode)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          rotation={-90}
          origin={`${diameter / 2}, ${diameter / 2}`}
        />
      </Svg>
    </Animated.View>
  );
}
