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
import {Text} from 'react-native';

import type {Meta, StoryObj} from '@storybook/react';

import {Button, ButtonGroup, Dialog} from '@react-spectrum/native';

const meta: Meta<typeof Dialog> = {
  title: 'Native/Dialog',
  component: Dialog,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']},
    isDismissible: {control: 'boolean'},
    isOpen: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    isOpen: true,
    isDismissible: true,
    size: 'M',
    title: 'Delete file',
    children: <Text>Are you sure you want to delete this file? This action cannot be undone.</Text>,
    footer: (
      <ButtonGroup>
        <Button variant="secondary" fillStyle="outline">Cancel</Button>
        <Button variant="negative">Delete</Button>
      </ButtonGroup>
    )
  }
};

export const Sizes: Story = {
  args: {
    isOpen: true,
    isDismissible: true,
    size: 'L',
    title: 'A larger dialog',
    children: <Text>This dialog uses the "L" size, which widens the card to 640px (capped at 90% of the screen).</Text>
  }
};

export const NotDismissible: Story = {
  args: {
    isOpen: true,
    isDismissible: false,
    size: 'M',
    title: 'Processing…',
    children: <Text>This dialog has no close button and can't be dismissed by tapping the backdrop.</Text>
  }
};
