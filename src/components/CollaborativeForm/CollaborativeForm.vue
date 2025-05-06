<template>
  <div class="row q-gutter-md form">
    <!-- ░░ linke Spalte – alles aus GenericForm ░░ -->
    <div class="col-12 col-md-6">
      <div
        v-for="(formFieldComponent, formFieldId) in nestedComponents.formComponents"
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
          :componentPath="`${componentPath}.nestedComponents.formComponents.${formFieldId}`"
        />
      </div>


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

const emit = defineEmits<CollabFormEmits>();
const props = defineProps<CollaborativeFormProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new CollaborativeFormComponent(storeObject, unref(componentID), unref(componentPath));
const dependencies = component.loadDependencies();
const nestedComponents = component.getNestedComponents();



// Wichtig: Zugriff auf die Rolle des Benutzers für Berechtigungsprüfung
const collabRoleId = computed(() => dependencies.value.collabRoleId as number|undefined);

const validationResult = ref(component.validate());
const formIsSubmitableWhen: keyof ValidationResult = unref(storeObject).getProperty(
  `${unref(componentPath)}.validationConfiguration.submitableWhen`
);

function mayWrite(role: number|undefined, fieldId: string) {
  // Dummy-Regel: nur Rolle 0 darf alle Felder, Rolle 1 nur 'explanation'
  if (role === 0) return true;
  if (role === 1) return fieldId === "explanation";
  return false;
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

<style>
.form__actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.form__elements-canvas{
  min-height: 140px;
  resize: vertical;
}
</style>