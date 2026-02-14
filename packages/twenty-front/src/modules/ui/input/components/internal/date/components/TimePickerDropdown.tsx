import styled from '@emotion/styled';
import { useCallback, useEffect, useRef } from 'react';

const StyledDropdownContainer = styled.div`
  overflow: hidden;
`;

const StyledColumnsContainer = styled.div`
  display: flex;
  height: 240px;
`;

const StyledColumn = styled.div`
  flex: 1;
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.border.color.light};

  &:last-child {
    border-right: none;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border.color.medium};
    border-radius: 2px;
  }
`;

const StyledColumnItem = styled.div<{ isSelected?: boolean }>`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme, isSelected }) =>
    isSelected ? theme.font.weight.medium : theme.font.weight.regular};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.blue : theme.font.color.primary};
  background: ${({ theme, isSelected }) =>
    isSelected ? theme.background.transparent.blue : 'transparent'};

  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected
        ? theme.background.transparent.blue
        : theme.background.transparent.light};
  }
`;

const StyledFooter = styled.div`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
`;

const StyledNowButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.blue};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.border.radius.sm};

  &:hover {
    background: ${({ theme }) => theme.background.transparent.light};
  }
`;

const StyledOkButton = styled.button`
  background: ${({ theme }) => theme.color.blue};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme }) => theme.font.color.inverted};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(3)};

  &:hover {
    opacity: 0.9;
  }
`;

type TimePickerDropdownProps = {
  hour: number;
  minute: number;
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onNow: () => void;
  onClose: () => void;
};

export const TimePickerDropdown = ({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  onNow,
  onClose,
}: TimePickerDropdownProps) => {
  const hourColumnRef = useRef<HTMLDivElement>(null);
  const minuteColumnRef = useRef<HTMLDivElement>(null);

  const scrollToSelected = useCallback(() => {
    const itemHeight = 31.5;

    if (hourColumnRef.current !== null) {
      const scrollTo = hour * itemHeight - 2 * itemHeight;
      hourColumnRef.current.scrollTo({
        top: Math.max(0, scrollTo),
        behavior: 'smooth',
      });
    }

    if (minuteColumnRef.current !== null) {
      const scrollTo = minute * itemHeight - 2 * itemHeight;
      minuteColumnRef.current.scrollTo({
        top: Math.max(0, scrollTo),
        behavior: 'smooth',
      });
    }
  }, [hour, minute]);

  useEffect(() => {
    scrollToSelected();
  }, [scrollToSelected]);

  return (
    <StyledDropdownContainer>
      <StyledColumnsContainer>
        <StyledColumn ref={hourColumnRef}>
          {Array.from({ length: 24 }, (_, i) => (
            <StyledColumnItem
              key={i}
              isSelected={i === hour}
              onClick={() => onHourChange(i)}
            >
              {i.toString().padStart(2, '0')}
            </StyledColumnItem>
          ))}
        </StyledColumn>
        <StyledColumn ref={minuteColumnRef}>
          {Array.from({ length: 60 }, (_, i) => (
            <StyledColumnItem
              key={i}
              isSelected={i === minute}
              onClick={() => onMinuteChange(i)}
            >
              {i.toString().padStart(2, '0')}
            </StyledColumnItem>
          ))}
        </StyledColumn>
      </StyledColumnsContainer>
      <StyledFooter>
        <StyledNowButton onClick={onNow}>Now</StyledNowButton>
        <StyledOkButton onClick={onClose}>OK</StyledOkButton>
      </StyledFooter>
    </StyledDropdownContainer>
  );
};
