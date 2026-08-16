import { useState } from 'react'

interface EmotionPickerProps {
  options: readonly string[]
  selected: string[]
  maxSelections?: number
  onChange: (selected: string[]) => void
}

export function EmotionPicker({ options, selected, maxSelections, onChange }: EmotionPickerProps) {
  const [message, setMessage] = useState('')

  function toggle(option: string) {
    if (selected.includes(option)) {
      setMessage('')
      onChange(selected.filter((item) => item !== option))
      return
    }
    if (maxSelections !== undefined && selected.length >= maxSelections) {
      setMessage(`最多选择 ${maxSelections} 项`)
      return
    }
    setMessage('')
    onChange([...selected, option])
  }

  return (
    <div>
      <div className="choice-grid choice-grid--tags" role="group" aria-label="选项">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={selected.includes(option)}
            onClick={() => toggle(option)}
            className="choice-button choice-button--tag"
          >
            {option}
          </button>
        ))}
      </div>
      {message && <p role="status">{message}</p>}
    </div>
  )
}
