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
import {Text, View} from 'react-native';

import type {Meta, StoryObj} from '@storybook/react';

import {Link} from '@react-spectrum/native';

const meta: Meta<typeof Link> = {
  title: 'Native/Link',
  component: Link,
  argTypes: {
    variant: {control: 'select', options: ['primary', 'secondary']},
    isStandalone: {control: 'boolean'},
    isQuiet: {control: 'boolean'},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {children: 'Learn more', variant: 'primary', href: 'https://react-spectrum.adobe.com'}
};

/** Primary (accent-colored) vs. secondary (neutral gray) variant. */
export const Variants: Story = {
  render: args => (
    <View style={{gap: 8}}>
      <Link {...args} variant="primary">Primary link</Link>
      <Link {...args} variant="secondary">Secondary link</Link>
    </View>
  ),
  args: {isStandalone: true}
};

/** A standalone link (its own text) vs. one embedded inline inside a sentence. */
export const Standalone: Story = {
  render: args => (
    <View style={{gap: 12}}>
      <Link {...args} isStandalone>Standalone link</Link>
      <Text>
        Read our <Link {...args} isStandalone={false}>terms of service</Link> before continuing.
      </Text>
    </View>
  ),
  args: {variant: 'primary'}
};

/** Quiet standalone links have no underline until pressed. */
export const Quiet: Story = {
  args: {children: 'Quiet standalone link', variant: 'primary', isStandalone: true, isQuiet: true}
};

export const Disabled: Story = {
  args: {children: 'Disabled link', variant: 'primary', isStandalone: true, isDisabled: true}
};
