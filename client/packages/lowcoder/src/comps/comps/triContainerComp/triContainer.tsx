import { AnimationStyleType, ContainerStyleType, heightCalculator, widthCalculator } from "comps/controls/styleControlConstants";
import { EditorContext } from "comps/editorState";
import { BackgroundColorContext } from "comps/utils/backgroundColorContext";
import { HintPlaceHolder, ScrollBar } from "lowcoder-design";
import { ReactNode, useContext } from "react";
import styled, { css } from "styled-components";
import { checkIsMobile } from "util/commonUtils";
import { gridItemCompToGridItems, InnerGrid } from "../containerComp/containerView";
import { TriContainerViewProps } from "../triContainerComp/triContainerCompBuilder";
import { getBackgroundStyle } from "@lowcoder-ee/util/styleUtils";

const getStyle = (style: ContainerStyleType) => {
  return css`
    border-color: ${style.border};
    border-width: ${style.borderWidth};
    border-radius: ${style.radius};
    border-style: ${style.borderStyle};
    overflow: hidden;
    padding: ${style.padding};
    ${getBackgroundStyle(style)}
  `;
};

const Wrapper = styled.div<{$style: ContainerStyleType; $animationStyle?:AnimationStyleType}>`
  display: flex;
  flex-flow: column;
  height: 100%;
  border: 1px solid #d7d9e0;
  border-radius: 4px;
  ${(props) => props.$style && getStyle(props.$style)}
  ${props=>props.$animationStyle&&props.$animationStyle}
`;

const HeaderInnerGrid = styled(InnerGrid)<{
  $backgroundColor: string,
  $headerBackgroundImage: string;
  $headerBackgroundImageRepeat: string;
  $headerBackgroundImageSize: string;
  $headerBackgroundImagePosition: string;
  $headerBackgroundImageOrigin: string;
 }>`
  overflow: visible;
  border-radius: 0;
  ${props => getBackgroundStyle({
    background: props.$backgroundColor,
    backgroundImage: props.$headerBackgroundImage,
    backgroundImageSize: props.$headerBackgroundImageSize,
    backgroundImageRepeat: props.$headerBackgroundImageRepeat,
    backgroundImageOrigin: props.$headerBackgroundImageOrigin,
    backgroundImagePosition: props.$headerBackgroundImagePosition,
  })}
`;

const BodyInnerGrid = styled(InnerGrid)<{
  $showBorder: boolean;
  $backgroundColor: string;
  $borderColor: string;
  $borderWidth: string;
  $backgroundImage: string;
  $backgroundImageRepeat: string;
  $backgroundImageSize: string;
  $backgroundImagePosition: string;
  $backgroundImageOrigin: string;
  showScroll?: boolean;
}>`
  border-top: ${(props) => `${props.$showBorder ? props.$borderWidth : 0} solid ${props.$borderColor}`};
  flex: 1;
  overflow-x: hidden;
  overflow-y: ${(props) => `${props.showScroll ? 'auto' : 'hidden'}`};
  border-radius: 0;
  ${props => getBackgroundStyle({
    background: props.$backgroundColor,
    backgroundImage: props.$backgroundImage,
    backgroundImageSize: props.$backgroundImageSize,
    backgroundImageRepeat: props.$backgroundImageRepeat,
    backgroundImageOrigin: props.$backgroundImageOrigin,
    backgroundImagePosition: props.$backgroundImagePosition,
  })}
`;

const FooterInnerGrid = styled(InnerGrid)<{
  $showBorder: boolean;
  $backgroundColor: string;
  $borderColor: string;
  $borderWidth: string;
  $footerBackgroundImage: string;
  $footerBackgroundImageRepeat: string;
  $footerBackgroundImageSize: string;
  $footerBackgroundImagePosition: string;
  $footerBackgroundImageOrigin: string;
}>`
  border-top: ${(props) => `${props.$showBorder ? props.$borderWidth : 0} solid ${props.$borderColor}`};
  overflow: visible;
  border-radius: 0;
  ${props => getBackgroundStyle({
    background: props.$backgroundColor,
    backgroundImage: props.$footerBackgroundImage,
    backgroundImageSize: props.$footerBackgroundImageSize,
    backgroundImageRepeat: props.$footerBackgroundImageRepeat,
    backgroundImageOrigin: props.$footerBackgroundImageOrigin,
    backgroundImagePosition: props.$footerBackgroundImagePosition,
  })}
`;

export type TriContainerProps = TriContainerViewProps & {
  hintPlaceholder?: ReactNode;
  animationStyle?: AnimationStyleType;
  showScroll?: boolean;
};

