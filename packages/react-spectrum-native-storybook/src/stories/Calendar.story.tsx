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

import type {Meta, StoryObj} from '@storybook/react';

import {Calendar} from '@react-spectrum/native';

const meta: Meta<typeof Calendar> = {
  title: 'Native/Calendar',
  component: Calendar,
  argTypes: {
    isDisabled: {control: 'boolean'}
  }
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: args => {
    let [value, setValue] = useState<Date | null>(new Date());
    return <Calendar {...args} value={value} onChange={setValue} />;
  }
};

export const NoSelection: Story = {
  render: args => {
    let [value, setValue] = useState<Date | null>(null);
    return <Calendar {...args} value={value} onChange={setValue} />;
  }
};

export const WithMinMax: Story = {
  render: args => {
    let today = new Date();
    let [value, setValue] = useState<Date | null>(null);
    let minValue = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let maxValue = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    return <Calendar {...args} value={value} onChange={setValue} minValue={minValue} maxValue={maxValue} />;
  }
};

export const Disabled: Story = {
  render: args => <Calendar {...args} value={new Date()} isDisabled />
};
