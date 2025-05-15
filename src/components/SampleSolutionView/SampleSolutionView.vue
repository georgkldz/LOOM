<template>
  <div class="row q-gutter-md form">
    <!-- ░░ linke Seite: Karussell ░░ -->
    <div class="col-12 col-md-6">
      <q-carousel
        v-model="page"
        navigation
        control-type="flat"
      height="100%"
      >
      <!-- ① frühere linke Spalte (formComponents) -->
      <q-carousel-slide name="left">
        <template v-for="block in layoutBlocks" :key="block.name ?? block.id">
          <!-- Einzelkomponente ohne Accordion -->
          <component
            v-if="!block.children"
            :is="block.def.type"
            :storeObject="storeObject"
            :componentID="block.id"
            :componentPath="`${componentPath}.nestedComponents.formComponents.${block.id}`"
            readonly
            :class="['form__elements', `form__elements-${block.id}`]"
          />
          <!-- Accordion mit Kind‑Feldern -->
          <q-expansion-item
          v-else
          expand-separator
          class="form__elements-group"
          :label="block.label"
          >
          <component
            v-for="child in block.children"
            :key="child.id"
            :is="child.def.type"
            readonly
            :storeObject="storeObject"
            :componentID="child.id"
            :componentPath="`${componentPath}.nestedComponents.formComponents.${child.id}`"
            :class="[
                  'form__elements',
                  `form__elements-${child.id}`,
                  'role-' + child.id.slice(0, 2),
                ]"
          />
          </q-expansion-item>
        </template>
      </q-carousel-slide>

      <!-- ② frühere rechte Spalte (extraRightComponents) -->
      <q-carousel-slide name="right">
        <div
          v-for="(c, cid) in nestedComponents.extraRightComponents"
          :key="cid"
          class="q-mb-sm"
        >
          <component
            :is="c.type"
            :storeObject="storeObject"
            :componentID="cid"
            :componentPath="`${componentPath}.nestedComponents.extraRightComponents.${cid}`"
            readonly
          :class="['form__elements', `form__elements-${cid}`]"
          />
        </div>
      </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- ░░ rechte Seite: Musterlösung ░░ -->
    <div class="col-12 col-md-6 form__elements-right">
      <component
        v-for="(solComp, solId) in nestedComponents.solutionComponents"
        :key="solId"
        :is="solComp.type"
        :storeObject="storeObject"
        :componentID="solId"
        :componentPath="`${componentPath}.nestedComponents.solutionComponents.${solId}`"
        readonly
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  toRefs,
  unref,
  watch,
  nextTick,
  onMounted,
} from "vue";
import { SampleSolutionViewComponent } from "./SampleSolutionView";
import type { SampleSolutionViewProps } from "./SampleSolutionView";

const props = defineProps<SampleSolutionViewProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new SampleSolutionViewComponent(storeObject, unref(componentID), unref(componentPath),);
const nestedComponents = component.getNestedComponents();

const flat = computed(() =>
  Object.entries(nestedComponents.formComponents)
    .map(([id, def]) => ({
      id,
      def,
      ui: def.ui ?? { order: 0, accordion: false },
    }))
    .sort((a, b) => a.ui.order - b.ui.order),
);

const layoutBlocks = computed(() => {
  const result  = [];
  const byAccName = new Map();
  for (const item of flat.value) {
    if (!item.ui.accordion) {
      result.push(item);
    } else {
      let group = byAccName.get(item.ui.accordionName);
      if (!group) {
        group = {
          label: item.ui.accordionLabel,
          name: item.ui.accordionName,
          children: [],
        };
        byAccName.set(item.ui.accordionName, group);
        result.push(group);
      }
      group.children.push(item);
    }
  }
  return result;
});

/* Carousel‑Seite */
const page = ref<"left" | "right">("left");

/* sofortige Validierung (formal) */
onMounted(async () => {
  console.debug("SampleSolutionView, onMounted betreten")
  await nextTick();
  component.validate();
});
</script>

<style scoped>
.form__elements {
  margin-bottom: 0.5rem;
}
</style>