export function TriContainer(props: TriContainerProps) {
  const {container, animationStyle} = props;
  const { showHeader, showFooter, horizontalGridCells } = container;
  // When the header and footer are not displayed, the body must be displayed
  const showBody = container.showBody || (!showHeader && !showFooter);
  const showVerticalScrollbar = container.showVerticalScrollbar;

  const { items: headerItems, ...otherHeaderProps } = container.header;
  const { items: bodyItems, ...otherBodyProps } = container.body["0"].children.view.getView();
  const { items: footerItems, ...otherFooterProps } = container.footer;
  const {
    style,
    headerStyle,
    bodyStyle,
    footerStyle,
  } = container;

  const editorState = useContext(EditorContext);
  const maxWidth = editorState.getAppSettings().maxWidth;
  const isMobile = checkIsMobile(maxWidth);
  const paddingWidth = isMobile ? 0 : 0;

  return (
    <div style={{padding: style.margin, height: '100%'}}>
      <Wrapper $style={style} $animationStyle={animationStyle}>
      {showHeader && (
        <BackgroundColorContext.Provider value={headerStyle.headerBackground}>
          <HeaderInnerGrid
            {...otherHeaderProps}
            horizontalGridCells={horizontalGridCells}
            items={gridItemCompToGridItems(headerItems)}
            autoHeight={true}
            emptyRows={5}
            minHeight="46px"
            containerPadding={[paddingWidth, 3]}
            showName={{ bottom: showBody || showFooter ? 20 : 0 }}
            $backgroundColor={headerStyle?.headerBackground || 'transparent'}
            $headerBackgroundImage={headerStyle?.headerBackgroundImage}
            $headerBackgroundImageRepeat={headerStyle?.headerBackgroundImageRepeat}
            $headerBackgroundImageSize={headerStyle?.headerBackgroundImageSize}
            $headerBackgroundImagePosition={headerStyle?.headerBackgroundImagePosition}
            $headerBackgroundImageOrigin={headerStyle?.headerBackgroundImageOrigin}
            style={{padding: headerStyle.containerHeaderPadding}}

          />
        </BackgroundColorContext.Provider>
      )}
      {showBody && (
        <BackgroundColorContext.Provider value={bodyStyle.background}>
            <ScrollBar style={{ height: container.autoHeight ? "auto" : "100%", margin: "0px", padding: "0px" }} hideScrollbar={!showVerticalScrollbar}  overflow={container.autoHeight?'hidden':'scroll'}>
              <BodyInnerGrid
                $showBorder={showHeader}
                {...otherBodyProps}
                horizontalGridCells={horizontalGridCells}
                items={gridItemCompToGridItems(bodyItems)}
                autoHeight={container.autoHeight}
                emptyRows={14}
                minHeight={showHeader ? "143px" : "142px"}
                containerPadding={
                  (showHeader && showFooter) || showHeader ? [paddingWidth, 11.5] : [paddingWidth, 11]
                }
                showScroll={props.container.scrollbars}
                hintPlaceholder={props.hintPlaceholder ?? HintPlaceHolder}
                $backgroundColor={bodyStyle?.background || 'transparent'}
                $borderColor={style?.border}
                $borderWidth={style?.borderWidth}
                $backgroundImage={bodyStyle?.backgroundImage}
                $backgroundImageRepeat={bodyStyle?.backgroundImageRepeat}
                $backgroundImageSize={bodyStyle?.backgroundImageSize}
                $backgroundImagePosition={bodyStyle?.backgroundImagePosition}
                $backgroundImageOrigin={bodyStyle?.backgroundImageOrigin}
                style={{padding: bodyStyle.containerBodyPadding}}
              />
            </ScrollBar>
        </BackgroundColorContext.Provider>
      )}
      {showFooter && (
        <BackgroundColorContext.Provider value={footerStyle.footerBackground}>
          <FooterInnerGrid
            $showBorder={showHeader || showBody}
            {...otherFooterProps}
            horizontalGridCells={horizontalGridCells}
            items={gridItemCompToGridItems(footerItems)}
            autoHeight={true}
            emptyRows={5}
            minHeight={showBody ? "47px" : "46px"}
            containerPadding={showBody || showHeader ? [paddingWidth, 3.5] : [paddingWidth, 3]}
            showName={{ top: showHeader || showBody ? 20 : 0 }}
            $backgroundColor={footerStyle?.footerBackground || 'transparent'}
            $footerBackgroundImage={footerStyle?.footerBackgroundImage}
            $footerBackgroundImageRepeat={footerStyle?.footerBackgroundImageRepeat}
            $footerBackgroundImageSize={footerStyle?.footerBackgroundImageSize}
            $footerBackgroundImagePosition={footerStyle?.footerBackgroundImagePosition}
            $footerBackgroundImageOrigin={footerStyle?.footerBackgroundImageOrigin}
            $borderColor={style?.border}
            $borderWidth={style?.borderWidth}
            style={{padding: footerStyle.containerFooterPadding}}
          />
        </BackgroundColorContext.Provider>
      )}
    </Wrapper>
    </div>
  );
}
