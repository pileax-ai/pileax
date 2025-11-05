import { boot } from 'quasar/wrappers';
import OBadge from 'core/components/misc/OBadge.vue';
import OChip from 'core/components/misc/OChip.vue';
import OCommonCard from 'core/components/card/OCommonCard.vue';
import OCommonItem from 'core/components/list/OCommonItem.vue';
import OConsolePage from 'core/page/template/OConsolePage.vue';
import OCopyBtn from 'core/components/button/OCopyBtn.vue';
import OField from 'core/components/form/field/OField.vue';
import OIcon from 'core/components/icon/OIcon.vue';
import OLink from 'core/components/misc/OLink.vue';
import ONoData from 'core/components/misc/ONoData.vue';
import ORefreshBtn from 'core/components/button/ORefreshBtn.vue';
import OQueryPage from 'core/page/template/OQueryPage.vue';
import OSvgIcon from 'core/components/icon/OSvgIcon.vue';
import OTooltip from 'core/components/misc/OTooltip.vue';
import OViewItem from 'core/components/list/OViewItem.vue';

import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

const globalComponents :Indexable = {
  'o-badge': OBadge,
  'o-chip': OChip,
  'o-common-card': OCommonCard,
  'o-common-item': OCommonItem,
  'o-console-page': OConsolePage,
  'o-copy-btn': OCopyBtn,
  'o-field': OField,
  'o-icon': OIcon,
  'o-link': OLink,
  'o-no-data': ONoData,
  'o-query-page': OQueryPage,
  'o-refresh-btn': ORefreshBtn,
  'o-svg-icon': OSvgIcon,
  'o-tooltip': OTooltip,
  'o-view-item': OViewItem,
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
