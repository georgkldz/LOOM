/* src/components/SampleSolutionView/SampleSolutionView.ts                  */
import {
  BaseComponent,
  type SerializedBaseComponent,
  type SerialisedDependencies,
  type ComponentDependencies,
  type ComponentProps,
  type ComponentTypeSpecification,
  type NestedComponents,
  type ComponentState,
} from "@/components/BaseComponent/BaseComponent";
import { unref } from "vue";
import type { SerializedInputFieldComponent } from "@/components/InputField/InputField";
import type { SerializedLatexInputFieldComponent } from "@/components/LatexInputField/LatexInputField";
import type { SerializedTextViewComponent } from "@/components/TextView/TextView";
import type { SerializedButtonComponent } from "@/components/GenericButton/GenericButton";
import type { SerializedLatexViewComponent } from "@/components/LatexView/LatexView";

export type SampleSolutionViewComponentType = "SampleSolutionView";
export interface SampleSolutionViewProps extends ComponentProps {}

export interface SampleSolutionDependencies extends ComponentDependencies {}

export interface SampleSolutionState extends ComponentState {

}

export interface SampleSolutionNestedComponents extends NestedComponents {
  formComponents: {
    [key: string]:
      | SerializedInputFieldComponent
      | SerializedLatexInputFieldComponent
      | SerializedTextViewComponent
      | SerializedLatexViewComponent;

  };
  extraRightComponents: {
    [key: string]:
      | SerializedInputFieldComponent
      | SerializedLatexInputFieldComponent
      | SerializedTextViewComponent
      | SerializedLatexViewComponent;
  };
  solutionComponents:{
    [key: string]:
      | SerializedLatexViewComponent
  };

  actionComponents: {
    submit: SerializedButtonComponent;
    reset?: SerializedButtonComponent;
  };
}

/* Serialisierung */
export interface SerializedSampleSolutionComponent
  extends SerializedBaseComponent<SampleSolutionViewComponentType> {
  dependencies: SerialisedDependencies;
  state:        SampleSolutionState;
  nestedComponents: SampleSolutionNestedComponents;
}

/* Gesamt‑Spezifikation */
export interface SampleSolutionSpec extends ComponentTypeSpecification {
  SerializedComponent: SerializedSampleSolutionComponent;
  Dependencies:        SampleSolutionDependencies;
}

export class SampleSolutionViewComponent extends BaseComponent<SampleSolutionSpec> {

  public validate() {
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.isValid`,
      value: true,
    });
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.isCorrect`,
      value: true,
    });
    return { isValid: true, isCorrect: true };
  }
}
