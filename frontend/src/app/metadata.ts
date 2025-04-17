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

export const StatTypes = [
  { label: '用户', value: 'user', icon: 'person', color: 'blue' },
  { label: '商品', value: 'collectible', icon: 'layers', color: 'purple' },
  { label: '订单', value: 'order', icon: 'list_alt', color: 'cyan' },
  { label: '话题', value: 'post', icon: 'forum', color: 'teal' },
  { label: '对话', value: 'chat', icon: 'table_view', color: 'teal' },
  { label: '会话', value: 'chat_session', icon: 'forum', color: 'indigo' },
  { label: '交易记录', value: 'transaction', icon: 'list_alt', color: 'cyan' },
  { label: '奖励记录', value: 'reward_record', icon: 'emoji_events', color: 'deep-purple' },
  { label: '活跃用户', value: 'active_record', icon: 'accessibility', color: 'lime' },
];

export const Platforms = [
  { label: 'Android', value: 'android', icon: 'article', color: 'blue' },
  { label: 'iOS', value: 'ios', icon: 'article', color: 'indigo' },
];
export const SlidePlatforms = [
  { label: '全部', value: 1, icon: 'article', color: 'blue' },
  { label: 'App', value: 2, icon: 'article', color: 'indigo' },
  { label: 'Web/H5', value: 3, icon: 'article', color: 'indigo' },
];
export const SlideScenarios = [
  { label: '发现', value: 1, icon: 'article', color: 'blue' },
  { label: '首页', value: 2, icon: 'article', color: 'indigo' },
];
export const MenuActions = [
  { label: '无', value: 0, icon: 'article', color: 'blue' },
  { label: '路由', value: 1, icon: 'article', color: 'indigo' },
  { label: 'App内打开', value: 2, icon: 'article', color: 'green' },
  { label: '系统浏览器打开', value: 3, icon: 'article', color: 'cyan' },
];

export const Status = [
  { label: '禁用', value: -1, color: 'red' },
  { label: '未启用', value: 0, color: 'amber' },
  { label: '启用', value: 1, color: 'green' },
];

export const HttpMethods = [
  { label: 'GET', value: 'GET', icon: 'article', color: 'blue' },
  { label: 'POST', value: 'POST', icon: 'article', color: 'green' },
  { label: 'PUT', value: 'PUT', icon: 'article', color: 'orange' },
  { label: 'DELETE', value: 'DELETE', icon: 'article', color: 'red' },
];

export const FileTypes = [
  { label: '图片', value: 'image', icon: 'article', color: 'blue' },
  { label: '音频', value: 'audio', icon: 'article', color: 'green' },
  { label: '视频', value: 'video', icon: 'article', color: 'indigo' },
  { label: '模型', value: 'model', icon: 'article', color: 'purple' },
  { label: '文件', value: 'file', icon: 'article', color: 'purple' },
];
export const PayTypes = [
  { label: 'Alipay', value: 'alipay', icon: 'article', color: 'blue' },
  { label: 'Wechat Pay', value: 'wechat', icon: 'article', color: 'blue' },
  { label: 'PayPal', value: 'paypal', icon: 'article', color: 'blue' },
];


export const RoleTypes = [
  { label: '内置', value: 1, color: 'cyan' },
  { label: '自定义', value: 2, color: 'blue' },
];

export const MenuTypes :OptionValue[] = [
  { label: '目录', value: 1, icon: 'article', color: 'green' },
  { label: '菜单', value: 2, icon: 'article', color: 'blue' },
  { label: '按钮', value: 10, icon: 'article', color: 'primary' },
];

export const ShowStatus :OptionValue[] = [
  { label: '隐藏', value: -1, color: 'grey' },
  { label: '就绪', value: 0, color: 'amber' },
  { label: '显示', value: 1, color: 'blue' },
];


export const ActiveStatus :OptionValue[] = [
  { label: '否', value: 0, color: 'grey' },
  { label: '是', value: 1, color: 'blue' },
];

export const PlatformConfigTypes :OptionValue[] = [
  { label: '系统', value: 1, icon: 'article', color: 'blue' },
  { label: 'App', value: 10, icon: 'article', color: 'indigo' },
];


export const IndustryStandards :OptionValue[] = [
  { label: '国民经济行业分类', value: 'GB', icon: 'public', color: 'blue', tips: '国标' },
  { label: '申银万国行业分类', value: 'SWS', icon: 'dataset', color: 'teal', tips: '申万' },
  { label: '中证行业分类', value: 'CSI', icon: 'dataset', color: 'indigo', tips: '中证' },
  { label: '证监会行业分类', value: 'CSRC', icon: 'dataset', color: 'cyan', tips: '证监会' },
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

