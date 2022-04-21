// @ts-nocheck
import React from 'react';
import {RegisteredRoutesMap} from "./RegisteredRoutesMap";
import {useBreakpointValue, useTheme, View} from "native-base";
import {CustomDrawerContent} from "./CustomDrawerContent";
import App from "../App";
import {RouteRegisterer} from "./RouteRegisterer";
import BreakPointValues from "../templates/BreakPointValues";

export const RootStack = (props) => {

	let isSmallDevice = BreakPointValues.usesSmallDevice();

	const theme = useTheme();

	// TODO do we have this?
	// navigationOptions={{unmountInactiveRoutes: true}}

	let largeScreenDrawerType = "front";

	const hideDrawer = App.shouldHideDrawer()
	if(!hideDrawer){
		largeScreenDrawerType = "permanent";
		//TODO need to hide on login screen
	}

	let drawerType = isSmallDevice ? 'front' : largeScreenDrawerType /** 'front' | 'back' | 'slide' | 'permanent' */
	let drawerStyleWidth =  isSmallDevice ? "100%" : theme.sidebarWidth;

	let drawerBorderColor = RouteRegisterer.getDrawerBorderColor();
	let drawerStyle = !!drawerBorderColor ? {borderColor: drawerBorderColor} : undefined;

	let Drawer = RouteRegisterer.getDrawer();

	let screens = App.shouldRedirectToLogin() ? RouteRegisterer.loginScreens : RouteRegisterer.screens;

	//TODO maybe add Drawer instead of custom implementation: https://reactnavigation.org/docs/5.x/drawer-navigator
	return(
		<View flex={1} flexDirection={"row"}>
			<View flex={1}>
					<Drawer.Navigator
						drawerStyle={drawerStyle}
						drawerType={drawerType}
						redirectToLogin={props.redirectToLogin+""}
						reloadNumber={App.instance.state.reloadNumber}
						swipeEnabled={false}
						drawerPosition={'left' /** | 'right' */}
						drawerContent={(props) => <CustomDrawerContent {...props} />}
						initialRouteName={RegisteredRoutesMap.getInitialRouteName()}

						screenOptions={{
							headerShown: false,
							unmountOnBlur:true
						}}>
						{screens}
					</Drawer.Navigator>
			</View>
		</View>
	)
}
/**

*/
