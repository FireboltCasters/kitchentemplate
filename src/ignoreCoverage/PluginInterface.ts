import {UserItem} from "@directus/sdk";

export abstract class PluginInterface{
    initApp(){

    }
    registerRoutes(){

    }
    onLogout(error){

    }
    onLogin(user, role, permissions){

    }
    getSynchedStateKeysClass(){
      return null;
    }
    getStorageKeysClass(){
      return null;
    }
    getAboutUsComponent(){
      return null;
    }
    getPrivacyPolicyComponent(){
      return null;
    }
    getTermsAndConditionsComponent(){
      return null;
    }
    getHomeComponent(){
      return null;
    }
    getSettingsComponent(){
      return null;
    }

    renderCustomUserAvatar(user: UserItem): JSX.Element{
      return null;
    }

    getOverwriteTheme(): string {
      return null;
    }
}
