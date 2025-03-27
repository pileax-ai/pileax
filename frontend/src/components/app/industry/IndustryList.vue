<template>
  <div class="industry-list">
    <div class="row items-center">
      <div class="text-readable standard-label" v-if="showLabel">
        {{ standard.label }}
      </div>
      <div :class="{'q-pl-md': showLabel}">
        <o-chip :color="color || standard.color" :dense="dense"
                square clickable @click="selectIndustry(1)">
          {{ data.name1 }}
        </o-chip>
        <o-chip :color="color || standard.color" :dense="dense"
                square clickable @click="selectIndustry(2)"
                v-if="data.name2">
          {{ data.name2 }}
        </o-chip>
        <o-chip :color="color || standard.color"  :dense="dense"
                square clickable @click="selectIndustry(3)"
                v-if="data.name3">
          {{ data.name3 }}
        </o-chip>
        <o-chip :color="color || standard.color" :dense="dense"
                square clickable @click="selectIndustry(4)"
                v-if="data.name4">
          {{ data.name4 }}
        </o-chip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed} from 'vue';
import { getArrayItem, IndustryStandards } from 'src/app/metadata';
import useRouter from 'core/hooks/useRouter';

const props = defineProps({
  data: {
    type: Object,
    default: function () {
      return {}
    }
  },
  color: {
    type: String,
    default: ''
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  selectRoute: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['select']);
const { router } = useRouter();

const standard = computed(() => {
  return getArrayItem(IndustryStandards, props.data?.type)
})

function selectIndustry(level: number) {
  const code = props.data.code;
  let levelCode = '';
  switch (props.data.type) {
    case 'CSRC':
      levelCode = level === 1 ? props.data.parentCode : code;
      break;
    case 'CSI':
    case 'SWS':
      levelCode = code.substring(0, 2 * level)
      break;
    default:
      return;
  }
  levelCode += `.${props.data.type}`;
  emit('select', levelCode);

  if (props.selectRoute) {
    router.push({name: 'base-industry-details', query: {code: levelCode}});
  }
}
</script>

<style lang="scss">
.industry-list {
  .standard-label {
    min-width: 120px;
  }
}
</style>
