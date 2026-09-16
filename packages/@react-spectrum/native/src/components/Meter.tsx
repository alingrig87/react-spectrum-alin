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

import React, {ReactNode, useMemo} from 'react';
import {ColorSchemeName, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {ColorToken, controlFontSize, ControlSize, getColor, barTrackHeight} from '../theme/tokens';

export type MeterVariant = 'informative' | 'positive' | 'notice' | 'negative';

export type MeterSize = ControlSize;

export interface MeterProps {
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
  /**
   * The [visual style](https://spectrum.adobe.com/page/meter/#-Options) of the Meter.
   * @default 'informative'
   */
  variant?: MeterVariant;
  /**
   * The size of the Meter.
   * @default 'M'
   */
  size?: MeterSize;
}

// Fill color per variant, from `fillStyles`'s `backgroundColor` in
// `packages/@react-spectrum/s2/src/Meter.tsx` (lines ~89-103):
// `lightDark('informative-800', 'informative-900')` etc. We use each hue's own `-900` step as a
// self-contained light/dark pair instead of replicating that light/800-dark/900 cross-mode
// composite — see the "Semantic status colors" comment in tokens.ts for why.
const fillColor: Record<MeterVariant, ColorToken> = {
  informative: 'informative-900',
  positive: 'positive-900',
  notice: 'notice-900',
  negative: 'negative-900'
};

/**
 * A visual-only port of Spectrum 2's Meter for React Native: a horizontal track showing a
 * value/max ratio filled, e.g. a quota or battery indicator. Track thickness per size comes from
 * `trackStyles` (`Meter.tsx` lines ~76-87, shared verbatim with ProgressBar — see `barTrackHeight`
 * in tokens.ts) and the track's own background is `gray-300` (`bar-utils.ts`'s `track()`, exact).
 */
export function Meter(props: MeterProps): React.ReactElement {
  let {label, value = 0, minValue = 0, maxValue = 100, variant = 'informative', size = 'M'} = props;

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

  return (
    <View style={styles.container}>
      {label != null && (
        <View style={styles.labelRow}>
          <Text style={{fontSize, color: labelColor}}>{label}</Text>
          <Text style={{fontSize, color: labelColor}}>{Math.round(percentage)}%</Text>
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
        <View
          style={{
            height: '100%',
            width: `${percentage}%` as `${number}%`,
            borderRadius: trackHeight / 2,
            backgroundColor: getColor(fillColor[variant], mode)
          }}
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
  track: {
    overflow: 'hidden',
    alignSelf: 'stretch'
  }
});
