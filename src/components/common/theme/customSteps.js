import { StepsStyleConfig } from 'chakra-ui-steps';

const CustomSteps = {
  ...StepsStyleConfig,
  variants: {
    statusSteps: (props) => ({
      ...StepsStyleConfig.baseStyle(props),
      stepIconContainer: {
        ...StepsStyleConfig.baseStyle(props).stepIconContainer,
        width: '15px',
        height: '15px',
      },
      icon: {
        ...StepsStyleConfig.baseStyle(props).icon,
        display: 'none',
      },
      iconLabel: {
        ...StepsStyleConfig.baseStyle(props).iconLabel,
        display: 'none',
      },
      connector: {
        ...StepsStyleConfig.baseStyle(props).connector,
      },
    }),
  },
};
export default CustomSteps;
