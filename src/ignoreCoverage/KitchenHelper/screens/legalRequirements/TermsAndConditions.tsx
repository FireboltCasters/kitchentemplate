// @ts-nocheck
import React, {useEffect} from "react";
import {Text} from "native-base";
import TextGenerator from "../../helper/TextGenerator";
import {ConfigHolder} from "../../ConfigHolder";
import {RouteRegisterer} from "../../navigation/RouteRegisterer";
import {RegisteredRoutesMap} from "../../navigation/RegisteredRoutesMap";

export const TermsAndConditions = (props) => {

	ConfigHolder.instance.setHideDrawer(false);

	// corresponding componentDidMount
	useEffect(() => {

	}, [props.route.params])

	let component = ConfigHolder.plugin.getTermsAndConditionsComponent();

	if(!!component){
		return component
	}

	return(
		<>
			<Text>{TextGenerator.getVeryLongText()}</Text>
		</>
	)
}
