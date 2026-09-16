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

import {ProgressCircle} from '@react-spectrum/native';

const meta: Meta<typeof ProgressCircle> = {
  title: 'Native/ProgressCircle',
  component: ProgressCircle,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L']},
    value: {control: {type: 'range', min: 0, max: 100}},
    isIndeterminate: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
  args: {value: 60, size: 'M'}
};

/** The 3 sizes this component supports (no XL, unlike most others in this port). */
export const Sizes: Story = {
  render: () => (
    <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
      <ProgressCircle value={70} size="S" />
      <ProgressCircle value={70} size="M" />
      <ProgressCircle value={70} size="L" />
    </View>
  )
};

/** The spinning indeterminate state. */
export const Indeterminate: Story = {
  args: {isIndeterminate: true, size: 'M'}
};

export const Empty: Story = {
  args: {value: 0, size: 'L'}
};

export const Complete: Story = {
  args: {value: 100, size: 'L'}
};
