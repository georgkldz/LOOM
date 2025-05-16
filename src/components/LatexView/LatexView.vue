<template>
  <div class="latex-view" v-html="renderedLatex"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, toRefs, unref } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import type { LatexViewProps } from './LatexView';
import { LatexViewComponent } from './LatexView';

const props = defineProps<LatexViewProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new LatexViewComponent(storeObject, unref(componentID), unref(componentPath));
const state = component.getComponentState();
const dependencies = component.loadDependencies();

const latex = computed(() => {
  return (
    dependencies.value.referenceValue ??
    state.value.fieldValue ??
    ""
  );
});


const renderedLatex = computed(() =>
  katex.renderToString(latex.value, {
    displayMode: false,
    throwOnError: false,
    errorColor: '#cc0000',
  })
);

onMounted(() => component.validate(latex.value));
</script>

<style scoped>
.latex-view {
  width: 100%;
  overflow-x: auto;
}
</style>
