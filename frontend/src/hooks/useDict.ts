import {computed, ref} from 'vue';
import { useDictStore } from 'stores/dict';
import { GET, POST } from 'src/hooks/useRequest';
export default function () {
  const dictStore = useDictStore();

  const roleOptions = computed(() => {
    return dictStore.roleOptions;
  });
  const tgbArticleOptions = computed(() => {
    return dictStore.tgbArticleOptions;
  });
  const tgbUserOptions = computed(() => {
    return dictStore.tgbUserOptions;
  });

  function initRoleOptions(api :string) {
    dictStore.initRoleOptions();
  }

  function initTgbArticleOptions(api :string) {
    dictStore.initTgbArticleOptions();
  }

  function initTgbUserOptions(api :string) {
    dictStore.initTgbUserOptions();
  }

  async function getDictOptions(dictKey: string) {
    return await GET({name: 'platformDictItemSelect', query: { dictKey: dictKey }})
  }

  return {
    roleOptions,
    tgbArticleOptions,
    tgbUserOptions,

    initRoleOptions,
    initTgbArticleOptions,
    initTgbUserOptions,
    getDictOptions,
  };
}
