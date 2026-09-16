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

import {Table, TableColumn, TableRow} from '@react-spectrum/native';

const meta: Meta<typeof Table> = {
  title: 'Native/Table',
  component: Table,
  argTypes: {
    density: {control: 'select', options: ['compact', 'regular', 'spacious']}
  }
};

export default meta;

type Story = StoryObj<typeof Table>;

const columns: TableColumn[] = [
  {key: 'name', title: 'Name'},
  {key: 'type', title: 'Type'},
  {key: 'size', title: 'Size', align: 'end'}
];

const rows: TableRow[] = [
  {key: '1', cells: {name: 'Documents', type: 'Folder', size: '—'}},
  {key: '2', cells: {name: 'photo.png', type: 'Image', size: '2.4 MB'}},
  {key: '3', cells: {name: 'budget.xlsx', type: 'Spreadsheet', size: '18 KB'}},
  {key: '4', cells: {name: 'notes.txt', type: 'Text', size: '1 KB'}}
];

export const Default: Story = {
  args: {columns, rows, density: 'regular'}
};

export const Compact: Story = {
  args: {columns, rows, density: 'compact'}
};

export const Spacious: Story = {
  args: {columns, rows, density: 'spacious'}
};

export const FixedColumnWidths: Story = {
  args: {
    columns: [
      {key: 'name', title: 'Name', width: 160},
      {key: 'type', title: 'Type', align: 'center', width: 100},
      {key: 'size', title: 'Size', align: 'end', width: 80}
    ],
    rows,
    density: 'regular'
  }
};
