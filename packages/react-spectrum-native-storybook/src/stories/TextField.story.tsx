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

import {TextField} from '@react-spectrum/native';

const meta: Meta<typeof TextField> = {
  title: 'Native/TextField',
  component: TextField,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    isDisabled: {control: 'boolean'},
    isInvalid: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof TextField>;

function Interactive(props: React.ComponentProps<typeof TextField>) {
  let [value, setValue] = useState(props.value ?? '');
  return <TextField {...props} value={value} onChangeText={setValue} />;
}

export const Default: Story = {
  render: args => <Interactive {...args} />,
  args: {label: 'Email', placeholder: 'you@example.com', size: 'M'}
};

/** All four sizes (S/M/L/XL) stacked. */
export const Sizes: Story = {
  render: args => (
    <View style={{gap: 16}}>
      <TextField {...args} size="S" label="Small" />
      <TextField {...args} size="M" label="Medium" />
      <TextField {...args} size="L" label="Large" />
      <TextField {...args} size="XL" label="Extra large" />
    </View>
  ),
  args: {placeholder: 'Type here…'}
};

export const WithDescription: Story = {
  args: {
    label: 'Username',
    placeholder: 'jdoe',
    description: 'This will be visible to other users.',
    size: 'M'
  }
};

export const Invalid: Story = {
  args: {
    label: 'Email',
    value: 'not-an-email',
    isInvalid: true,
    errorMessage: 'Enter a valid email address.',
    size: 'M'
  }
};

export const Disabled: Story = {
  args: {label: 'Email', value: 'jdoe@example.com', isDisabled: true, size: 'M'}
};
