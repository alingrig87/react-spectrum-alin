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
import type {Meta, StoryObj} from '@storybook/react';

import {Button, ButtonGroup} from '@react-spectrum/native';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Native/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    orientation: {control: 'select', options: ['horizontal', 'vertical']},
    align: {control: 'select', options: ['start', 'end', 'center']},
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']}
  }
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <Button variant="secondary" fillStyle="outline">Cancel</Button>
      <Button variant="accent">Save</Button>
    </ButtonGroup>
  ),
  args: {orientation: 'horizontal', align: 'start'}
};

/** Horizontal vs. vertical orientation. */
export const Orientation: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <Button variant="secondary" fillStyle="outline">Cancel</Button>
      <Button variant="secondary" fillStyle="outline">Save draft</Button>
      <Button variant="accent">Publish</Button>
    </ButtonGroup>
  ),
  args: {orientation: 'vertical'}
};

export const ThreeButtons: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="negative">Delete</Button>
    </ButtonGroup>
  ),
  args: {orientation: 'horizontal'}
};
