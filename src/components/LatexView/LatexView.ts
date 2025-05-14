import {
  BaseComponent,
  type SerializedBaseComponent,
  type SerialisedDependencies,
  type ComponentDependencies,
  type ComponentProps,
  type ComponentTypeSpecification,
  type ComponentState,
} from "@/components/BaseComponent/BaseComponent";
import type { JSONPathExpression } from "@/stores/Store";
import { unref } from "vue";

export interface LatexViewProps extends ComponentProps {}
export type LatexViewComponentType = "LatexView";

export interface SerializedLatexViewDependencies
  extends SerialisedDependencies {
  referenceValue?: JSONPathExpression;
}

export interface LatexViewDependencies extends ComponentDependencies {
  referenceValue?: string | null | undefined;
}

export interface LatexViewComponentState extends ComponentState {
  fieldValue: string | null | undefined;
}

export interface SerializedLatexViewComponent
  extends SerializedBaseComponent<LatexViewComponentType> {
  dependencies: SerializedLatexViewDependencies;
  state: LatexViewComponentState;
}

export interface LatexViewSpecification extends ComponentTypeSpecification {
  SerializedComponent: SerializedLatexViewComponent;
  Dependencies:        LatexViewDependencies;
}

export class LatexViewComponent
  extends BaseComponent<LatexViewSpecification>
{

  public validate(expr: string | null | undefined) {
    const isValid = typeof expr === "string" && expr.trim().length > 0;
    const isCorrect = true;                         // keine Korrektheits­prüfung

    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.isValid`,
      value: isValid,
    });
    unref(this.storeObject).setProperty({
      path: `${this.serialisedBaseComponentPath}.state.isCorrect`,
      value: isCorrect,
    });

    return { isValid, isCorrect };
  }
}
