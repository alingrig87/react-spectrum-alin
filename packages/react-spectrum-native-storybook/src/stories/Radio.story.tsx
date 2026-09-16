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

import {Radio, RadioGroup} from '@react-spectrum/native';

const meta: Meta<typeof RadioGroup> = {
  title: 'Native/RadioGroup',
  component: RadioGroup,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    orientation: {control: 'select', options: ['vertical', 'horizontal']},
    isEmphasized: {control: 'boolean'},
    isDisabled: {control: 'boolean'},
    isInvalid: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

function Interactive(props: React.ComponentProps<typeof RadioGroup>) {
  let [value, setValue] = useState(props.value ?? 'dogs');
  return (
    <RadioGroup {...props} value={value} onChange={setValue}>
      <Radio value="dogs">Dogs</Radio>
      <Radio value="cats">Cats</Radio>
      <Radio value="birds">Birds</Radio>
    </RadioGroup>
  );
}

export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Favorite pet', size: 'M'}
};

/** Vertical (default) vs. horizontal orientation. */
export const Orientation: Story = {
  render: args => (
    <View style={{gap: 24}}>
      <Interactive {...args} orientation="vertical" label="Vertical" />
      <Interactive {...args} orientation="horizontal" label="Horizontal" />
    </View>
  ),
  args: {size: 'M'}
};

/** Emphasized (accent-colored) selected dot, vs. the default neutral fill. */
export const Emphasized: Story = {
  render: args => (
    <View style={{gap: 24}}>
      <Interactive {...args} isEmphasized={false} label="Default fill" />
      <Interactive {...args} isEmphasized label="Emphasized fill" />
    </View>
  ),
  args: {size: 'M'}
};

/** All four sizes (S/M/L/XL) side by side. */
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

export const Invalid: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Favorite pet', size: 'M', isInvalid: true}
};

export const Disabled: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Favorite pet', size: 'M', isDisabled: true}
};
