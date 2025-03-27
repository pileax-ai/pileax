import { computed } from 'vue';

export default function () {
  const MenuActions = computed(() => {
    return [
      { label: '无', value: 0, icon: 'article', color: 'blue' },
      { label: '路由', value: 1, icon: 'article', color: 'indigo' },
      { label: 'App内打开', value: 2, icon: 'article', color: 'green' },
      { label: '系统浏览器打开', value: 3, icon: 'article', color: 'cyan' },
    ] as OptionValue[];
  });
  const Status = computed(() => {
    return [
      { label: '禁用', value: -1, color: 'red' },
      { label: '未启用', value: 0, color: 'amber' },
      { label: '启用', value: 1, color: 'green' },
    ] as OptionValue[];
  });

  return {
    MenuActions,
    Status
  };
}
