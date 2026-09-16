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

import {Accordion, AccordionItem} from '@react-spectrum/native';

const meta: Meta<typeof Accordion> = {
  title: 'Native/Accordion',
  component: Accordion,
  argTypes: {
    size: {control: 'select', options: ['S', 'M', 'L', 'XL']}
  }
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: args => (
    <Accordion {...args}>
      <AccordionItem title="Shipping details" defaultExpanded>
        <Text>Standard shipping takes 3-5 business days.</Text>
      </AccordionItem>
      <AccordionItem title="Payment methods">
        <Text>We accept all major credit cards and PayPal.</Text>
      </AccordionItem>
      <AccordionItem title="Return policy" isDisabled>
        <Text>Returns are accepted within 30 days of purchase.</Text>
      </AccordionItem>
    </Accordion>
  ),
  args: {size: 'M'}
};

export const Sizes: Story = {
  render: () => (
    <View style={{gap: 24}}>
      {(['S', 'M', 'L', 'XL'] as const).map(size => (
        <Accordion key={size} size={size}>
          <AccordionItem title={`Size ${size}`} defaultExpanded>
            <Text>Content for the {size} accordion item.</Text>
          </AccordionItem>
        </Accordion>
      ))}
    </View>
  )
};
