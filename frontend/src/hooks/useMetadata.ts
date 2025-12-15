
import { computed } from 'vue'
import useCommon from 'core/hooks/useCommon'

export default function() {
  const { t } = useCommon()

  const getArrayItem = (array :Indexable[], value :string, field = '') => {
    field = field || 'value'
    for (const item of array) {
      if (item[field] !== undefined && (item[field].toString() === value?.toString())) {
        return item as OptionValue
      }
    }
    return {} as OptionValue
  }

  const WorkspaceMemberRoles = computed(() => {
    return [
      { label: t('workspace.memberRoles.owner'), value: 'owner', color: 'purple' },
      { label: t('workspace.memberRoles.admin'), value: 'admin', color: 'indigo' },
      { label: t('workspace.memberRoles.editor'), value: 'editor', color: 'cyan' },
      { label: t('workspace.memberRoles.normal'), value: 'normal', color: 'blue' },
    ]
  })

  const WorkspaceMemberStatus = computed(() => {
    return [
      { label: t('workspace.memberStatus.disabled'), value: -1, color: 'red' },
      { label: t('workspace.memberStatus.inviting'), value: 0, color: 'amber' },
      { label: t('workspace.memberStatus.normal'), value: 1, color: 'green' },
    ]
  })

  const WorkspaceTypes = computed(() => {
    return [
      { label: t('workspace.types.personal'), value: 'personal', color: 'blue' },
      { label: t('workspace.types.team'), value: 'team', color: 'indigo' },
    ]
  })

  return {
    getArrayItem,
    WorkspaceMemberRoles,
    WorkspaceMemberStatus,
    WorkspaceTypes
  }
}
