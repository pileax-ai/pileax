
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

  const StandardColors = computed(() => {
    return [
      { label: t('appearances.colors.none'), value: '', icon: 'square', color: 'grey' },
      { label: t('appearances.colors.red'), value: 'red', icon: 'square', color: 'red' },
      { label: t('appearances.colors.pink'), value: 'pink', icon: 'square', color: 'pink' },
      { label: t('appearances.colors.purple'), value: 'purple', icon: 'square', color: 'purple' },
      { label: t('appearances.colors.deepPurple'), value: 'deep-purple', icon: 'square', color: 'deep-purple' },
      { label: t('appearances.colors.indigo'), value: 'indigo', icon: 'square', color: 'indigo' },
      { label: t('appearances.colors.blue'), value: 'blue', icon: 'square', color: 'blue' },
      { label: t('appearances.colors.lightBlue'), value: 'light-blue', icon: 'square', color: 'light-blue' },
      { label: t('appearances.colors.cyan'), value: 'cyan', icon: 'square', color: 'cyan' },
      { label: t('appearances.colors.teal'), value: 'teal', icon: 'square', color: 'teal' },
      { label: t('appearances.colors.green'), value: 'green', icon: 'square', color: 'green' },
      { label: t('appearances.colors.lightGreen'), value: 'light-green', icon: 'square', color: 'light-green' },
      { label: t('appearances.colors.lime'), value: 'lime', icon: 'square', color: 'lime' },
      { label: t('appearances.colors.yellow'), value: 'yellow', icon: 'square', color: 'yellow' },
      { label: t('appearances.colors.amber'), value: 'amber', icon: 'square', color: 'amber' },
      { label: t('appearances.colors.orange'), value: 'orange', icon: 'square', color: 'orange' },
      { label: t('appearances.colors.deepOrange'), value: 'deep-orange', icon: 'square', color: 'deep-orange' },
      { label: t('appearances.colors.brown'), value: 'brown', icon: 'square', color: 'brown' },
      { label: t('appearances.colors.grey'), value: 'grey', icon: 'square', color: 'grey' },
      { label: t('appearances.colors.blueGrey'), value: 'blue-grey', icon: 'square', color: 'blue-grey' },
    ]
  })

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
    StandardColors,
    WorkspaceMemberRoles,
    WorkspaceMemberStatus,
    WorkspaceTypes
  }
}
