import { Button, Badge } from "antd";
import { styleControl } from "comps/controls/styleControl";
import { ButtonStyleType, ButtonStyle, widthCalculator } from "comps/controls/styleControlConstants";
import { migrateOldData } from "comps/generators/simpleGenerators";
import styled, { css } from "styled-components";
import { genActiveColor, genHoverColor } from "lowcoder-design";
import { refMethods } from "comps/generators/withMethodExposing";
import { blurMethod, clickMethod, focusWithOptions } from "comps/utils/methodUtils";

export function getButtonStyle(buttonStyle: ButtonStyleType) {
  const hoverColor = genHoverColor(buttonStyle.background);
  const activeColor = genActiveColor(buttonStyle.background);
  return css`
    &&& {
      border-radius: ${buttonStyle.radius};
      margin: ${buttonStyle.margin};	
      &:not(:disabled) {
        --antd-wave-shadow-color: ${buttonStyle.border};
        border-color: ${buttonStyle.border};
        color: ${buttonStyle.text};
        font-size: ${buttonStyle.textSize};
        font-weight: ${buttonStyle.textWeight};
        font-family: ${buttonStyle.fontFamily};
        background-color: ${buttonStyle.background};
        border-radius: ${buttonStyle.radius};
        margin: ${buttonStyle.margin};	
  
        &:hover,
        &:focus {
          color: ${buttonStyle.text};
          background-color: ${hoverColor};
          border-color: ${buttonStyle.border === buttonStyle.background
            ? hoverColor
            : buttonStyle.border} !important;
        }
        &:active {
          color: ${buttonStyle.text};
          background-color: ${activeColor};
          border-color: ${buttonStyle.border === buttonStyle.background
            ? activeColor
            : buttonStyle.border} !important;
        }
      }
    }
  `;
}

export const Button100 = styled(Button)<{ $buttonStyle?: ButtonStyleType }>`
  ${(props) => props.$buttonStyle && getButtonStyle(props.$buttonStyle)}
  width: ${(props) => widthCalculator(props.$buttonStyle?.margin ?? "0px")};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  span {
    overflow: visible;
    text-overflow: ellipsis;
  }
  gap: 6px;
`;

export const Badge100 = styled(Badge)`
  width: 100%;
  z-index: 1000;
`;

export const ButtonCompWrapper = styled.div<{ disabled: boolean }>`
  // The button component is disabled but can respond to drag & select events
  ${(props) =>
    props.disabled &&
    `
    margin: ${props.style?.margin}
    cursor: not-allowed;
    button:disabled {
      pointer-events: none;
    }
  `};
`;

/**
 * Compatible with old data 2022-08-05
 */
function fixOldData(oldData: any) {
  if (
    oldData &&
    (oldData.hasOwnProperty("backgroundColor") ||
      oldData.hasOwnProperty("borderColor") ||
      oldData.hasOwnProperty("color"))
  ) {
    return {
      background: oldData.backgroundColor,
      border: oldData.borderColor,
      text: oldData.color,
    };
  }
  return oldData;
}
const ButtonTmpStyleControl = styleControl(ButtonStyle);
export const ButtonStyleControl = migrateOldData(ButtonTmpStyleControl, fixOldData);

export const buttonRefMethods = refMethods<HTMLElement>([
  focusWithOptions,
  blurMethod,
  clickMethod,
]);
