/**
 * Meta Data
 */

export const getArrayItem = (array :Indexable[], value :string, field = '') => {
  field = field || 'value'
  for (const item of array) {
    if (item[field] !== undefined && (item[field].toString() === value?.toString())) {
      return item as OptionValue
    }
  }
  return {} as OptionValue
}


export const Status = [
  { label: '禁用', value: -1, color: 'red' },
  { label: '未启用', value: 0, color: 'amber' },
  { label: '启用', value: 1, color: 'green' },
]

export const RefTypes = [
  { label: '未知', value: '', color: 'grey', icon: 'description' },
  { label: '图书', value: 'book', color: 'blue', icon: 'book' },
]
