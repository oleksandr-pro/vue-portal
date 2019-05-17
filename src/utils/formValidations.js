import i18n from '@/i18n'
import currencyFromat from 'currency-format'

export let currencyFormatISO = Object.keys(currencyFromat);

export const shouldBeNumber = (value = '') => isNaN(value) ? i18n.t('common.form_validations.must_be_a_number') : parseFloat(value) < .01 ? i18n.t('common.form_validations.enter_a_positive_number') :"";
export const requiredField = (value = '') => {return (value + '').trim() === '' ? i18n.t('common.form_validations.required_field') : ''}

export const exactNumber = (chrCount) => (value = '') => value.length === chrCount ? '' : i18n.t('common.form_validations.count_chars', {chrCount: chrCount})

/*export const limitedCharNumber = (min, max = 15) => (value = '') => value.length <= max && value.length >= min ?
  '' : `should be ` + (isFinite(max) ? ` form ${min} to ${max} characters` : `  ${min} characters minimum`)*/

export const limitedCharNumber = (min, max = 15) => (value = '') => value.length <= max && value.length >= min ?
  '' : i18n.t('common.form_validations.should_be') + (isFinite(max) ? i18n.t('common.form_validations.max_chars', {max: max}) : i18n.t('common.form_validations.min_chars', {min: min}))

export const mustBeAnEmail = (value) => (/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(value) ? '' : i18n.t('common.form_validations.valid_email')
export const mustBeAValidISOcurrency = (curr) => {
  return currencyFormatISO.indexOf(curr) >= 0 ? '' : i18n.t('common.form_validations.valid_iso_currency_code')
}
export const breakInput = charNumber => val => typeof val === 'string' ? val.trim().length <= charNumber : false
export const defBreakInput = breakInput(10)

export const verifySpecialCharacter = (val) => {
  const reg = /^[0-9a-zA-Z]*$/g
  return reg.test(val) ? '' : i18n.t('common.form_validations.letters_and_digits_only')
}