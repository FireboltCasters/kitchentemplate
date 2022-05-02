// @ts-nocheck
import React, {useState} from "react";
import {Box} from "native-base";
import {BreakPointLayout} from "./BreakPointLayout";
import {Layout} from "./Layout";
import {CloneChildrenWithProps} from "../helper/CloneChildrenWithProps";
import {ShowMoreGradientPlaceholder} from "../utils/ShowMoreGradientPlaceholder";
import {BaseNoScrollTemplate} from "./BaseNoScrollTemplate";
import {ScrollViewWithGradient} from "../utils/ScrollViewWithGradient";

export const BaseTemplate = ({
								 children,
								 navigation,
								 title,
								 navigateTo,
								 serverInfo,
								 _status,
								 _hStack,
								 ...props}: any) => {

  const contentWidth = Layout.useBaseTemplateContentWidth();
  const adaptedDimension = {width: contentWidth, height: props.dimension?.height}

  const childrenWithProps = CloneChildrenWithProps.passProps(children, {dimension: adaptedDimension, ...props});

	return(
		<BaseNoScrollTemplate {...props}>
      <ScrollViewWithGradient hideGradient={true} style={{width: "100%", height: "100%"}} >
				<BreakPointLayout >
					<Box style={{height: "100%", alignItems: "flex-start", width: "100%"}}>
						{childrenWithProps}
            <ShowMoreGradientPlaceholder />
					</Box>
				</BreakPointLayout>
      </ScrollViewWithGradient>
		</BaseNoScrollTemplate>
	)
}

BaseTemplate.useBaseTemplateContentWidth = Layout.useBaseTemplateContentWidth;
