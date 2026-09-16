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

import {ContextualHelp} from '@react-spectrum/native';

const meta: Meta<typeof ContextualHelp> = {
  title: 'Native/ContextualHelp',
  component: ContextualHelp,
  argTypes: {
    variant: {control: 'select', options: ['info', 'help']},
    size: {control: 'select', options: ['XS', 'S']},
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ContextualHelp>;

export const Default: Story = {
  args: {
    variant: 'help',
    size: 'XS',
    title: 'Need help?',
    children: <Text>If you're having issues accessing your account, contact our customer support team for help.</Text>
  }
};

export const Info: Story = {
  args: {
    variant: 'info',
    size: 'XS',
    title: 'Permissions',
    children: <Text>Edit access lets a user view and modify the contents of this document.</Text>
  }
};

/** Both variants side by side, as they'd typically appear next to a field label. */
export const InLabel: Story = {
  render: args => (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
      <Text style={{fontSize: 14, fontWeight: '500'}}>Password</Text>
      <ContextualHelp {...args} />
    </View>
  ),
  args: {
    variant: 'help',
    size: 'XS',
    title: 'Password requirements',
    children: <Text>Passwords must be at least 8 characters and contain a number.</Text>
  }
};

export const WithFooter: Story = {
  args: {
    variant: 'info',
    size: 'XS',
    title: 'Storage limits',
    children: <Text>Free accounts include 5GB of storage. Upgrade for more space.</Text>,
    footer: <Text style={{fontSize: 12, color: 'rgb(59, 99, 251)'}}>Learn more</Text>
  }
};

export const Disabled: Story = {
  args: {
    variant: 'help',
    size: 'XS',
    isDisabled: true,
    title: 'Need help?',
    children: <Text>This trigger is disabled and can't be pressed.</Text>
  }
};
