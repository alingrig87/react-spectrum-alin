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

import {ColorArea} from '@react-spectrum/native';

const meta: Meta<typeof ColorArea> = {
  title: 'Native/Color/ColorArea',
  component: ColorArea,
  argTypes: {
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof ColorArea>;

export const Default: Story = {
  args: {hue: 210, saturation: 70, brightness: 85}
};

export const Small: Story = {
  args: {hue: 30, saturation: 60, brightness: 70, size: 120}
};

export const Disabled: Story = {
  args: {hue: 210, saturation: 70, brightness: 85, isDisabled: true}
};
