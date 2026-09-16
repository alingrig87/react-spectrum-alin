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
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import {
  checkboxBoxSize,
  ControlSize,
  controlFontSize,
  getColor,
  semanticColors,
  switchTrackWidth
} from '../theme/tokens';

export type SwitchSize = ControlSize;

export interface SwitchProps {
  /** The label for the switch. */
  children?: ReactNode;
  /** Whether the switch is on (controlled). */
  isSelected?: boolean;
  /**
   * The size of the Switch.
   * @default 'M'
   */
  size?: SwitchSize;
  /** Whether the Switch should be displayed with an emphasized (accent) fill when on. */
  isEmphasized?: boolean;
  /** Whether the switch is disabled. */
  isDisabled?: boolean;
  /** Called when the user toggles the switch. */
  onChange?: (isSelected: boolean) => void;
}

/**
 * A visual-only port of Spectrum 2's Switch for React Native, matching the real component's
 * off/on per-size track/handle dimensions (`packages/@react-spectrum/s2/src/Switch.tsx`'s `track`/
 * `handle` styles, lines ~123-177). Track width comes from `switchTrackWidth`
 * (`../theme/tokens.ts`), resolving the real `fontRelative(26)` CSS expression to a flat px value;
 * track height reuses `checkboxBoxSize` since both are `controlSize('sm')`. The real component
 * animates the handle's position/size with a CSS `transform` (a `perspective()`/`translateZ()`
 * trick to fake a non-integer scale, lines ~179-209) — here the handle is simply given its two
 * literal end sizes/positions directly via flexbox, with no animation, per this port's stated
 * scope (plain RN interactions, not a full re-animation of S2's motion design).
 */
export function Switch(props: SwitchProps): React.ReactElement {
  let {children, isSelected = false, size = 'M', isEmphasized = false, isDisabled = false, onChange} = props;

  let scheme: ColorSchemeName = useColorScheme();
  let mode: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';

  let trackWidth = switchTrackWidth[size];
  let trackHeight = checkboxBoxSize[size];
  let fontSize = controlFontSize[size];

  function handlePress(_event: GestureResponderEvent) {
    if (isDisabled) {
      return;
    }
    onChange?.(!isSelected);
  }

  // track borderColor/backgroundColor lifted from `track` in Switch.tsx (lines ~141-162):
  // unselected -> border baseColor('gray-800'), bg 'gray-25'; selected -> border 'transparent',
  // bg baseColor('neutral') (gray-800), or accent-900 when isEmphasized; disabled swaps border and
  // (when also selected) background to gray-400.
  let trackBorderColor: string;
  let trackBackgroundColor: string;
  if (isDisabled) {
    trackBorderColor = getColor('gray-400', mode);
    trackBackgroundColor = isSelected ? getColor('gray-400', mode) : getColor('gray-25', mode);
  } else if (isSelected) {
    trackBorderColor = 'transparent';
    trackBackgroundColor = isEmphasized ? getColor('accent-900', mode) : getColor('gray-800', mode);
  } else {
    trackBorderColor = getColor('gray-800', mode);
    trackBackgroundColor = getColor('gray-25', mode);
  }

  // handle backgroundColor lifted from `handle` in Switch.tsx (lines ~164-177): default
  // baseColor('neutral') (gray-800); isSelected -> 'gray-25' (the handle turns light against the
  // now-dark/accent track); isDisabled -> gray-400.
  let handleBackgroundColor = isDisabled
    ? getColor('gray-400', mode)
    : isSelected
      ? getColor('gray-25', mode)
      : getColor('gray-800', mode);

  // Real handle diameter is (trackHeight - 8) unselected, growing to (trackHeight - 6) when
  // selected (Switch.tsx lines ~181-198's comment spells out the math); we use those two literal
  // sizes directly instead of the CSS perspective-scale trick used to animate between them.
  let handleSize = isSelected ? trackHeight - 6 : trackHeight - 8;

  let labelColor = isDisabled ? semanticColors.disabledContent[mode] : semanticColors.neutralContent[mode];

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{disabled: isDisabled, checked: isSelected}}
      disabled={isDisabled}
      onPress={handlePress}
      style={styles.row}>
      <View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            borderWidth: 2, // space(2) — track.borderWidth in Switch.tsx line ~137
            borderColor: trackBorderColor,
            backgroundColor: trackBackgroundColor,
            justifyContent: isSelected ? 'flex-end' : 'flex-start'
          }
        ]}>
        <View
          style={{
            width: handleSize,
            height: handleSize,
            borderRadius: handleSize / 2,
            backgroundColor: handleBackgroundColor
          }}
        />
      </View>
      {children != null && (
        <Text style={{marginStart: 8, fontSize, color: labelColor}}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
