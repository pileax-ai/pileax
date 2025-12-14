
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
      { label: t('workspaces.member-roles.owner'), value: 'owner', color: 'purple' },
      { label: t('workspaces.member-roles.admin'), value: 'admin', color: 'indigo' },
      { label: t('workspaces.member-roles.editor'), value: 'editor', color: 'cyan' },
      { label: t('workspaces.member-roles.normal'), value: 'normal', color: 'blue' },
    ]
  })

  const WorkspaceMemberStatus = computed(() => {
    return [
      { label: t('workspaces.member-status.disabled'), value: -1, color: 'red' },
      { label: t('workspaces.member-status.inviting'), value: 0, color: 'amber' },
      { label: t('workspaces.member-status.normal'), value: 1, color: 'green' },
    ]
  })

  const WorkspaceTypes = computed(() => {
    return [
      { label: t('workspaces.types.personal'), value: 'personal', color: 'blue' },
      { label: t('workspaces.types.team'), value: 'team', color: 'indigo' },
    ]
  })

  return {
    getArrayItem,
    WorkspaceMemberRoles,
    WorkspaceMemberStatus,
    WorkspaceTypes
  }
}
