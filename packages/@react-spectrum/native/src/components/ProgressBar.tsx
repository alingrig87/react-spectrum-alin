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

import React, {ReactNode, useEffect, useMemo, useRef} from 'react';
import {Animated, ColorSchemeName, Easing, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {controlFontSize, ControlSize, getColor, barTrackHeight} from '../theme/tokens';

export type ProgressBarSize = ControlSize;

export interface ProgressBarProps {
  /** The content to display as the label. */
  label?: ReactNode;
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
   * The size of the ProgressBar.
   * @default 'M'
   */
  size?: ProgressBarSize;
}

/**
 * A visual-only port of Spectrum 2's ProgressBar for React Native. Track thickness per size is the
 * same `barTrackHeight` scale Meter uses (`Meter.tsx`/`ProgressBar.tsx` both define an identical
 * `trackStyles` object). The determinate fill color is `accent`
 * (`packages/@react-spectrum/s2/src/ProgressBar.tsx` line ~145), i.e. the same `accent-900` token
 * Button's `accent` variant already uses in this port. The real indeterminate animation is a CSS
 * `translateX`/`scaleX` sweep (lines ~69-85); this port approximates it with an
 * `Animated.Value`-driven looping sweep of a fixed-width segment across the track, which reads
 * the same visually without needing to replicate the exact CSS keyframe math.
 */
export function ProgressBar(props: ProgressBarProps): React.ReactElement {
  let {
    label,
    value = 0,
    minValue = 0,
    maxValue = 100,
    isIndeterminate = false,
    size = 'M'
  } = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let percentage = useMemo(() => {
    let range = maxValue - minValue;
    let clamped = Math.min(maxValue, Math.max(minValue, value));
    return range <= 0 ? 0 : ((clamped - minValue) / range) * 100;
  }, [value, minValue, maxValue]);

  let fontSize = controlFontSize[size];
  let labelColor = getColor('gray-800', mode);
  let trackHeight = barTrackHeight[size];
  let fillColor = getColor('accent-900', mode);

  let sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isIndeterminate) {
      return;
    }
    sweep.setValue(0);
    let loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isIndeterminate, sweep]);

  let sweepTranslate = sweep.interpolate({inputRange: [0, 1], outputRange: ['-70%', '100%']});

  return (
    <View style={styles.container}>
      {label != null && (
        <View style={styles.labelRow}>
          <Text style={{fontSize, color: labelColor}}>{label}</Text>
          {!isIndeterminate && <Text style={{fontSize, color: labelColor}}>{Math.round(percentage)}%</Text>}
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height: trackHeight,
            borderRadius: trackHeight / 2,
            backgroundColor: getColor('gray-300', mode)
          }
        ]}>
        {isIndeterminate ? (
          <Animated.View
            style={{
              height: '100%',
              width: '30%',
              borderRadius: trackHeight / 2,
              backgroundColor: fillColor,
              transform: [{translateX: sweepTranslate}]
            }}
          />
        ) : (
          <View
            style={{
              height: '100%',
              width: `${percentage}%` as `${number}%`,
              borderRadius: trackHeight / 2,
              backgroundColor: fillColor
            }}
          />
        )}
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
  track: {
    overflow: 'hidden',
    alignSelf: 'stretch'
  }
});
