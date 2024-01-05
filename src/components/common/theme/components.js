import { mode } from '@chakra-ui/theme-tools';

export const ButtonComponent = {
  // style object for base or default style
  baseStyle: {
    px: 4,
    py: 2,
  },
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    base: {
      _hover: {
        bg: '#B72618 !important',
      },
      bg: '#B72618',
      color: '#FFF',
      fontWeight: 'normal',
      fontSize: { base: '12px', md: '14px' },
      border: '1px solid #B72618',
      height: { base: '22px', md: 'auto' },
      minWidth: { base: '60px', md: '100px' },
      _focus:{ background: '#a1170a'},
    },
    'dottedBorder-button': (props) => ({
      border: '1px dashed #717476',
      borderRadius: '10px',
      background: mode('#FFFFFF', '#131313')(props),
      fontSize: { base: '12px', md: '14px' },
      color: '#666',
      fontWeight: 'normal',
    }),
    link: {
      color: '#B72618',
      // textDecoration: 'underline',
      fontWeight: 'normal',
      _focus:{textDecoration: 'underline'},
    },
    'cancel-button': {
      fontSize: { base: '12px', md: '14px' },
      height: { base: '22px', md: 'auto' },
      border: '1px',
	    _focus:{ background:'#e2e3e4'},
    },
  },
  // default values for `size` and `variant`
  defaultProps: {
    size: '',
    variant: 'base',
  },
};
export const TableComponent = {
  variants: {
    spiritTable: (props) => ({
      tr: {
        borderColor: '#EEEEEE',
        borderBottomWidth: '1px',
        bg: mode('#F8F7F7', '#1F1F1F')(props),
        _odd: {
          bg: mode('#FFFFFF', '#131313')(props),
        },
      },
      th: {
        fontSize: '16px',
        background: 'brand.lightpink',
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      },
      td: {
        fontSize: '14px',
      },
    }),
    itemTable: (props) => ({
      tr: {
        bg: mode('#F8F7F7', '#1F1F1F')(props),
        _even: {
          bg: mode('#FFFFFF', '#131313')(props),
        },
      },
      th: {
        fontSize: '12px',
        color: mode('#000', '#FFF')(props),
        bg: mode('#F8F7F7', '#1F1F1F')(props),
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
        borderRight: '1px solid #b4b4b4',
      },
      td: {
        fontSize: '14px',
        borderRight: '1px solid #b4b4b4',
        color: mode('#000', '#FFF')(props),
      },
    }),
  },
};
// export const ModalComponent = {
//     sizes: {
//         lg: {
//             bg: "red",
//             w: '800px',
//         }
//     }//{ base: '100%', lg: '500px' },
// }
