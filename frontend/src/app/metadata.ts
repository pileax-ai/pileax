/**
 * Meta Data
 */

export const getArrayItem = (array :Indexable[], value :string, field = '') => {
  field = field || 'value';
  for (const item of array) {
    if (item[field] !== undefined && (item[field].toString() === value?.toString())) {
      return item as OptionValue;
    }
  }
  return {} as OptionValue;
}


export const Status = [
  { label: '禁用', value: -1, color: 'red' },
  { label: '未启用', value: 0, color: 'amber' },
  { label: '启用', value: 1, color: 'green' },
];

export const ActiveStatus :OptionValue[] = [
  { label: '否', value: 0, color: 'grey' },
  { label: '是', value: 1, color: 'blue' },
];

export const TableViews = [
  { label: '列表', value: 'table', color: 'blue', icon: 'view_list' },
  { label: '卡片', value: 'grid', color: 'amber', icon: 'grid_view' },
];

export const ConnectionStatus = [
  { label: '不可用', value: -1, color: 'red', icon: 'close' },
  { label: '准备', value: 0, color: 'grey', icon: 'blur_on' },
  { label: '可用', value: 1, color: 'green', icon: 'check' },
];

export const RefTypes = [
  { label: '未知', value: '', color: 'grey', icon: 'description' },
  { label: '图书', value: 'book', color: 'blue', icon: 'book' },
];

export const WorkspaceTypes = [
  { label: '个人', value: 'personal', color: 'blue' },
  { label: '团队', value: 'team', color: 'indigo' },
];

