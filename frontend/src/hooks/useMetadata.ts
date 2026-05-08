
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

  const BookMediaTypes = computed(() => {
    return [
      { label: t('book.mediaType.digital'), value: 'digital', color: 'blue' },
      { label: t('book.mediaType.physical'), value: 'physical', color: 'cyan' },
    ]
  })

  const BookAnnotationTypes = computed(() => {
    return [
      { label: t('book.annotationType.all'), value: '', color: 'blue-grey', icon: 'notes' },
      { label: t('book.annotationType.highlight'), value: 'annotation', color: 'lime', icon: 'square' },
      { label: t('book.annotationType.bookmark'), value: 'bookmark', color: 'blue', icon: 'bookmark' },
      { label: t('book.annotationType.note'), value: 'note', color: 'purple', icon: 'article' },
    ]
  })

  const LLMTypes = computed(() => {
    return [
      { label: t('ai.models.chat'), value: 'chat', color: 'blue' },
      { label: t('ai.models.embedding'), value: 'embedding', color: 'indigo' },
      { label: t('ai.models.rerank'), value: 'rerank', color: 'indigo' },
      { label: t('ai.models.sttModel'), value: 'speech2text', color: 'indigo' },
      { label: t('ai.models.tts'), value: 'tts', color: 'indigo' },
    ]
  })

  const StandardColors = computed(() => {
    return [
      { label: t('appearances.colors.none'), value: '', icon: 'square', color: 'grey', hex: '#9e9e9e' },
      { label: t('appearances.colors.red'), value: 'red', icon: 'square', color: 'red', hex: '#f44336' },
      { label: t('appearances.colors.pink'), value: 'pink', icon: 'square', color: 'pink', hex: '#e91e63' },
      { label: t('appearances.colors.purple'), value: 'purple', icon: 'square', color: 'purple', hex: '#9c27b0' },
      { label: t('appearances.colors.deepPurple'), value: 'deep-purple', icon: 'square', color: 'deep-purple', hex: '#673ab7' },
      { label: t('appearances.colors.indigo'), value: 'indigo', icon: 'square', color: 'indigo', hex: '#3f51b5' },
      { label: t('appearances.colors.blue'), value: 'blue', icon: 'square', color: 'blue', hex: '#2196f3' },
      { label: t('appearances.colors.lightBlue'), value: 'light-blue', icon: 'square', color: 'light-blue', hex: '#03a9f4' },
      { label: t('appearances.colors.cyan'), value: 'cyan', icon: 'square', color: 'cyan', hex: '#00bcd4' },
      { label: t('appearances.colors.teal'), value: 'teal', icon: 'square', color: 'teal', hex: '#009688' },
      { label: t('appearances.colors.green'), value: 'green', icon: 'square', color: 'green', hex: '#4caf50' },
      { label: t('appearances.colors.lightGreen'), value: 'light-green', icon: 'square', color: 'light-green', hex: '#8bc34a' },
      { label: t('appearances.colors.lime'), value: 'lime', icon: 'square', color: 'lime', hex: '#cddc39' },
      { label: t('appearances.colors.yellow'), value: 'yellow', icon: 'square', color: 'yellow', hex: '#ffeb3b' },
      { label: t('appearances.colors.amber'), value: 'amber', icon: 'square', color: 'amber', hex: '#ffc107' },
      { label: t('appearances.colors.orange'), value: 'orange', icon: 'square', color: 'orange', hex: '#ff9800' },
      { label: t('appearances.colors.deepOrange'), value: 'deep-orange', icon: 'square', color: 'deep-orange', hex: '#ff5722' },
      { label: t('appearances.colors.brown'), value: 'brown', icon: 'square', color: 'brown', hex: '#795548' },
      { label: t('appearances.colors.grey'), value: 'grey', icon: 'square', color: 'grey', hex: '#9e9e9e' },
      { label: t('appearances.colors.blueGrey'), value: 'blue-grey', icon: 'square', color: 'blue-grey', hex: '#607d8b' },
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
    BookMediaTypes,
    BookAnnotationTypes,
    LLMTypes,
    StandardColors,
    WorkspaceMemberRoles,
    WorkspaceMemberStatus,
    WorkspaceTypes,
  }
}
