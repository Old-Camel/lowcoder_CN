import { default as Cascader } from "antd/es/cascader";
import { CascaderStyleType,ChildrenMultiSelectStyleType } from "comps/controls/styleControlConstants";
import { blurMethod, focusMethod } from "comps/utils/methodUtils";
import { trans } from "i18n";
import styled from "styled-components";
import { UICompBuilder, withDefault } from "../../generators";
import { CommonNameConfig, NameConfig, withExposingConfigs } from "../../generators/withExposing";
import { CascaderChildren, CascaderPropertyView, defaultDataSource } from "./cascaderContants";
import { refMethods } from "comps/generators/withMethodExposing";
import { JSONObject, useIsMobile } from "lowcoder-sdk";
import _ from "lodash";
import { SelectInputInvalidConfig, useSelectInputValidate } from "./selectInputConstants";
import { Fragment, useState, useEffect } from "react";
import { Cascader as MobileCascader } from "antd-mobile";

const CascaderStyle = styled(Cascader)<{ $style: CascaderStyleType,$childrenInputFieldStyle:ChildrenMultiSelectStyleType }>`
  width: 100%;
  font-family:"Montserrat";
  ${(props) => { return props.$style && { ...props.$style, 'border-radius': props.$style.radius } }}
`;

const DropdownRenderStyle = styled.div<{ $childrenInputFieldStyle: ChildrenMultiSelectStyleType }>`
 background-color: ${props => props.$childrenInputFieldStyle?.background};
    border: ${props => props.$childrenInputFieldStyle?.border};
    border-style: ${props => props.$childrenInputFieldStyle?.borderStyle};
    border-width: ${props => props.$childrenInputFieldStyle?.borderWidth};
    border-radius: ${props => props.$childrenInputFieldStyle?.radius};
    rotate: ${props => props.$childrenInputFieldStyle?.rotation};
    margin: ${props => props.$childrenInputFieldStyle?.margin};
    padding: ${props => props.$childrenInputFieldStyle?.padding};
    .ant-cascader-menu-item-content{
    font-size: ${props => props.$childrenInputFieldStyle?.textSize};
    font-style: ${props => props.$childrenInputFieldStyle?.fontStyle};
    font-family: ${props => props.$childrenInputFieldStyle?.fontFamily};
    font-weight: ${props => props.$childrenInputFieldStyle?.textWeight};
    text-transform: ${props => props.$childrenInputFieldStyle?.textTransform};
    text-decoration: ${props => props.$childrenInputFieldStyle?.textDecoration};
    color: ${props => props.$childrenInputFieldStyle?.text};
    }
`

const CascaderBasicComp = (function () {
  const childrenMap = CascaderChildren;

  return new UICompBuilder(childrenMap, (props) => {
    const [validateState, handleValidate] = useSelectInputValidate(props);
    const [visible, setVisible] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
      const findLabelsWithChildren = (obj: any, value: any) => {
        const labels = []
        for (let i of value) {
          obj = _.filter(obj, { value: i })
          if (obj.length > 0) {
            labels.push(_.omit(obj[0], 'children'))
            obj = obj[0]?.children
          }
        }
        return labels
      }
      props.selectedObject.onChange(findLabelsWithChildren(props.options, props.value.value))
    }, [])

    // @ts-ignore
    return props.label({
      required: props.required,
      style: props.style,
      labelStyle: props.labelStyle,
      inputFieldStyle:props.inputFieldStyle,
      childrenInputFieldStyle:props.childrenInputFieldStyle,
      animationStyle:props.animationStyle,
      children: (
        <Fragment>
          <CascaderStyle
            ref={props.viewRef}
            value={props.value.value}
            disabled={props.disabled}
            defaultValue={props.value.value}
            options={props.options}
            allowClear={props.allowClear}
            placeholder={props.placeholder}
            showSearch={props.showSearch}
            // $style={props.style}
            $style={props.inputFieldStyle}

            $childrenInputFieldStyle={props.childrenInputFieldStyle}

            open={isMobile ? false : undefined}
            onFocus={() => {
              setVisible(true);
              props.onEvent("focus")
            }}
            onBlur={() => {
              props.onEvent("blur")
            }}
            onChange={(value: (string | number | null)[], selectOptions) => {
              handleValidate(value);
              props.value.onChange(value as string[]);
              props.selectedObject.onChange(selectOptions?.map(x => _.omit(x, ['children'])) as JSONObject[]);
              props.onEvent("change");
            }}
          />

          {
            isMobile &&
              <MobileCascader
                options={props.options}
                visible={visible}
                onClose={() => {
                  setVisible(false)
                }}
                onConfirm={(value: (string | number)[]) => {
                  handleValidate(value);
                  props.value.onChange(value as string[]);
                  props.onEvent("change");
                }}
              />
          }
        </Fragment>
      ),
      ...validateState,
    });
  })
    .setPropertyViewFn((children) => (
      <>
        <CascaderPropertyView {...children} />
      </>
    ))
    .setExposeMethodConfigs(refMethods([focusMethod, blurMethod]))
    .build();
})();

const CascaderComp = withExposingConfigs(CascaderBasicComp, [
  new NameConfig("value", trans("selectInput.valueDesc")),
  new NameConfig("selectedObject", trans("selectInput.selectedObjectDesc")),
  SelectInputInvalidConfig,
  ...CommonNameConfig,
]);

export const CascaderWithDefault = withDefault(CascaderComp, {
  options: defaultDataSource,
});
