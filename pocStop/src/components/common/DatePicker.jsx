import { forwardRef } from 'react'
import DatePickerLib, { registerLocale } from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import { css, Global } from '@emotion/react'

registerLocale('pt-BR', ptBR)

const inputStyles = css`
  width: 100%;
  background: #F3F8F8;
  border: 1px solid #C2DFE0;
  border-radius: 6px;
  padding: 10px 13px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #1A3038;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  &:focus { border-color: #3AAFA9; background: white; }
  &::placeholder { color: #9ABFC2; }
`

const overridesStyles = css`
  .react-datepicker-wrapper { width: 100%; }

  .react-datepicker {
    font-family: 'DM Sans', sans-serif;
    border: 1px solid #C2DFE0;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.14);
    overflow: hidden;
  }
  .react-datepicker__triangle { display: none; }

  .react-datepicker__header {
    background: #D4EEF0;
    border-bottom: 1px solid #C2DFE0;
    padding: 12px 16px 10px;
    border-radius: 0;
  }
  .react-datepicker__current-month {
    font-size: 15px;
    font-weight: 500;
    color: #1A3038;
    margin-bottom: 8px;
    text-transform: capitalize;
  }
  .react-datepicker__navigation { top: 14px; }
  .react-datepicker__navigation-icon::before { border-color: #1A3038; }
  .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
    border-color: #3AAFA9;
  }

  .react-datepicker__month-dropdown-container,
  .react-datepicker__year-dropdown-container {
    select {
      background: white;
      border: 1px solid #C2DFE0;
      border-radius: 4px;
      padding: 3px 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      color: #1A3038;
      outline: none;
      cursor: pointer;
      appearance: none;
      &:focus { border-color: #3AAFA9; }
    }
  }

  .react-datepicker__day-name {
    color: #5A7A80;
    font-size: 11px;
    font-weight: 500;
    width: 2rem;
    line-height: 2rem;
  }
  .react-datepicker__day {
    color: #1A3038;
    font-size: 13px;
    width: 2rem;
    line-height: 2rem;
    border-radius: 50% !important;
    &:hover { background: #E3F4F4; border-radius: 50% !important; }
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--selected:hover {
    background: #3AAFA9 !important;
    color: white !important;
    font-weight: 600;
    border-radius: 50% !important;
  }
  .react-datepicker__day--keyboard-selected {
    background: #D4EEF0;
    color: #1A3038;
    border-radius: 50% !important;
  }
  .react-datepicker__day--outside-month { color: #C8DFE1; }
  .react-datepicker__day--today { font-weight: 600; }
`

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <input
    ref={ref}
    css={inputStyles}
    value={value}
    onClick={onClick}
    onChange={() => {}}
    placeholder={placeholder}
    readOnly
  />
))
CustomInput.displayName = 'CustomInput'

export const DatePicker = ({ value, onChange }) => {
  const selected = value ? new Date(value + 'T00:00:00') : null

  const handleChange = (date) => {
    if (!date) { onChange(''); return }
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    onChange(`${yyyy}-${mm}-${dd}`)
  }

  return (
    <>
      <Global styles={overridesStyles} />
      <DatePickerLib
        selected={selected}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        locale="pt-BR"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={new Date()}
        minDate={new Date('1920-01-01')}
        placeholderText="dd/mm/aaaa"
        customInput={<CustomInput />}
        popperPlacement="bottom-start"
      />
    </>
  )
}
