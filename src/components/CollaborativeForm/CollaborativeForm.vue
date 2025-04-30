<!-- CollaborationForm.vue -->
<template>
  <QRow class="q-gutter-md">
    <!-- ░░░ linke Spalte ░░░ -->
    <QCol cols="12" md="6">
      <template
        v-for="(formFieldComponent, formFieldId) of nestedComponents.formComponents"
        :key="formFieldId"
      >
        <template v-if="isPrimary(formFieldComponent)">
          <CollabField
            :comp="formFieldComponent"
            :id="String(formFieldId)"
            :parentPath="componentPath"
            :storeObject="storeObject"
            :my-uid="myUid"
            :readonly="!mayWrite(roleId,String(formFieldId))"
          />
        </template>
      </template>
    </QCol>

    <!-- ░░░ rechte Spalte ░░░ -->
    <QCol cols="12" md="6">
      <template
        v-for="(formFieldComponent, formFieldId) of nestedComponents.formComponents"
        :key="formFieldId"
      >
        <template v-if="isSecondary(formFieldComponent)">
          <CollabField
            :comp="formFieldComponent"
            :id="String(formFieldId)"
            :parentPath="componentPath"
            :storeObject="storeObject"
            :my-uid="myUid"
            :readonly="!mayWrite(roleId,String(formFieldId))"
          />
        </template>
      </template>

      <!-- Submit-Button – ActionComponent -->
      <component
        class="form__actions-submit"
        :is="nestedComponents.actionComponents.submit.type"
        :storeObject="storeObject"
        componentID="submit"
        :componentPath="`${componentPath}.nestedComponents.actionComponents.submit`"
        :isValid="validationResult[formIsSubmitableWhen]"
        @buttonClick="component.actionHandler(emit, 'submit')"
      />
    </QCol>
  </QRow>
</template>


<script lang="ts" setup>
import { toRefs, unref, watch, ref, computed } from "vue";
import { CollaborativeFormComponent } from "@/components/CollaborativeForm/CollaborativeForm";
import type { CollaborativeFormProps, CollabFormEmits, ValidationResult } from "@/components/CollaborativeForm/CollaborativeForm";
import { FormComponent } from '@/components/GenericForm/GenericForm'
import type { FormProps, FormEmits } from '@/components/GenericForm/GenericForm'

import CollabField from "@/components/CollaborativeForm/CollabField.vue";

const emit = defineEmits<CollabFormEmits>();
const props = defineProps<CollaborativeFormProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new CollaborativeFormComponent(storeObject, unref(componentID), unref(componentPath));
const dependencies = component.loadDependencies();
const nestedComponents = component.getNestedComponents();

const myUid  = computed(() => unref(storeObject).getProperty('$.userId') as number|undefined)
const roleId = computed(() => unref(storeObject).getProperty('$.roleId') as number|undefined)

const validationResult = ref(component.validate());
const formIsSubmitableWhen: keyof ValidationResult = unref(storeObject).getProperty(
  `${unref(componentPath)}.validationConfiguration.submitableWhen`
);
function isPrimary(c: {type:string}){
  return ['InputField','LatexInputField','TextView'].includes(c.type)
}
function isSecondary(c:{name?:string}){
  return ['canvas','explanation','result'].includes(c.name ?? '')
}

function mayWrite(role:number|undefined, fieldId:string) {
  // Dummy-Regel: nur Rolle 0 darf alle Felder, Rolle 1 nur 'explanation' …
  if(role===0) return true
  if(role===1) return fieldId==='explanation'
  return false
}

/**
 * Watch for changes in external dependencies to validate the form.
 */
watch(
  () => dependencies,
  () => {
    validationResult.value = component.validate();
  },
  { deep: true, immediate: true }
);
/**
 * Watch for changes in the form fields to validate the form.
 */
watch(
  () => nestedComponents,
  () => {
    validationResult.value = component.validate();
  },
  { deep: true, immediate: true }
);
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
}

.form_elements {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: flex-end;

  justify-content: space-around;
  align-items: center;
}
</style>
