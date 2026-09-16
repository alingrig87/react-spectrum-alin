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

import {ToggleButton} from '@react-spectrum/native';

const meta: Meta<typeof ToggleButton> = {
  title: 'Native/ToggleButton',
  component: ToggleButton,
  argTypes: {
    size: {control: 'select', options: ['XS', 'S', 'M', 'L', 'XL']},
    isSelected: {control: 'boolean'},
    isQuiet: {control: 'boolean'},
    isEmphasized: {control: 'boolean'},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ToggleButton>;

function Interactive(props: React.ComponentProps<typeof ToggleButton>) {
  let [isSelected, setIsSelected] = useState(!!props.isSelected);
  return <ToggleButton {...props} isSelected={isSelected} onChange={setIsSelected} />;
}

export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {children: 'Bold', size: 'M', isSelected: false}
};

/** Unselected vs. selected, at the default (neutral gray-800) fill. */
export const Selected: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8}}>
      <ToggleButton {...args} isSelected={false}>Unselected</ToggleButton>
      <ToggleButton {...args} isSelected>Selected</ToggleButton>
    </View>
  ),
  args: {size: 'M'}
};

/** Emphasized (accent-colored) selected fill, vs. the default neutral fill. */
export const Emphasized: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8}}>
      <ToggleButton {...args} isSelected isEmphasized={false}>Default fill</ToggleButton>
      <ToggleButton {...args} isSelected isEmphasized>Emphasized fill</ToggleButton>
    </View>
  ),
  args: {size: 'M'}
};

/** All five sizes (XS/S/M/L/XL), selected, side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
      <ToggleButton {...args} size="XS">XS</ToggleButton>
      <ToggleButton {...args} size="S">Small</ToggleButton>
      <ToggleButton {...args} size="M">Medium</ToggleButton>
      <ToggleButton {...args} size="L">Large</ToggleButton>
      <ToggleButton {...args} size="XL">Extra large</ToggleButton>
    </View>
  ),
  args: {isSelected: true, isEmphasized: true}
};

export const Disabled: Story = {
  render: args => (
    <View style={{flexDirection: 'row', gap: 8}}>
      <ToggleButton {...args} isSelected={false}>Unselected, disabled</ToggleButton>
      <ToggleButton {...args} isSelected>Selected, disabled</ToggleButton>
    </View>
  ),
  args: {size: 'M', isDisabled: true}
};
