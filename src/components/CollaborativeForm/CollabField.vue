<!-- CollabField.vue -->
<template>
  <!-- Hauptfeld -->
  <component
    :is="comp.type"
    :storeObject="storeObject"
    :componentID="id"
    :componentPath="`${parentPath}.nestedComponents.formComponents.${id}`"
    :readonly="readonly"
  />

  <!-- Einzelergebnisse nur bei Feldern mit Map -->
  <QExpansionItem
    v-if="hasMap(comp)"
    expand-icon="expand_more"
    collapse-icon="expand_less"
    dense
    header-class="bg-primary text-white"
    :label="`Einzelergebnisse (${Object.keys(comp.state.fieldValueByUser).length})`"
  >
    <component
      v-for="([uid,val]) in Object.entries(comp.state.fieldValueByUser)"
      :key="`${id}-u${uid}`"
      :is="comp.type"
      :fieldValue="val"
      :readonly="true"
      :style="{ borderLeft:`4px solid ${userColor(uid)}` }"
    />
  </QExpansionItem>

</template>


<script setup lang="ts">
import type { SerializedBaseComponent } from '@/components/BaseComponent/BaseComponent'
import { QExpansionItem } from 'quasar';

/* ---------- Props ------------------------------------ */
defineProps<{
  comp: SerializedBaseComponent
  id: string
  parentPath: string
  storeObject: any
  readonly: boolean
}>()

/* ---------- Hilfsfunktionen --------------------------- */
function hasMap(c:SerializedBaseComponent):
  c is SerializedBaseComponent & { state:{ fieldValueByUser:Record<string,any> } }
{
  return 'fieldValueByUser' in (c.state as any)
}
function userColor(uid:string|number){
  return `hsl(${(+uid)*53%360} 70% 50%)`
}
</script>
