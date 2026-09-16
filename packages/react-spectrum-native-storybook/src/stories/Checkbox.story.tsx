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

import {Checkbox} from '@react-spectrum/native';

const meta: Meta<typeof Checkbox> = {
  title: 'Native/Checkbox',
  component: Checkbox,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    isSelected: {control: 'boolean'},
    isIndeterminate: {control: 'boolean'},
    isEmphasized: {control: 'boolean'},
    isDisabled: {control: 'boolean'},
    isInvalid: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

function Interactive(props: React.ComponentProps<typeof Checkbox>) {
  let [isSelected, setIsSelected] = useState(!!props.isSelected);
  return <Checkbox {...props} isSelected={isSelected} onChange={setIsSelected} />;
}

export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {children: 'Subscribe to updates', size: 'M', isSelected: false}
};

/** Unchecked / checked / indeterminate, at the default emphasis (neutral fill). */
export const States: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Checkbox {...args} isSelected={false}>Unchecked</Checkbox>
      <Checkbox {...args} isSelected>Checked</Checkbox>
      <Checkbox {...args} isIndeterminate>Indeterminate</Checkbox>
    </View>
  ),
  args: {size: 'M'}
};

/** Emphasized (accent-colored) fill when selected, vs. the default neutral fill. */
export const Emphasized: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Checkbox {...args} isSelected isEmphasized={false}>Default fill</Checkbox>
      <Checkbox {...args} isSelected isEmphasized>Emphasized fill</Checkbox>
    </View>
  ),
  args: {size: 'M'}
};

/** All four sizes (S/M/L/XL) checked, side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Checkbox {...args} size="S">Small</Checkbox>
      <Checkbox {...args} size="M">Medium</Checkbox>
      <Checkbox {...args} size="L">Large</Checkbox>
      <Checkbox {...args} size="XL">Extra large</Checkbox>
    </View>
  ),
  args: {isSelected: true}
};

export const Invalid: Story = {
  args: {children: 'I agree to the terms', size: 'M', isSelected: true, isInvalid: true}
};

export const Disabled: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Checkbox {...args} isSelected={false}>Unchecked, disabled</Checkbox>
      <Checkbox {...args} isSelected>Checked, disabled</Checkbox>
    </View>
  ),
  args: {size: 'M', isDisabled: true}
};
