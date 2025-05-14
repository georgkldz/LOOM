<template>
  <div class="latex-view">
    <!-- KaTeX rendert im Block‑Modus -->
    <Katex :expression="latex" display-mode />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, toRefs, unref } from "vue";
import Katex from "@hsorby/vue3-katex";                    /* KaTeX‑Wrapper :contentReference[oaicite:2]{index=2}*/
import type { LatexViewProps } from "./LatexView";
import { LatexViewComponent } from "./LatexView";

const props = defineProps<LatexViewProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new LatexViewComponent(storeObject, unref(componentID), unref(componentPath));
const state = component.getComponentState();

const latex = computed(() => state.value.fieldValue ?? "");

onMounted(() => component.validate(latex.value));
</script>

<style scoped>
.latex-view {
  width: 100%;
  overflow-x: auto; /* lange Formeln nicht umbrechen */
}
</style>
