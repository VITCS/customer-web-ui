import { extendTheme } from '@chakra-ui/react';
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';
import { ButtonComponent, TableComponent } from './components';
import CustomSteps from './customSteps';
import globalStyles from './globalStyle';
const chakraUIColorMode = window.localStorage['chakra-ui-color-mode'];
const theme = extendTheme({
  config: {
    useSystemColorMode: chakraUIColorMode ? false : true,
    initialColorMode: 'light',
  },
  styles: {
    global: (props) => globalStyles(props),
  },
  components: {
    Steps: CustomSteps,
    Table: TableComponent,
    Button: ButtonComponent,
    //  Modal: ModalComponent
  },
  colors: {
    customRed: {
      500: '#B72618',
    },
    brand: {
      red: '#B72618', // red
      darkred: '#4B1F1A',
      green: '#3F6701', // green
      lightpink: '#FFF0EF', // lightpink
      grey: '#767676', // grey
      darkgrey: '#666666',
      lightgrey: '#C4C4C4',
    },
  },
  fontSizes: {
    xs: '0.7em', // 10px
    lg: '1.2em', // 16px
    xl: '1.4em', // 20px
    '2xl': '1.7em', // 24px
    '3xl': '2.2em', // 30px
  },
  fonts: {
    heading: 'Ibm Plex Sans',
    body: 'IBM Plex Sans',
  },
});
export default theme;
