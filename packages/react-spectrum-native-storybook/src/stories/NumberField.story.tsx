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

import {NumberField} from '@react-spectrum/native';

const meta: Meta<typeof NumberField> = {
  title: 'Native/NumberField',
  component: NumberField,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    hideStepper: {control: 'boolean'},
    isDisabled: {control: 'boolean'},
    isInvalid: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof NumberField>;

function Interactive(props: React.ComponentProps<typeof NumberField>) {
  let [value, setValue] = useState(props.value ?? 0);
  return <NumberField {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Quantity', size: 'M', value: 1, minValue: 0, maxValue: 99}
};

export const NoStepper: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Age', size: 'M', value: 30, hideStepper: true}
};

/** All four sizes (S/M/L/XL) stacked. */
export const Sizes: Story = {
  render: args => (
    <View style={{gap: 16}}>
      <Interactive {...args} size="S" label="Small" />
      <Interactive {...args} size="M" label="Medium" />
      <Interactive {...args} size="L" label="Large" />
      <Interactive {...args} size="XL" label="Extra large" />
    </View>
  ),
  args: {value: 5}
};

export const WithDescription: Story = {
  render: args => <Interactive {...args} />,
  args: {
    label: 'Seats',
    value: 2,
    minValue: 1,
    maxValue: 10,
    description: 'How many seats to reserve.',
    size: 'M'
  }
};

export const Invalid: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Quantity', value: 150, isInvalid: true, errorMessage: 'Maximum quantity is 99.', size: 'M'}
};

export const Disabled: Story = {
  args: {label: 'Quantity', value: 3, isDisabled: true, size: 'M'}
};
