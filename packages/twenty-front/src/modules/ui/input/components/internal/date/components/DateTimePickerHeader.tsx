import styled from '@emotion/styled';
import { useCallback, useRef } from 'react';

import { DateTimePickerInput } from '@/ui/input/components/internal/date/components/DateTimePickerInput';
import { TimePickerDropdown } from '@/ui/input/components/internal/date/components/TimePickerDropdown';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { ClickOutsideListenerContext } from '@/ui/utilities/pointer-event/contexts/ClickOutsideListenerContext';
import { Temporal } from 'temporal-polyfill';
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
} from 'twenty-ui/display';
import { LightIconButton } from 'twenty-ui/input';

export const TIME_PICKER_DROPDOWN_ID = 'date-time-picker-time-dropdown';

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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.background.tertiary};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  cursor: pointer;
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

const StyledTimeDisplay = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  user-select: none;
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
};

export const DateTimePickerHeader = ({
  date,
  onChange,
  onAddMonth,
  onSubtractMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  hideInput = false,
}: DateTimePickerHeaderProps) => {
  const { closeDropdown } = useCloseDropdown();
  const timeInputWrapperRef = useRef<HTMLDivElement>(null);

  const currentHour = date?.hour ?? 0;
  const currentMinute = date?.minute ?? 0;

  const dropdownWidth = timeInputWrapperRef.current?.clientWidth ?? 156;

  const formatTime = useCallback((hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }, []);

  const handleHourChange = useCallback(
    (hour: number) => {
      if (!date) return;
      onChange?.(date.with({ hour }));
    },
    [date, onChange],
  );

  const handleMinuteChange = useCallback(
    (minute: number) => {
      if (!date) return;
      onChange?.(date.with({ minute }));
    },
    [date, onChange],
  );

  const handleNow = useCallback(() => {
    if (!date) return;
    const now = Temporal.Now.zonedDateTimeISO(date.timeZoneId);
    onChange?.(date.with({ hour: now.hour, minute: now.minute }));
  }, [date, onChange]);

  const handleCloseDropdown = useCallback(() => {
    closeDropdown(TIME_PICKER_DROPDOWN_ID);
  }, [closeDropdown]);

  return (
    <>
      {!hideInput && (
        <>
          <DateTimePickerInput date={date} onChange={onChange} />
          <StyledSeparator />
        </>
      )}
      <StyledTimeRow>
        <StyledTimeInputWrapper ref={timeInputWrapperRef}>
          <ClickOutsideListenerContext.Provider
            value={{
              excludedClickOutsideId: TIME_PICKER_DROPDOWN_ID,
            }}
          >
            <Dropdown
              dropdownId={TIME_PICKER_DROPDOWN_ID}
              dropdownPlacement="bottom-start"
              clickableComponent={
                <StyledTimeInputContainer>
                  <StyledClockIcon>
                    <IconClock size={16} />
                  </StyledClockIcon>
                  <StyledTimeDisplay>
                    {formatTime(currentHour, currentMinute)}
                  </StyledTimeDisplay>
                </StyledTimeInputContainer>
              }
              dropdownComponents={
                <DropdownContent widthInPixels={dropdownWidth}>
                  <TimePickerDropdown
                    hour={currentHour}
                    minute={currentMinute}
                    onHourChange={handleHourChange}
                    onMinuteChange={handleMinuteChange}
                    onNow={handleNow}
                    onClose={handleCloseDropdown}
                  />
                </DropdownContent>
              }
            />
          </ClickOutsideListenerContext.Provider>
        </StyledTimeInputWrapper>
        <StyledRightControls>
          <LightIconButton Icon={IconCalendar} size="medium" disabled />
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
