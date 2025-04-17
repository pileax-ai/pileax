import { boot } from 'quasar/wrappers';
import OCommonCard from 'core/components/card/OCommonCard.vue';
import OCommonItem from 'core/components/list/OCommonItem.vue';
import OViewItem from 'core/components/list/OViewItem.vue';
import OConsolePage from 'core/page/template/OConsolePage.vue';
import OCopyBtn from 'core/components/button/OCopyBtn.vue';
import ORefreshBtn from 'core/components/button/ORefreshBtn.vue';
import OQueryPage from 'core/page/template/OQueryPage.vue';
import OBadge from 'core/components/misc/OBadge.vue';
import OChip from 'core/components/misc/OChip.vue';
import OIcon from 'core/components/misc/OIcon.vue';
import OTooltip from 'core/components/misc/OTooltip.vue';
import ONoData from 'core/components/misc/ONoData.vue';

import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

const globalComponents :Indexable = {
  'o-common-card': OCommonCard,
  'o-common-item': OCommonItem,
  'o-view-item': OViewItem,
  'o-console-page': OConsolePage,
  'o-copy-btn': OCopyBtn,
  'o-refresh-btn': ORefreshBtn,
  'o-query-page': OQueryPage,
  'o-icon': OIcon,
  'o-tooltip': OTooltip,
  'o-badge': OBadge,
  'o-chip': OChip,
  'o-no-data': ONoData,
};

export default boot(async ({ app }) => {
  for (const key in globalComponents) {
    app.component(key, globalComponents[key])
  }

  app.use(VXETable);

  app.config.globalProperties.$public = (path: string) => {
    return process.env.MODE === 'electron'
      ? path.startsWith('/') ? path.slice(1) : path
      : path
  }
});
