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
import {useState} from 'react';
import {View} from 'react-native';

import type {Meta, StoryObj} from '@storybook/react';

import {Slider} from '@react-spectrum/native';

const meta: Meta<typeof Slider> = {
  title: 'Native/Slider',
  component: Slider,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    isEmphasized: {control: 'boolean'},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Slider>;

function Interactive(props: React.ComponentProps<typeof Slider>) {
  let [value, setValue] = useState(props.value ?? 25);
  return <Slider {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Opacity', size: 'M'}
};

/** Emphasized (accent-colored) fill, vs. the default neutral fill. */
export const Emphasized: Story = {
  render: args => (
    <View style={{gap: 24}}>
      <Interactive {...args} isEmphasized={false} label="Default fill" />
      <Interactive {...args} isEmphasized label="Emphasized fill" />
    </View>
  ),
  args: {size: 'M'}
};

/** All four sizes (S/M/L/XL) stacked. */
export const Sizes: Story = {
  render: args => (
    <View style={{gap: 24}}>
      <Interactive {...args} size="S" label="Small" />
      <Interactive {...args} size="M" label="Medium" />
      <Interactive {...args} size="L" label="Large" />
      <Interactive {...args} size="XL" label="Extra large" />
    </View>
  )
};

export const CustomRange: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Temperature (°F)', minValue: 60, maxValue: 90, step: 1, value: 72, size: 'M'}
};

export const Disabled: Story = {
  args: {label: 'Opacity', value: 40, isDisabled: true, size: 'M'}
};
