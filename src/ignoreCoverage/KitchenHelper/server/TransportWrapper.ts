import {Transport, TransportMethods, TransportOptions, TransportResponse} from "@directus/sdk";
import ServerAPI from "../ServerAPI";
import App from "../App";

export default class TransportWrapper extends Transport{
	customErrorHandleCallback = null;

	protected async request<T = any, R = any>(
		method: TransportMethods,
		path: string,
		data?: Record<string, any>,
		options?: Omit<TransportOptions, 'url'>
	): Promise<TransportResponse<T, R>> {
		try {
			return await super.request(method, path, data, options);
		} catch (error: any) {
			if (!error || error instanceof Error === false) {
				throw error;
			}

			const status = error.response?.status;
			const code = error.errors?.[0]?.extensions?.code;

			console.log("");
			console.log("TransportWrapper error");
			console.log("path: ",path);
			console.log("status: ",status);
			console.log("code: ",code);

			if(!!this.customErrorHandleCallback){
				await this.customErrorHandleCallback(error);
			} else {

			}

			console.log(path);

			//Happens when the refresh or access token is too old
			if(this.isTokenExpired(error, status, code)){
				console.log("Token is expired, lets try to refresh it")
				let directus = ServerAPI.getDirectus(App.storage, ServerAPI.handleLogoutError);
				let refreshAnswer = await directus.auth.refresh();
				if(this.isRefreshSuccessfull(refreshAnswer)){
					console.log("Okay lets try to resend the request")
					try{
						let answer = await this.request(method, path, data, options);
						return answer;
					} catch (err){
						console.log("Resended request after refresh still unsuccessfull, rejecting");
						return Promise.reject(error);
					}
				} else {
					await ServerAPI.handleLogout(error);
					return Promise.reject(error);
				}
			}

			console.log("-------")
			//console.log("No idea what error caused neither what to do");
			return Promise.reject(error);
		}
	}

	isRefreshSuccessfull(answer){
		return !!answer && !!answer["access_token"] && !!answer["refresh_token"] && !!answer["expires"]
	}

	isTokenExpired(error, status, code){
		if(error.toString()==="Token expired"){
			return true;
		}
		if(status===403 && code==="INVALID_TOKEN"){
			return true;
		}
		return false;
	}

}
