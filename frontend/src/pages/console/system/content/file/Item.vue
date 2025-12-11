<template>
  <o-simple-form-page class="system-file"
                      :loading="loading">
    <q-input v-model="form.id" prefix="ID" outlined dense readonly />
    <q-input v-model="form.originalName" prefix="原始名称" outlined dense readonly />
    <q-input v-model="form.fileName" prefix="文件名称" outlined dense readonly />
    <q-input v-model="form.mimetype" prefix="MimeType" outlined dense readonly />
    <q-input v-model="form.path" prefix="路径" outlined dense readonly />
    <q-input v-model="form.size" prefix="文件大小" suffix="Bytes" outlined dense readonly />
    <q-select v-model="form.refType" prefix="业务类型" :options="RefTypes" map-options outlined dense readonly />
    <q-select v-model="form.status" prefix="状态" :options="Status" map-options outlined dense readonly />
    <q-input v-model="form.createTime" prefix="创建时间" outlined dense readonly />
    <q-input v-model="form.updateTime" prefix="更新时间" outlined dense readonly />
  </o-simple-form-page>
</template>

<script setup lang="ts">
import { onMounted, ref} from 'vue'
import OSimpleFormPage from 'core/page/template/OSimpleFormPage.vue'

import { GET } from 'src/hooks/useRequest'
import useForm from 'src/hooks/useForm'
import { RefTypes, Status } from 'src/app/metadata'

const apiName = 'file'
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['success'])
const { form, loading, actions } = useForm()

function load () {
  actions.initForm(apiName)

  if (props.id) {
    GET({name: apiName, query: {id: props.id}}).then(data => {
      form.value = data as Indexable
    })
  }
}

onMounted(() => {
  load()
})
</script>

<style lang="scss">
.system-file {
}
</style>
