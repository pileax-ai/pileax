import {computed, ref} from 'vue';
import { useBusinessStore } from 'stores/business';
import { GET, POST } from 'src/hooks/useRequest';
export default function () {
  const store = useBusinessStore();

  const roleOptions = computed(() => {
    return store.roleOptions;
  });
  const stockAccountOptions = computed(() => {
    return store.stockAccountOptions;
  });
  const stockTradeStrategyOptions = computed(() => {
    return store.stockTradeStrategyOptions;
  });

  function initRoleOptions() {
    store.initRoleOptions();
  }

  function initStockAccountOptions() {
    store.initStockAccountOptions();
  }

  function initStockTradeStrategyOptions() {
    store.initStockTradeStrategyOptions();
  }

  return {
    roleOptions,
    stockAccountOptions,
    stockTradeStrategyOptions,

    initRoleOptions,
    initStockAccountOptions,
    initStockTradeStrategyOptions,
  };
}
