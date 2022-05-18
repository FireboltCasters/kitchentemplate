export abstract class PluginInterface{
    initApp(){

    }
    registerRoutes(){

    }
    onLogout(error){

    }
    onLogin(user, role){

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
    getCustomProjectLogoComponent(){
      return null;
    }
}
