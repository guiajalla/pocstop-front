import { css } from '@emotion/react'

const wrapStyles = css`
  display: grid;
  grid-template-columns: 2fr 3fr 3fr;
  gap: 8px;
`

const subLabelStyles = css`
  font-size: 10px;
  color: #9ABFC2;
  display: block;
  margin-bottom: 3px;
  text-align: center;
  font-family: 'DM Sans', sans-serif;
`

const selectStyles = css`
  width: 100%;
  background: #F3F8F8;
  border: 1px solid #C2DFE0;
  border-radius: 6px;
  padding: 10px 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #1A3038;
  outline: none;
  appearance: none;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
  &:focus { border-color: #3AAFA9; background: white; }
  option { background: white; }
`

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const CURRENT_YEAR = new Date().getFullYear()
const ANOS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => CURRENT_YEAR - i)

export const DateSelect = ({ value, onChange, required }) => {
  const parts = value ? value.split('-') : ['', '', '']
  const anoVal = parts[0] || ''
  const mesVal = parts[1] ? Number(parts[1]) : ''
  const diaVal = parts[2] ? Number(parts[2]) : ''

  const diasNoMes = mesVal && anoVal
    ? new Date(Number(anoVal), Number(mesVal), 0).getDate()
    : 31
  const DIAS = Array.from({ length: diasNoMes }, (_, i) => i + 1)

  const update = (field, val) => {
    const next = { ano: anoVal, mes: mesVal, dia: diaVal, [field]: val }
    if (next.ano && next.mes && next.dia) {
      const mm = String(next.mes).padStart(2, '0')
      const dd = String(next.dia).padStart(2, '0')
      onChange(`${next.ano}-${mm}-${dd}`)
    } else {
      onChange('')
    }
  }

  return (
    <div css={wrapStyles}>
      <div>
        <span css={subLabelStyles}>Dia</span>
        <select
          css={selectStyles}
          value={diaVal}
          onChange={(e) => update('dia', Number(e.target.value))}
          required={required}
        >
          <option value="">--</option>
          {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <span css={subLabelStyles}>Mês</span>
        <select
          css={selectStyles}
          value={mesVal}
          onChange={(e) => update('mes', Number(e.target.value))}
          required={required}
        >
          <option value="">------</option>
          {MESES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
        </select>
      </div>
      <div>
        <span css={subLabelStyles}>Ano</span>
        <select
          css={selectStyles}
          value={anoVal}
          onChange={(e) => update('ano', e.target.value)}
          required={required}
        >
          <option value="">----</option>
          {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
    </div>
  )
}
