<template>
  <div class="textview-fullwidth">
    <span
      v-for="(seg, idx) in textSegments"
      :key="idx"
      :class="computeClass(seg)"
    >
      {{ seg.text }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, watch, toRefs, unref } from "vue";

import { TextViewComponent } from "@/components/TextView/TextView";
import type { TextSegment, TextViewProps } from "@/components/TextView/TextView";

const props = defineProps<TextViewProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new TextViewComponent(storeObject, unref(componentID), unref(componentPath));
const componentState = component.getComponentState();
// const fieldConfiguration = component.getComponentConfiguration();

// const dependencies = component.loadDependencies();

const textSegments = computed(() => unref(componentState).textSegments || []);

function computeClass(seg: TextSegment) {
  return {
    "bold-text": seg.bold,
    "italic-text": seg.italic,
    [seg.cssClass ?? ""]: Boolean(seg.cssClass),
  }
}

onMounted(() => {
  const combined = textSegments.value.map(seg => seg.text).join(" ");
  component.validate(combined);
});

watch(
  () => textSegments.value,
  (newSegs) => {
    // Hier bauen wir den Text zusammen:
    const combined = newSegs.map(seg => seg.text).join(" ");
    component.validate(combined);
  },
  { deep: true }
);

</script>

<style scoped>
.textview-fullwidth {
  width: 500px;
  text-align: left;
}
.bold-text {
  font-weight: bold;
}
.italic-text {
  font-style: italic;
}
</style>
