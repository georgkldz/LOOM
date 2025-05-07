<template>
  <div class="latex-editor">
    <!-- Eingabebereich mit Quasar QInput -->
    <q-input
      v-if="isEditing"
      v-model="value"
      type="text"
      dense
      outlined
      v-bind="fieldConfiguration"
      :placeholder="fieldConfiguration.placeholder ?? ''"
      label=""
      class="editor"
      @focusin="handleFocusIn"
      @focusout="handleFocusOut"
      @update:model-value="onUserInput"
    >
      <template v-slot:prepend v-if="fieldConfiguration.prepend">
        <span class="prepend">{{ fieldConfiguration.prepend }}</span>
      </template>

      <!-- Vorschau im Label-Bereich -->
      <template v-slot:label>
        <span v-html="renderedLatexLabel"></span>
      </template>
      <template v-slot:hint v-if="fieldConfiguration.hint">
        {{ fieldConfiguration.hint }}
      </template>
    </q-input>

    <!-- Vorschau ohne Bearbeitung -->
    <q-input
       v-else
      :model-value="''"
      dense
      outlined
      readonly
      v-bind="fieldConfiguration"
      :placeholder="''"
      class="editor preview"
      @click="handleFocusIn"
    >
    <template v-slot:before v-if="fieldConfiguration.prepend">
        <span class="prepend">{{ fieldConfiguration.prepend }}</span>
    </template>
    <template #default>
      <span v-html="renderedLatexLabel" class="latex-preview"></span>
    </template>

    </q-input>

  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, toRefs, unref } from "vue";
import type { Ref } from "vue";
import { QInput } from "quasar";
import { LatexInputFieldComponent } from "@/components/LatexInputField/LatexInputField";
import type { LatexInputFieldProps } from "@/components/LatexInputField/LatexInputField";
import katex from "katex";
import "katex/dist/katex.min.css";

// Props aus der CARPET Component Library definieren
const props = defineProps<LatexInputFieldProps>();
const { storeObject, componentID, componentPath } = toRefs(props);

// LatexInputFieldComponent-Instanz erstellen
const component = new LatexInputFieldComponent(
  storeObject,
  unref(componentID),
  unref(componentPath),
);

// Aus dem Component-Objekt erhalten wir die Daten.
// Hier liegt z. B. fieldValue und ggf. andere Konfigurationen.
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

// Reaktive Variablen
const isEditing = ref(false); // Steuert den Bearbeitungsmodus

// Computed für Syntaxfehler (Verwendung von getSyntaxError aus TextView.ts)
const syntaxError = computed(() => component.getSyntaxError(value.value));

// Echtzeit-Rendering des LaTeX-Inhalts
const renderedLatexLabel = computed(() => {
  if (!value.value || value.value.trim() === "") {
    return "Hier Latex eingeben";
  }
  return syntaxError.value === null
    ? katex.renderToString(value.value, { throwOnError: true })
    : "Ungültiger LaTeX-Code";
});

const handleFocusIn = () => {
  isEditing.value = true;
};

const handleFocusOut = (event: FocusEvent) => {
  if (syntaxError.value) {
    event.preventDefault(); // Verhindert das Verlassen bei Fehler
    return;
  }
  isEditing.value = false;
};

// Initialisierung und Synchronisierung
onMounted(() => component.validate(value.value as any));

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

const onUserInput = (newValue: string | number | null) => {
  // 1) Wert in den Store schreiben
  unref(storeObject).setProperty({
    path: `${component.getComponentPath()}.state.fieldValue`,
    value: newValue
  });
  component.validate(value.value);
};

</script>

<style scoped>
.latex-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto;
}

.editor {
  height: 40px;
  line-height: 40px;
  padding: 0;
}

/* Spezifische Stile für die Vorschau im Default-Slot */
.preview .latex-preview {
  white-space: nowrap; /* Verhindert Zeilenumbrüche */
  overflow: hidden; /* Versteckt überflüssigen Inhalt */
  text-overflow: ellipsis; /* Zeigt "..." für abgeschnittenen Text */
  display: block; /* Sicherstellen, dass der Inhalt als Block dargestellt wird */
  width: 100%; /* Maximale Breite nutzen */
}
</style>


