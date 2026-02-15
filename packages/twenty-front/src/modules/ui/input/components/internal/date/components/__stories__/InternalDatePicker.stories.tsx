import { DateTimePicker } from '@/ui/input/components/internal/date/components/DateTimePicker';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Temporal } from 'temporal-polyfill';
import { ComponentDecorator } from 'twenty-ui/testing';

const INITIAL_DATE = Temporal.ZonedDateTime.from(
  '2023-01-01T02:00:00+00:00[UTC]',
);

const DateTimePickerStory = () => {
  const [date, setDate] = useState<Temporal.ZonedDateTime | null>(INITIAL_DATE);

  return (
    <DateTimePicker
      instanceId="story-date-time-picker"
      date={date}
      onChange={setDate}
    />
  );
};

const meta: Meta<typeof DateTimePicker> = {
  title: 'UI/Input/Internal/InternalDatePicker',
  component: DateTimePicker,
  decorators: [ComponentDecorator],
  render: () => <DateTimePickerStory />,
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {};

export const WithOpenMonthSelect: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    // Increased timeout to account for lazy-loaded react-datepicker on slower CI runners
    const monthSelect = await body.findByText(
      'January',
      {},
      { timeout: 10000 },
    );

    await userEvent.click(monthSelect);

    for (const monthLabel of [
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]) {
      expect(await body.findByText(monthLabel)).toBeInTheDocument();
    }

    await userEvent.click(await body.findByText('February'));

    expect(await body.findByText('February')).toBeInTheDocument();
  },
};

export const WithOpenYearSelect: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);

    // Increased timeout to account for lazy-loaded react-datepicker on slower CI runners
    const yearSelect = await body.findByText('2023', {}, { timeout: 10000 });

    await userEvent.click(yearSelect);

    for (const yearLabel of ['2024', '2025', '2026']) {
      expect(await body.findByText(yearLabel)).toBeInTheDocument();
    }

    await userEvent.click(await body.findByText('2024'));

    expect(await body.findByText('2024')).toBeInTheDocument();
  },
};

export const WithOpenTimePicker: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    // Increased timeout to account for lazy-loaded react-datepicker on slower CI runners
    const timeInput = await canvas.findByText('02:00', {}, { timeout: 10000 });

    await userEvent.click(timeInput);

    const nowButton = await body.findByText('Now');
    expect(nowButton).toBeInTheDocument();

    const hourColumn = await body.findByTestId(
      'time-picker-hour-column',
      {},
      { timeout: 10000 },
    );
    const minuteColumn = await body.findByTestId(
      'time-picker-minute-column',
      {},
      { timeout: 10000 },
    );

    const hourScope = within(hourColumn);
    for (const hourLabel of ['00', '01', '03', '04', '05']) {
      expect(await hourScope.findByText(hourLabel)).toBeInTheDocument();
    }

    const minuteScope = within(minuteColumn);
    for (const minuteLabel of ['30', '31', '32', '33', '34']) {
      expect(await minuteScope.findByText(minuteLabel)).toBeInTheDocument();
    }

    await userEvent.click(await hourScope.findByText('14'));
    await userEvent.click(await minuteScope.findByText('14'));

    const okButton = await body.findByText('OK');
    expect(okButton).toBeInTheDocument();
    await userEvent.click(okButton);

    expect(await canvas.findByText('14:14')).toBeInTheDocument();
  },
};
