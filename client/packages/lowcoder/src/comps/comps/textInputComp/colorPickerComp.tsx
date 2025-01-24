import { Section, sectionNames } from "lowcoder-design";
import { BoolControl } from "comps/controls/boolControl";
import { styleControl } from "comps/controls/styleControl";
import { ColorPickerStyle, ColorPickerStyleType } from "comps/controls/styleControlConstants";
import { NameConfig } from "comps/generators/withExposing";
import styled, { css } from "styled-components";
import { UICompBuilder } from "../../generators";
import { FormDataPropertyView } from "../formComp/formDataConstants";
import { textInputChildren } from "./textInputConstants";
import { disabledPropertyView, hiddenPropertyView, } from "comps/utils/propertyUtils";
import { trans } from "i18n";
import { ColorPicker } from 'antd';
import { ArrayOrJSONObjectControl, changeEvent, dropdownControl, eventHandlerControl, jsonObjectExposingStateControl, stringExposingStateControl, withDefault } from "@lowcoder-ee/index.sdk";
import { presets } from "./colorPickerstant";
import _ from "lodash"

export function getStyle(style: ColorPickerStyleType) {
  return css`
    border-radius: ${style.radius};
    &:not(.ant-input-disabled, .ant-input-affix-wrapper-disabled),
    input {
      background-color: ${style.background};
      border-color: ${style.border};
      &:focus,
      &.ant-input-affix-wrapper-focused {
        border-color: ${style.accent};
      }
      &:hover {
        border-color: ${style.accent};
      }
      .ant-input-clear-icon svg:hover {
        opacity: 0.65;
      }
    }
  `;
}

const ColorPickerWrapper = styled(ColorPicker) <{ $style: ColorPickerStyleType }>`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  ${(props) => props.$style && getStyle(props.$style)}
`;

const colorPickerTriggerOption = [
  { label: trans('colorPicker.click'), value: 'click' },
  { label: trans('colorPicker.hover'), value: 'hover' },
] as const;

export const colorPickerEvent = eventHandlerControl([
  changeEvent
] as const);

const childrenMap = {
  ...textInputChildren,
  value: stringExposingStateControl('value', '#3377ff'),
  style: styleControl(ColorPickerStyle),
  color: jsonObjectExposingStateControl('color', {}),
  trigger: dropdownControl(colorPickerTriggerOption, 'click'),
  disabledAlpha: BoolControl,
  showPresets: BoolControl,
  onEvent: colorPickerEvent,
  presets: withDefault(ArrayOrJSONObjectControl, JSON.stringify(presets, null, 2)),
};

export const ColorPickerComp = new UICompBuilder(childrenMap, (props) => {
  return props.label({
    children: (
      <ColorPickerWrapper
        $style={props.style}
        value={props?.value?.value}
        disabledAlpha={props.disabledAlpha}
        showText={value => value.toHexString().toUpperCase()}
        allowClear
        trigger={props.trigger}
        disabled={props.disabled}
        onChange={(value) => {
          props.value.onChange(value.toHexString().toUpperCase())
          props.color.onChange({
            hex: value.toHexString().toUpperCase(),
            hsb: value.toHsb(),
            rgb: value.toRgb() as any,
          })
          props.onEvent('change')
        }}
        presets={props.showPresets && !_.isEmpty(props.presets) ? [(props.presets as any)] : []}
      />
    ),
    style: props.style,
  });
})
  .setPropertyViewFn((children) => {
    return (
      <>
        <Section name={sectionNames.basic}>
          {children.value.propertyView({ label: trans("prop.defaultValue") })}
        </Section>

        <FormDataPropertyView {...children} />
        {children.label.getPropertyView()}
        <Section name={sectionNames.interaction}>
          {children.onEvent.getPropertyView()}
          {disabledPropertyView(children)}
        </Section>

        <Section name={sectionNames.advanced}>
          {children.trigger.propertyView({ label: trans("colorPicker.trigger"), radioButton: true })}
          {children.disabledAlpha.propertyView({ label: trans("colorPicker.disabledAlpha") })}
          {children.showPresets.propertyView({ label: trans("colorPicker.showPresets") })}
          {children.showPresets.getView() && children.presets.propertyView({ label: trans("colorPicker.Recommended") })}
        </Section>

        <Section name={sectionNames.layout}>{hiddenPropertyView(children)}</Section>

        <Section name={sectionNames.style}>{children.style.getPropertyView()}</Section>
      </>
    );
  })
  .setExposeStateConfigs([
    new NameConfig("value", trans("export.inputValueDesc")),
    new NameConfig("color", trans("export.inputValueDesc")),
    new NameConfig("disabled", trans("prop.disabled")),
  ])
  .build();
