import { Flex, Select, Text } from '@chakra-ui/react';
import React, { memo } from 'react';
import { inputTextStyleProps } from '../../utils/stylesProps';

const TIME_OPTIONS = [
  '12 AM',
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
];

const HOURS = [
  {
    label: 'Mon',

    start: TIME_OPTIONS[0],
    end: TIME_OPTIONS[0],
  },
  {
    label: 'Tue',
    start: TIME_OPTIONS[0],
    end: TIME_OPTIONS[0],
  },
  {
    label: 'Wed',
    start: TIME_OPTIONS[0],
    end: TIME_OPTIONS[0],
  },
  {
    label: 'Thu',
    start: TIME_OPTIONS[0],
    end: TIME_OPTIONS[0],
  },
  {
    label: 'Fri',
    start: TIME_OPTIONS[0],
    end: TIME_OPTIONS[0],
  },
  {
    label: 'Sat',
    start: TIME_OPTIONS[0],
    end: TIME_OPTIONS[0],
  },
  {
    label: 'Sun',
    start: TIME_OPTIONS[0],
    end: TIME_OPTIONS[0],
  },
];

const HoursPickerMemo = ({ onStartSelected, onEndSelected, id, hours }) => (
  <>
    {hours?.map((h) => (
      <Flex key={h.label} alignItems="baseline" bg="#F2F2F2" pl="2">
        <Text w="15%" textAlign="right">
          {h.label}
        </Text>
        <Select
          bg="White"
          height="25px"
          fontSize="xs"
          width="45%"
          key={`${id}-${h.label}-start`}
          id={`${id}-${h.label}-start`}
          value={h.start}
          onChange={(e) => {
            onStartSelected(h, e.target.value);
            // handleHoursChange(true, true, h.label, e.target.value);
          }}
        >
          {TIME_OPTIONS.map((t) => (
            <option key={`s-${h}-${t}`} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select
          bg="White"
          width="45%"
          height="25px"
          fontSize="xs"
          key={`${id}-${h.label}-end`}
          id={`${id}-${h.label}-end`}
          value={h.end}
          onChange={(e) => {
            onEndSelected(h, e.target.value);

            // handleHoursChange(true, false, h.label, e.target.value);
          }}
        >
          {TIME_OPTIONS.map((t) => (
            <option key={`e-${h}-${t}`} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </Flex>
    ))}
  </>
);

const HoursPicker = memo(HoursPickerMemo);

export default HoursPicker;
