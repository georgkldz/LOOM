<template>
  <QInput
    standout
    bottom-slots
    v-model="value"
    v-bind="fieldConfiguration"
    @update:model-value="onUserInput"
  >
    <template v-slot:before v-if="fieldConfiguration.icon">
      <QIcon :name="fieldConfiguration.icon" />
    </template>

    <template v-slot:hint v-if="fieldConfiguration.hint"> {{ fieldConfiguration.hint }} </template>
  </QInput>
</template>

<script lang="ts" setup>
import { onMounted, watch, toRefs, unref, computed, ref } from "vue";
import type { Ref } from "vue";
import { InputFieldComponent } from "@/components/InputField/InputField";
import type { InputFieldProps } from "@/components/InputField/InputField";

import { QInput, QIcon } from "quasar";

const props = defineProps<InputFieldProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

const component = new InputFieldComponent(storeObject, unref(componentID), unref(componentPath));
const componentState = component.getComponentState();
const fieldConfiguration = component.getComponentConfiguration();

const dependencies = component.loadDependencies();

const value = computed({
  get: () =>
       dependencies.value.referenceValue
         ?? componentState.value.fieldValue,
       set: (newValue: string | number | null) => {
       unref(storeObject).setProperty({
           path : `${component.getComponentPath()}.state.fieldValue`,
           value: newValue
       });
       component.validate(newValue as any);
     }
 });
watch(
  () => dependencies.value.referenceValue,
  (newVal) => {
    if (newVal !== undefined) {

      if (componentState.value.fieldValue === "" ) {
        unref(storeObject).setProperty({
          path : `${component.getComponentPath()}.state.fieldValue`,
          value: newVal
        });
      }
      component.validate(newVal as any);
    }
  }
);

     onMounted(() => component.validate(value.value as any));



const onUserInput = (newValue: string | number | null) => {
  unref(storeObject).setProperty({
    path: `${component.getComponentPath()}.state.fieldValue`,
    value: newValue
  });

  component.validate(<string | number | undefined | null>value.value);
};
</script>

<style></style>
