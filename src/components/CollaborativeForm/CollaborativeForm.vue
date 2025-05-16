<template>
  <div class="row q-gutter-md form">
    <!-- ░░ linke Spalte – gruppierte Felder in Expansion Items ░░ -->
    <div class="col-12 col-md-6">
      <!-- nur EINE Schleife -->
      <template v-for="block in layoutBlocks" :key="block.name ?? block.id">

        <!-- Einzelkomponente ohne Accordion -->
        <component
          v-if="!block.children"
          :is="block.def.type"
          :storeObject="storeObject"
          :componentID="block.id"
          :componentPath="`${componentPath}.nestedComponents.formComponents.${block.id}`"
          readonly
          :class="[
            'form__elements',`form__elements-${block.id}`]"
        />

        <!-- Accordion mit Kind-Feldern -->
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
            :storeObject="storeObject"
            readonly
            :componentID="child.id"
            :componentPath="`${componentPath}.nestedComponents.formComponents.${child.id}`"
            :class="[
              'form__elements',
              `form__elements-${child.id}`,
              'role-' + child.id.slice(0, 2)
            ]"
          />
        </q-expansion-item>
      </template>
    </div>

    <!-- ░░ rechte Spalte – Dummy ░░ -->
    <div
      :class="{
        'col-12 col-md-6': true,
        'form__elements-right': true
      }"
    >
      <div
        v-for="(formFieldComponent, formFieldId) in nestedComponents.extraRightComponents"
        :key="formFieldId"
      >
        <component
          :class="{
            'form__elements'          : true,            // generelle Klasse
            [`form__elements-${formFieldId}`]: true      // instanz-spezifisch
          }"
          :is="formFieldComponent.type"
          :storeObject="storeObject"
          :componentID="formFieldId"
          :componentPath="`${componentPath}.nestedComponents.extraRightComponents.${formFieldId}`"
          :readonly="!mayWrite(myCollabRoleId, formFieldComponent.componentConfiguration?.editAllowedForRole)"
        />
      </div>
      <!-- Submit-Button rechte Spalte? -->
      <div class="form__actions q-mt-md">
        <component
          :is="nestedComponents.actionComponents.submit.type"
          :storeObject="storeObject"
          componentID="submit"
          :componentPath="`${componentPath}.nestedComponents.actionComponents.submit`"
          :isValid="validationResult[formIsSubmitableWhen]"
          @buttonClick="component.actionHandler(emit, 'submit')"
        />
      </div>
    </div>
  </div>
</template>



<script lang="ts" setup>

import { toRefs, unref, watch, ref, onMounted, computed, nextTick } from "vue";
import { CollaborativeFormComponent } from "@/components/CollaborativeForm/CollaborativeForm";
import type { CollaborativeFormProps, CollabFormEmits, ValidationResult } from "@/components/CollaborativeForm/CollaborativeForm";
import { QExpansionItem } from "quasar";

const emit = defineEmits<CollabFormEmits>();
const props = defineProps<CollaborativeFormProps>();
const { storeObject, componentID, componentPath } = toRefs(props);
const roleClass = (id: string) => "role-" + id.slice(0, 2);

const component = new CollaborativeFormComponent(storeObject, unref(componentID), unref(componentPath));
const dependencies = component.loadDependencies();
const nestedComponents = component.getNestedComponents();

/* 1️⃣  rohe Liste: [{ id, def, ui }] */
const flat = computed(() =>
  Object
    .entries(nestedComponents.formComponents)
    .map(([id, def]) => ({
      id,
      def,
      ui: def.ui ?? { order: 0, accordion: false }     // Fallback
    }))
    .sort((a, b) => a.ui.order - b.ui.order)            // stable order
);

/* 2️⃣  in Blöcke umwandeln (Accordion vs. Einzel-Komponente) */
const layoutBlocks = computed(() => {
  const result = [];
  const byAccName = new Map();                         /* für mehrfach-Push */
  for (const item of flat.value) {
    if (!item.ui.accordion) {
      result.push(item);                               // frei im Flow
    } else {
      let group = byAccName.get(item.ui.accordionName);
      if (!group) {
        group = {
          label: item.ui.accordionLabel,
          name:  item.ui.accordionName,
          children: []
        };
        byAccName.set(item.ui.accordionName, group);
        result.push(group);                            // Reihenfolge = first hit
      }
      group.children.push(item);
    }
  }
  return result;
});

// Wichtig: Zugriff auf die Rolle des Benutzers für Berechtigungsprüfung
const myCollabRoleId = unref(storeObject).getProperty(`$.myCollabRoleId`);

const validationResult = ref(component.validate());
const formIsSubmitableWhen: keyof ValidationResult = unref(storeObject).getProperty(
  `${unref(componentPath)}.validationConfiguration.submitableWhen`
);

function mayWrite(roleId: number | undefined,
                  allowedRoleId?: number): boolean {
  if (allowedRoleId === undefined) return true;
  console.debug("Loom, myCollabRoleId ist ", myCollabRoleId);
  return roleId === allowedRoleId;
}

// Watches für Validierung
watch(
  () => dependencies,
  () => {
    validationResult.value = component.validate();
  },
  { deep: true, immediate: true }
);

watch(
  () => nestedComponents,
  () => {
    validationResult.value = component.validate();
  },
  { deep: true, immediate: true }
);

onMounted(async () => {
  await nextTick();
  unref(storeObject).extractFieldValues();
});

</script>


<style lang="scss" scoped>
@use "quasar/src/css/variables" as q;
.form__actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.form__elements-canvas {
  min-height: 140px;
  resize: vertical;
}


$role-colors: (
  'r0': q.$blue-2,
  'r1': q.$green-2,
  'r2': q.$orange-2,
  'r3': q.$purple-2
);

@each $role, $color in $role-colors {
  .form__elements.role-#{$role} { background-color: $color; }
}

</style>
