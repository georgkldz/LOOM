/**
 * Export LOOM
 */
import LOOM from "@/LOOM/LOOM.vue";

export { LOOM };

/**
 * Export Base Component
 */
import { BaseComponent } from "./components/BaseComponent/BaseComponent";

export { BaseComponent };

/**
 * Export all Vue-components
 */
import CollaborativeForm from "./components/CollaborativeForm/CollaborativeForm.vue";
import CodeEditor from "./components/CodeEditor/CodeEditor.vue";
import DOTGraph from "./components/DOTGraph/DOTGraph.vue";
import GenericButton from "./components/GenericButton/GenericButton.vue";
import GenericForm from "./components/GenericForm/GenericForm.vue";
import InputField from "./components/InputField/InputField.vue";
import LatexInputField from "./components/LatexInputField/LatexInputField.vue";
import LatexView from "@/components/LatexView/LatexView.vue";
import PictureView from "@/components/PictureView/PictureView.vue";
import SampleSolutionView from "@/components/SampleSolutionView/SampleSolutionView.vue";
import SimpleForm from "./components/SimpleForm/SimpleForm.vue";
import TextView from "./components/TextView/TextView.vue";

export const CARPETComponents = {
  CodeEditor,
  CollaborativeForm,
  DOTGraph,
  GenericButton,
  GenericForm,
  InputField,
  LatexInputField,
  LatexView,
  PictureView,
  SampleSolutionView,
  SimpleForm,
  TextView
};

import type { SerializedDOTGraphComponent } from "./components/DOTGraph/DOTGraph";
import type { SerializedInputFieldComponent } from "./components/InputField/InputField";
import type { SerializedButtonComponent } from "./components/GenericButton/GenericButton";
import type { SerializedFormComponent } from "./components/GenericForm/GenericForm";
import type { SerializedCodeEditorComponent } from "./components/CodeEditor/CodeEditor";
import type { SerializedLatexInputFieldComponent } from "./components/LatexInputField/LatexInputField";
import type { SerializedTextViewComponent } from "./components/TextView/TextView";
import type { SerializedCollabFormComponent } from "./components/CollaborativeForm/CollaborativeForm";
import type { SerializedSimpleFormComponent } from "@/components/SimpleForm/SimpleForm";
import type { SerializedLatexViewComponent } from "@/components/LatexView/LatexView";
import type { SerializedSampleSolutionComponent } from "@/components/SampleSolutionView/SampleSolutionView";
import type { SerializedPictureViewComponent } from "@/components/PictureView/PictureView";

export type SerializedCARPETComponents =
  | SerializedButtonComponent
  | SerializedCodeEditorComponent
  | SerializedCollabFormComponent
  | SerializedDOTGraphComponent
  | SerializedFormComponent
  | SerializedInputFieldComponent
  | SerializedLatexInputFieldComponent
  | SerializedLatexViewComponent
  | SerializedPictureViewComponent
  | SerializedSampleSolutionComponent
  | SerializedSimpleFormComponent
  | SerializedTextViewComponent

export interface SerialisedComponents {
  [id: number]: SerializedCARPETComponents;
}

/**
 * Export all types
 */
export * from "./stores/Store";
export * from "./components/BaseComponent/BaseComponent";
export * from "./components/DOTGraph/DOTGraph";
export * from "./components/InputField/InputField";
export * from "./components/GenericButton/GenericButton";
export * from "./components/GenericForm/GenericForm";
export * from "./components/CodeEditor/CodeEditor";
export * from "./components/LatexInputField/LatexInputField";
export * from "./components/TextView/TextView";
export * from "./components/CollaborativeForm/CollaborativeForm.vue";
export * from "./components/SimpleForm/SimpleForm";
export * from "./components/SampleSolutionView/SampleSolutionView";
export * from "./components/LatexView/LatexView.vue";
export * from "./components/PictureView/PictureView.vue";
