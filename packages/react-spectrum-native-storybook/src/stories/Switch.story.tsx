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

import {Switch} from '@react-spectrum/native';

const meta: Meta<typeof Switch> = {
  title: 'Native/Switch',
  component: Switch,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    isSelected: {control: 'boolean'},
    isEmphasized: {control: 'boolean'},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Switch>;

function Interactive(props: React.ComponentProps<typeof Switch>) {
  let [isSelected, setIsSelected] = useState(!!props.isSelected);
  return <Switch {...props} isSelected={isSelected} onChange={setIsSelected} />;
}

export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {children: 'Wi-Fi', size: 'M', isSelected: false}
};

/** Off / on, at the default emphasis (neutral fill). */
export const States: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Switch {...args} isSelected={false}>Off</Switch>
      <Switch {...args} isSelected>On</Switch>
    </View>
  ),
  args: {size: 'M'}
};

/** Emphasized (accent-colored) track when on, vs. the default neutral fill. */
export const Emphasized: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Switch {...args} isSelected isEmphasized={false}>Default fill</Switch>
      <Switch {...args} isSelected isEmphasized>Emphasized fill</Switch>
    </View>
  ),
  args: {size: 'M'}
};

/** All four sizes (S/M/L/XL) on, side by side. */
export const Sizes: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Switch {...args} size="S">Small</Switch>
      <Switch {...args} size="M">Medium</Switch>
      <Switch {...args} size="L">Large</Switch>
      <Switch {...args} size="XL">Extra large</Switch>
    </View>
  ),
  args: {isSelected: true}
};

export const Disabled: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Switch {...args} isSelected={false}>Off, disabled</Switch>
      <Switch {...args} isSelected>On, disabled</Switch>
    </View>
  ),
  args: {size: 'M', isDisabled: true}
};
