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
  <q-expansion-item
    v-if="hasMap(comp)"
    dense
    label="Einzelergebnisse"
  >
    <component
      v-for="([uid,val]) in Object.entries(comp.state.fieldValueByUser)"
      :is="comp.type"
      :key="`${id}-u${uid}`"
      :fieldValue="val"
      :readonly="true"
      :style="{ borderLeft:`4px solid ${userColor(uid)}` }"
    />
  </q-expansion-item>
</template>

<script setup lang="ts">
import type { SerializedBaseComponent } from '@/components/BaseComponent/BaseComponent'

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
