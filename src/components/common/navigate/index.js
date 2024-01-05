import { Button, HStack, Spacer } from '@chakra-ui/react';
import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function Navigate({ hasNext, hasPrev, next, prev }) {
  const disabledPrev = !hasPrev;
  const disabledNext = !hasNext;
  return (
    <HStack>
      <Button
        minW="45px"
        className={`${
          disabledPrev
            ? 'bg-orange-500 opacity-50 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-400'
        } shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
        disabled={disabledPrev}
        onClick={prev}
      >
        <FaArrowLeft />
      </Button>
      <Spacer />
      <Spacer />
      <Button
        minW="45px"
        className={`${
          disabledNext
            ? 'bg-orange-500 opacity-50 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-400'
        } shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`}
        disabled={disabledNext}
        onClick={next}
      >
        <FaArrowRight />
      </Button>
    </HStack>
  );
}
