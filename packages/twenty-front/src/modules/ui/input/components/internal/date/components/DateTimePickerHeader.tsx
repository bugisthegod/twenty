import styled from '@emotion/styled';
import { type Ref, useEffect } from 'react';
import { useIMask } from 'react-imask';

import { TimeFormat } from '@/localization/constants/TimeFormat';
import { useDateTimeFormat } from '@/localization/hooks/useDateTimeFormat';
import { DateTimePickerInput } from '@/ui/input/components/internal/date/components/DateTimePickerInput';
import { getTimeBlocks } from '@/ui/input/components/internal/date/utils/getTimeBlocks';
import { getTimeMask } from '@/ui/input/components/internal/date/utils/getTimeMask';
import { t } from '@lingui/core/macro';
import { type Temporal } from 'temporal-polyfill';
import { isDefined } from 'twenty-shared/utils';
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
} from 'twenty-ui/display';
import { LightIconButton } from 'twenty-ui/input';

const StyledTimeRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: flex-start;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledTimeInputWrapper = styled.div`
  flex-grow: 1;
`;

const StyledTimeInputContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.background.tertiary};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  height: ${({ theme }) => theme.spacing(8)};
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.border.color.strong};
  }
`;

const StyledClockIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  flex-shrink: 0;
`;

const StyledTimeInput = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.font.color.primary};
  cursor: text;
  font-family: inherit;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  letter-spacing: 0.05em;
  outline: none;
  width: 100%;
`;

const StyledRightControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledNavigationButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledSeparator = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  height: 1px;
  width: 100%;
`;

type DateTimePickerHeaderProps = {
  date: Temporal.ZonedDateTime | null;
  onChange?: (date: Temporal.ZonedDateTime | null) => void;
  onAddMonth: () => void;
  onSubtractMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  hideInput?: boolean;
  onToggleMonthYearSelector?: () => void;
  calendarButtonRef?: Ref<HTMLDivElement>;
};

const formatTimeForMask = (
  hour: number,
  minute: number,
  isHour12: boolean,
): string => {
  const hh = isHour12
    ? (hour % 12 || 12).toString().padStart(2, '0')
    : hour.toString().padStart(2, '0');
  const mm = minute.toString().padStart(2, '0');
  if (isHour12) {
    const amPm = hour >= 12 ? 'PM' : 'AM';
    return `${hh}:${mm} ${amPm}`;
  }
  return `${hh}:${mm}`;
};

export const DateTimePickerHeader = ({
  date,
  onChange,
  onAddMonth,
  onSubtractMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  hideInput = false,
  onToggleMonthYearSelector,
  calendarButtonRef,
}: DateTimePickerHeaderProps) => {
  const { timeFormat } = useDateTimeFormat();
  const isHour12 = timeFormat === TimeFormat.HOUR_12;

  const { ref: iMaskRef, setValue } = useIMask(
    {
      mask: getTimeMask(timeFormat),
      blocks: getTimeBlocks(timeFormat),
      lazy: false,
      autofix: true,
    },
    {
      defaultValue: isDefined(date)
        ? formatTimeForMask(date.hour, date.minute, isHour12)
        : undefined,
      onComplete: (value) => {
        if (!date) return;

        const [hoursStr, rest] = value.split(':');
        const hours = parseInt(hoursStr, 10);

        if (isHour12) {
          const [minutesStr, amPmStr] = rest.trim().split(/\s+/);
          const minutes = parseInt(minutesStr, 10);
          if (isNaN(hours) || isNaN(minutes)) return;

          const isPM = amPmStr?.toUpperCase() === 'PM';
          const hour24 = isPM
            ? hours === 12
              ? 12
              : hours + 12
            : hours === 12
              ? 0
              : hours;

          onChange?.(date.with({ hour: hour24, minute: minutes }));
        } else {
          const minutes = parseInt(rest, 10);
          if (isNaN(hours) || isNaN(minutes)) return;
          onChange?.(date.with({ hour: hours, minute: minutes }));
        }
      },
    },
  );

  useEffect(() => {
    if (isDefined(date)) {
      setValue(formatTimeForMask(date.hour, date.minute, isHour12));
    }
  }, [date, isHour12, setValue]);

  const timeInputRef = iMaskRef as React.Ref<HTMLInputElement>;

  return (
    <>
      {!hideInput && (
        <>
          <DateTimePickerInput date={date} onChange={onChange} />
          <StyledSeparator />
        </>
      )}
      <StyledTimeRow>
        <StyledTimeInputWrapper>
          <StyledTimeInputContainer>
            <StyledClockIcon>
              <IconClock size={16} />
            </StyledClockIcon>
            <StyledTimeInput
              type="text"
              ref={timeInputRef}
              placeholder={isHour12 ? 'HH:mm AA' : 'HH:mm'}
            />
          </StyledTimeInputContainer>
        </StyledTimeInputWrapper>
        <StyledRightControls>
          <div ref={calendarButtonRef}>
            <LightIconButton
              Icon={IconCalendar}
              size="medium"
              onClick={onToggleMonthYearSelector}
              aria-label={t`Select month and year`}
            />
          </div>
          <StyledNavigationButtons>
            <LightIconButton
              Icon={IconChevronLeft}
              onClick={onSubtractMonth}
              size="medium"
              disabled={prevMonthButtonDisabled}
            />
            <LightIconButton
              Icon={IconChevronRight}
              onClick={onAddMonth}
              size="medium"
              disabled={nextMonthButtonDisabled}
            />
          </StyledNavigationButtons>
        </StyledRightControls>
      </StyledTimeRow>
    </>
  );
};
