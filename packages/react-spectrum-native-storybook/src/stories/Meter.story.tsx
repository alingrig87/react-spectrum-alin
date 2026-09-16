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
import {View} from 'react-native';

import type {Meta, StoryObj} from '@storybook/react';

import {Meter} from '@react-spectrum/native';

const meta: Meta<typeof Meter> = {
  title: 'Native/Meter',
  component: Meter,
  argTypes: {
    variant: {control: 'select', options: ['informative', 'positive', 'notice', 'negative']},
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    value: {control: {type: 'range', min: 0, max: 100}}
  }
};

export default meta;

type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  args: {
    label: 'Storage used',
    value: 45,
    variant: 'informative',
    size: 'M'
  }
};

/** All four variants at different fill levels (mirroring typical quota thresholds). */
export const Variants: Story = {
  render: () => (
    <View style={{gap: 12, width: 240}}>
      <Meter label="Informative" value={35} variant="informative" />
      <Meter label="Positive" value={20} variant="positive" />
      <Meter label="Notice" value={70} variant="notice" />
      <Meter label="Negative" value={95} variant="negative" />
    </View>
  )
};

/** All four sizes (S/M/L/XL) — track thickness grows, everything else stays the same. */
export const Sizes: Story = {
  render: () => (
    <View style={{gap: 12, width: 240}}>
      <Meter label="Small" value={60} size="S" />
      <Meter label="Medium" value={60} size="M" />
      <Meter label="Large" value={60} size="L" />
      <Meter label="Extra large" value={60} size="XL" />
    </View>
  )
};

/** Without a label — just the bar. */
export const NoLabel: Story = {
  args: {value: 60},
  render: args => (
    <View style={{width: 240}}>
      <Meter {...args} />
    </View>
  )
};

export const Empty: Story = {
  args: {label: 'Storage used', value: 0}
};

export const Full: Story = {
  args: {label: 'Storage used', value: 100, variant: 'negative'}
};
