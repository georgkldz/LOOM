<!-- src/components/PictureView/PictureView.vue -->
<template>
  <img
    :src="imgSrc"
    :alt="state.alt || 'Bild'"
    :style="imgStyle"
    @load="onLoad"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, toRefs, unref} from "vue";
import type { CSSProperties } from 'vue';
import type { PictureViewProps } from "@/components/PictureView/PictureView";
import { PictureViewComponent } from "@/components/PictureView/PictureView";

const props = defineProps<PictureViewProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new PictureViewComponent(
  storeObject,
  unref(componentID),
  unref(componentPath)
);

const state = component.getComponentState();
const dependencies = component.loadDependencies();

/* Bildquelle priorisieren: dependency.src → state.src */
const imgSrc = computed<string>(() =>  (dependencies.value.src ?? state.value.fieldValue) || "");
const imgStyle = computed((): CSSProperties => ({
  objectFit: state.value.objectFit ?? 'contain' ,
  width: '100%',
  height: 'auto'
}));

function onLoad() {
  component.validate(imgSrc.value);
}

onMounted(onLoad);
</script>

<style scoped>
/* Optional zusätzliche Styles */
</style>
