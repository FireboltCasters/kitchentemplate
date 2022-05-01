// @ts-nocheck
import React, {FunctionComponent} from "react";
import {ScrollView, ScrollViewProps} from 'react-native';
import {ShowMoreGradient} from "./ShowMoreGradient";
import {View} from "native-base";

interface AppState {
	hideGradient?: boolean
}
export const ScrollViewWithGradient: FunctionComponent<AppState & ScrollViewProps> = (props) => {

	let hideGradient = props.hideGradient;
	let renderedGradient = hideGradient ? null : <ShowMoreGradient />

	return(
		<View style={{width: "100%", height: "100%", alignItems: "center"}} onLayout={props.onLayout}>
			<ScrollView
				style={props.style}
				contentContainerStyle={{ width: '100%', alignItems: "center" }}
				showsVerticalScrollIndicator={true}
			>
				{props.children}
			</ScrollView>
			{renderedGradient}
		</View>
	)
}
