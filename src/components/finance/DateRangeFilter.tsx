'use client'

import { DatePicker, Button, Dropdown, Typography } from 'antd'
import { CalendarOutlined, DownOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import { now, formatForDB, parseDate } from '@/lib/dateUtils'

const { RangePicker } = DatePicker
const { Text } = Typography

export interface DateRange {
  start: string
  end: string
}

interface DateRangeFilterProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
  size?: 'small' | 'middle' | 'large'
  presets?: boolean
}

// All presets use IST timezone via dateUtils
const getPresetRanges = () => {
  const today = now()
  return [
    { label: 'Today', getValue: () => ({ start: formatForDB(today.startOf('day')), end: formatForDB(today.endOf('day')) }) },
    { label: 'Yesterday', getValue: () => ({ start: formatForDB(today.subtract(1, 'day').startOf('day')), end: formatForDB(today.subtract(1, 'day').endOf('day')) }) },
    { label: 'Last 7 Days', getValue: () => ({ start: formatForDB(today.subtract(6, 'day').startOf('day')), end: formatForDB(today.endOf('day')) }) },
    { label: 'Last 30 Days', getValue: () => ({ start: formatForDB(today.subtract(29, 'day').startOf('day')), end: formatForDB(today.endOf('day')) }) },
    { label: 'This Month', getValue: () => ({ start: formatForDB(today.startOf('month')), end: formatForDB(today.endOf('month')) }) },
    { label: 'Last Month', getValue: () => ({ start: formatForDB(today.subtract(1, 'month').startOf('month')), end: formatForDB(today.subtract(1, 'month').endOf('month')) }) },
    { label: 'This Year', getValue: () => ({ start: formatForDB(today.startOf('year')), end: formatForDB(today.endOf('year')) }) },
  ]
}

export default function DateRangeFilter({ 
  value, 
  onChange, 
  placeholder = 'Select date range',
  size = 'small',
  presets = true 
}: DateRangeFilterProps) {
  const [showPicker, setShowPicker] = useState(false)
  const presetRanges = getPresetRanges()

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onChange({
        start: formatForDB(parseDate(dates[0]).startOf('day')),
        end: formatForDB(parseDate(dates[1]).endOf('day')),
      })
    } else {
      onChange(undefined)
    }
    setShowPicker(false)
  }

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    onChange(preset.getValue())
  }

  const getDisplayLabel = () => {
    if (!value) return placeholder
    const start = parseDate(value.start)
    const end = parseDate(value.end)
    
    // Check if it matches a preset
    for (const preset of presetRanges) {
      const presetValue = preset.getValue()
      if (parseDate(presetValue.start).isSame(start, 'day') && parseDate(presetValue.end).isSame(end, 'day')) {
        return preset.label
      }
    }
    
    // Show date range
    if (start.isSame(end, 'day')) {
      return start.format('DD MMM YYYY')
    }
    return `${start.format('DD MMM')} - ${end.format('DD MMM')}`
  }

  const dropdownContent = (
    <div style={{ padding: 8, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', minWidth: 200 }}>
      {presets && (
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 11, padding: '0 4px' }}>Quick Select</Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
            {presetRanges.map((preset) => (
              <Button
                key={preset.label}
                size="small"
                type={value && (() => {
                  const pv = preset.getValue()
                  return parseDate(pv.start).isSame(parseDate(value.start), 'day') && parseDate(pv.end).isSame(parseDate(value.end), 'day')
                })() ? 'primary' : 'default'}
                onClick={() => handlePresetClick(preset)}
                style={{ fontSize: 11 }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div style={{ borderTop: presets ? '1px solid #f0f0f0' : 'none', paddingTop: presets ? 8 : 0 }}>
        <Text type="secondary" style={{ fontSize: 11, padding: '0 4px' }}>Custom Range</Text>
        <RangePicker
          size={size}
          value={value ? [parseDate(value.start), parseDate(value.end)] : null}
          onChange={handleRangeChange}
          style={{ width: '100%', marginTop: 4 }}
          format="DD MMM YYYY"
        />
      </div>
      {value && (
        <div style={{ marginTop: 8, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
          <Button size="small" type="link" danger onClick={() => onChange(undefined)} style={{ padding: 0 }}>
            Clear
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      open={showPicker}
      onOpenChange={setShowPicker}
    >
      <Button
        size={size}
        icon={<CalendarOutlined />}
        style={{ 
          minWidth: 130,
          color: value ? '#1890ff' : undefined,
          borderColor: value ? '#1890ff' : undefined,
        }}
      >
        <span style={{ marginRight: 4 }}>{getDisplayLabel()}</span>
        <DownOutlined style={{ fontSize: 10 }} />
      </Button>
    </Dropdown>
  )
}
