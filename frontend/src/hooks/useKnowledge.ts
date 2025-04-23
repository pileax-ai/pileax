import { computed, ref } from 'vue';
import { useKnowledgeStore } from 'stores/knowledge';
import { useNaviStore } from 'stores/navi.setup';
import { Knowledge } from 'src/types/knowledge'
import { MenuItem } from 'core/types/menu'

export default function () {
  const knowledgeStore = useKnowledgeStore();
  const naviStore = useNaviStore();
  const knowledgeId = ref('');
  const knowledge = ref<Knowledge>();

  const queryTimer = computed(() => {
    return knowledgeStore.queryTimer;
  })

  function setCurrentKnowledge(k: Knowledge) {
    const menuItem = {
      id: k.id,
      name: k.name,
      path: `/knowledge/${k.id}`,
      action: 1,
      meta: {
        type: 'knowledge',
        icon: '🍃',
        iconClass: 'emoji'
      }
    } as MenuItem;
    naviStore.setCurrentMenu(menuItem);
  }

  return {
    knowledgeStore,
    knowledgeId,
    knowledge,
    setCurrentKnowledge,
    queryTimer
  };
}
