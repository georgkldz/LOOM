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
  type ComponentAction,
  type PublicComponentEmit,
  type ComponentEmits, type FetchAction, type ComponentActions
} from "@/components/BaseComponent/BaseComponent";
import { unref } from "vue";
import type { SerializedInputFieldComponent } from "@/components/InputField/InputField";
import type { SerializedLatexInputFieldComponent } from "@/components/LatexInputField/LatexInputField";
import type { SerializedTextViewComponent } from "@/components/TextView/TextView";
import type { SerializedButtonComponent } from "@/components/GenericButton/GenericButton";
import type { SerializedLatexViewComponent } from "@/components/LatexView/LatexView";
import type { CollabFormEmits, CollabFormPayload } from "@/components/CollaborativeForm/CollaborativeForm";
import type { JSONPathExpression } from "@/stores/Store";
import type { SerializedPictureViewComponent } from "@/components/PictureView/PictureView";

export type SampleSolutionViewComponentType = "SampleSolutionView";
export interface SampleSolutionViewProps extends ComponentProps {}

export interface SampleSolutionDependencies extends ComponentDependencies {}


export interface SampleSolutionAction extends FetchAction {
  externalValues?: {
    [key: string]: JSONPathExpression;
  };
}

/**
 * The FormComponent allows to emit a fetch-action on submitting the form.
 */
export interface SampleSolutionActions extends ComponentActions {
  submit: SampleSolutionAction;
}

export type SampleSolutionEmit = [actionType: "submit"] & PublicComponentEmit;

export type SampleSolutionEmits = {
  action: SampleSolutionEmit;
} & ComponentEmits;

export interface SampleSolutionState extends ComponentState {

}

export interface SampleSolutionNestedComponents extends NestedComponents {
  formComponents: {
    [key: string]:
      | SerializedInputFieldComponent
      | SerializedLatexInputFieldComponent
      | SerializedPictureViewComponent
      | SerializedTextViewComponent
      | SerializedLatexViewComponent;

  };
  extraRightComponents: {
    [key: string]:
      | SerializedInputFieldComponent
      | SerializedLatexInputFieldComponent
      | SerializedPictureViewComponent
      | SerializedTextViewComponent
      | SerializedLatexViewComponent;
  };
  solutionComponents:{
    [key: string]:
      | SerializedLatexViewComponent
    | SerializedPictureViewComponent
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
  actions: SampleSolutionActions;
}

/* Gesamt‑Spezifikation */
export interface SampleSolutionSpec extends ComponentTypeSpecification {
  SerializedComponent: SerializedSampleSolutionComponent;
  Dependencies:        SampleSolutionDependencies;
  Emits: SampleSolutionEmits;
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

  protected constructPayload() {
    return {};
  }

}
