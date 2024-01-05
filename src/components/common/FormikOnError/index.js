export default function getFormErrorFocus(formik) {
  if (Object.keys(formik.errors).length > 0) {
    const el = document.getElementsByName(Object.keys(formik.errors)[0])[0];
    if (el) {
      if (el.tagName !== 'SELECT') el.focus();
    }
  }
}
