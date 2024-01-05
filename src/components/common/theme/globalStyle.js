import { mode } from '@chakra-ui/theme-tools';

const globalStyles = (props) => ({
  'html, body': {
    fontSize: '14px',
    height: '100%',
    margin: '0px',
    bg: mode('#F5F4F5', '#121212')(props),
  },
  '.mainBg': {
    bg: mode('#F5F4F5', '#121212')(props),
  },
  '.blockBg': {
    bg: mode('White', '#363636')(props),
  },
  '.redBg': {
    bg: mode('#FFF0EF', '#4B1F1A')(props),
  },
  '.loginBlock input, .loginBlock select,.blockBg input, .blockBg select,.css-yk16xz-control':
    {
      bg: mode('#f4f4f4 !important', '#121212 !important')(props),
      borderColor: '#ACABAB !important',
      // bg: '#F4F4F4',
      borderRadius: '4px',
    },

  '.loginBlock': {
    bg: mode('#fff', '#363636')(props),
  },

  h2: {
    fontSize: '1.1em',
  },
  h1: {
    fontSize: '1.7em',
    fontWeight: 'bold',
  },
  '.error': {
    color: '#B72618',
  },
  '.slick-next:before, .slick-prev:before': {
    color: '#B72618',
  },
  ' :focus': {
    outline: '0 !important',
    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0) !important',
  },
  '.chakra-icon': {
    color: mode('#fff', '#fff')(props),
  },
  '.grid': {
    maxH: '300px',
    spacing: '2',
    rounded: 'xl',
    boxShadow: 'md',
    mr: '3',
    bg: mode('White', '#121212')(props),
    align: 'stretch',
    border: '1px solid #ACABAB !important',
  },
  '.gridHeader': {
    width: 'full',
    align: 'flex-start',
    bg: mode('#FFF0EF', '#4B1F1A')(props),
    p: '2',
    roundedTop: 'xl',
    color: mode('Black', 'White')(props),
    height: '36px',
    borderBottom: '1px solid #ACABAB',
  },
  '.gridGrayHeader': {
    width: 'full',
    align: 'flex-start',
    bg: mode('#F0F2F2', '#f1f3f3')(props),
    p: '2',
    roundedTop: 'xl',
    color: mode('Black', 'White')(props),
    height: '36px',
  },
  '.gridBottom': {
    bg: '#F2F2F2',
    p: '2',
    roundedBottom: 'xl',
    boxShadow: 'md',
    borderWidth: '1px',
    w: '265px',
    maxH: '100px',
    mb: '4',
  },
  '.accordionItem': {
    bg: mode('#FFF0EF', '#4B1F1A')(props),
    color: mode('Black', 'White')(props),
    borderBottomWidth: '3px',
    borderColor: 'brand.red',
  },
  '.orderAccordianItem': {
    bg: mode('White', '#121212')(props),
    color: mode('#000', '#fff')(props),
    padding: '10px',
    p: '3',
    boxShadow: 'lg',
    border: '2px solid #e4e4e4',
  },
  '.orderAccordianPanel': {
    border: '1px solid #c4c4c4',
    bg: mode('#fff', '#363636')(props),
  },
  '.productBox': {
    borderRadius: '10',
    p: '4',
    textAlign: 'left',
    w: { base: '100%', lg: '250px' },
    cursor: 'pointer',
    _hover: {
      boxShadow:
        '0px 2px 4px rgba(59, 69, 123, 0.2), 0px 4px 8px rgba(92, 107, 192, 0.2)',
    },
    border: '1px solid #D6D7E3',
    mr: '2',
  },
  '.tagItem': {
    mr: '2',
    borderColor: mode('#DCDADA', '#121212')(props),
    bg: mode('#F5F4F5', '#121212')(props),
    borderWidth: '1px ',
    borderRadius: '0 ',
    p: '2 ',
    borderLeftWidth: '3px ',
    borderLeftColor: 'brand.red',
    m: '2 ',
  },
  '.myorderOption': {
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  '.statusAlert': {
    borderRadius: '50px',
    bg: '#F20000',
    color: '#fff',
    px: '13px',
    width: 'fit-content',
  },

  '.chakra-tabs__tab-panel': {
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
  },
  '.socialIcon': {
    fontSize: '25px',
    borderRadius: '10px',
  },
  '.chakra-input': {
    border: '1px solid #ACABAB !important',
    autoComplete: 'off',
    bg: mode('#F4F4F4 !important', '#363636 !important')(props),
  },
  /* Elastic search categroy page facet Style*/
  '.sui-layout-header': {
    display: 'none',
  },
  '.sui-layout-body': {
    bg: 'none !important',
  },
  '.sui-layout-sidebar': {
    bg: mode('White', '#363636')(props),
    marginRight: '30px',
    padding: '20px !important',
    borderRadius: '10',
    width: '20% !important',
  },
  '.sui-layout-main': {
    bg: mode('White', '#363636')(props),
    padding: '20px !important',
    borderRadius: '10',
  },
  '.sui-layout-body__inner': {
    maxWidth: '100% !important',
    padding: '0px !important',
  },
  '.sui-layout-body:after': {
    height: '0px !important',
  },
  '.sui-sorting__label': {
    fontWeight: 'bold',
  },
  '.sui-layout-main-footer': {
    marginTop: '20px'
  },
  '.scrollBar::-webkit-scrollbar': {
    width: '8px',
  },
  '.sui-paging .rc-pagination-item a': {
    color: '#B72618 !important'
  },
  '.sui-paging .rc-pagination-item-active a': {
    color: '#1A202C !important',
    fontSize: '1.2em !important'
  },
  '.rc-pagination-prev , .rc-pagination-next': {
    background: '#B72618 !important',
  },
  '.rc-pagination-prev a , .rc-pagination-next a': {
    color: '#fff !important'
  },
  '.rc-pagination-disabled': {
    background: '#C4C4C4 !important'
  },
  '.rc-pagination-disabled a': {
    color: '#000 !important'
  },
  '.scrollBar::-webkit-scrollbar-track': {
    background: '#E5E5E5',
    borderRadius: '10px',
  },
  '.scrollBar::-webkit-scrollbar-thumb': {
    borderRadius: '10px',
    background: '#CACACA',
    border: '2px solid #E5E5E5',
  },
  input: {
    borderColor: '#ACABAB !important',
    autocomplete: 'off',
    bg: mode('#F4F4F4 !important', '#363636 !important')(props),
    borderRadius: '4px',
  },
  '.PhoneInput': {
    border: '1px solid #ACABAB', borderRadius: '6px', padding: '6px',
    bg: mode('#F4F4F4 !important', '#363636 !important')(props),
  },
  '.PhoneInputInput': {
    bg: mode('#F4F4F4 !important', '#363636 !important')(props),
  },
  select: {
    borderColor: '#ACABAB !important',
    bg: mode('#F4F4F4 !important', '#363636 !important')(props),
  },
  '.overflow-ellipsis': {
    width: '150px',
    // background-color: '#fff;
    // padding: 15px;
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
});
export default globalStyles;
