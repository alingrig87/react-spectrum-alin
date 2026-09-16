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

import {ProgressBar} from '@react-spectrum/native';

const meta: Meta<typeof ProgressBar> = {
  title: 'Native/ProgressBar',
  component: ProgressBar,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    value: {control: {type: 'range', min: 0, max: 100}},
    isIndeterminate: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    label: 'Loading…',
    value: 60,
    size: 'M'
  }
};

/** All four sizes (S/M/L/XL) side by side. */
export const Sizes: Story = {
  render: () => (
    <View style={{gap: 12, width: 240}}>
      <ProgressBar label="Small" value={60} size="S" />
      <ProgressBar label="Medium" value={60} size="M" />
      <ProgressBar label="Large" value={60} size="L" />
      <ProgressBar label="Extra large" value={60} size="XL" />
    </View>
  )
};

/** The looping sweep animation shown when progress isn't known. */
export const Indeterminate: Story = {
  args: {label: 'Loading…', isIndeterminate: true},
  render: args => (
    <View style={{width: 240}}>
      <ProgressBar {...args} />
    </View>
  )
};

/** Without a label — just the track. */
export const NoLabel: Story = {
  args: {value: 60},
  render: args => (
    <View style={{width: 240}}>
      <ProgressBar {...args} />
    </View>
  )
};

export const Empty: Story = {
  args: {label: 'Loading…', value: 0}
};

export const Complete: Story = {
  args: {label: 'Loading…', value: 100}
};
