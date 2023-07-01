import {RequiredStorageKeys} from "./RequiredStorageKeys";
import {MyDirectusStorageInterface} from "./MyDirectusStorageInterface";
import {StorageImplementationInterface} from "./StorageImplementationInterface";
import {CookieTypes} from "../screens/legalRequirements/CookieTypes";

export class DefaultStorage implements MyDirectusStorageInterface/** extends Storage */{

    async init(){

    }

    constructor() {

    }

    defaultSaveStorageContext(storageKey, state, payload){
        try{
            this.set(storageKey, payload);
        } catch (err){
            console.log(err);
            return false;
        }
        return true;
    }

    async initContextStores(SynchedState){
        let keys = SynchedState.getRequiredStorageKeys();
        this.initSynchedKeys(SynchedState, keys, true, CookieTypes.Necessary);
        let pluginStorageKeys = SynchedState.getPluginStorageKeys()
        this.initSynchedKeys(SynchedState, pluginStorageKeys, false, CookieTypes.Necessary);
    }

    initSynchedKeys(SynchedState, keys, override, cookieType: CookieTypes){
        for(let i=0; i<keys.length; i++){
            let storageKey = keys[i];
            let value = this.get(storageKey);
            SynchedState.registerSynchedStates(storageKey, value, this.defaultSaveStorageContext.bind(this), null, override);
        }
    }

    getAllKeys(): string[] {
        throw new Error("Method not implemented.");
    }

    getStorageImplementation(): StorageImplementationInterface{
        return null;
    }

    is_guest(){
        return !!this.get(RequiredStorageKeys.IS_GUEST);
    }

    set_is_guest(isGuest){
        this.setValueOrDeleteIfNull(RequiredStorageKeys.IS_GUEST, isGuest)
    }

    setValueOrDeleteIfNull(key, value){
        if(!value){
            this.delete(key)
        } else {
            this.set(key, value);
        }
    }

    clear_credentials(){
        this.set_user(null);
        this.set_refresh_token(null);
        this.set_access_token(null);
        this.set_is_guest(false);
        this.set_cookie_config(null);
    }

    set_cookie_config(cookieConfig){
      this.setValueOrDeleteIfNull(RequiredStorageKeys.KEY_COOKIE_CONFIG, cookieConfig);
    }



    has_credentials_saved(){
        if(!!this.get_auth_refresh_token()){
            return true;
        }
        return !!this.get_auth_access_token();
    }

    set_user(user){
      if(!!user){
        user = JSON.stringify(user);
      }
      this.setValueOrDeleteIfNull(RequiredStorageKeys.KITCHEN_CACHED_USER, user)
    }
    /**
     * Refresh Token
     */
    set_refresh_token(token){
        this.setValueOrDeleteIfNull(RequiredStorageKeys.KEY_AUTH_REFRESH_TOKEN, token)
    }
    set auth_refresh_token(token) { //DO not change
        this.set_refresh_token(token);
    }
    get_auth_refresh_token(){
        return this.getStorageImplementation().get(RequiredStorageKeys.KEY_AUTH_REFRESH_TOKEN);
    }
    get auth_refresh_token() { //DO not change
        return this.get_auth_refresh_token();
    }

    /**
     * Auth Token
     */
    set_access_token(token){
        this.setValueOrDeleteIfNull(RequiredStorageKeys.KEY_AUTH_ACCESS_TOKEN, token)
    }
    set auth_token(token) { //DO not change
        this.set_access_token(token);
    }
    get_auth_access_token(){
        return this.getStorageImplementation().get(RequiredStorageKeys.KEY_AUTH_ACCESS_TOKEN);
    }
    get auth_token() { //DO not change
        return this.get_auth_access_token();
    }

    /**
     * Expires
     */
    set_auth_expires(time: number){
        let expiresIn = null;
        if(!!time){
            let timeNumber = parseInt(""+time);
            expiresIn = new Date(Date.now() + timeNumber);
            expiresIn = expiresIn.toISOString()
        }
        this.setValueOrDeleteIfNull(RequiredStorageKeys.KEY_AUTH_EXPIRES_DATE, expiresIn+"")
        this.setValueOrDeleteIfNull(RequiredStorageKeys.KEY_AUTH_EXPIRES, time+"")
    }
    set auth_expires(time){ //DO not change
        this.set_auth_expires(time);
    }

    get_auth_expires_date(){
      return this.getStorageImplementation().get(RequiredStorageKeys.KEY_AUTH_EXPIRES_DATE);
    }

    get_auth_expires(){
        return Number(this.getStorageImplementation().get(RequiredStorageKeys.KEY_AUTH_EXPIRES));
    }
    get auth_expires() { //DO not change
        return this.get_auth_expires();
    }


    /**
     * Getter and Setter and Delete
     */
    get(key: string) { //DO not change
        return this.getStorageImplementation().get(key);
        //return '';
    }

    set(key: string, value: string) { //DO not change
        this.getStorageImplementation().set(key, value);
        return value;
    }

    delete(key: string) { //DO not change
        this.getStorageImplementation().remove(key);
        return null;
    }

    deleteAll(){
        let allKeys = this.getAllKeys();
        for(let i=0; i<allKeys.length; i++){
            this.delete(allKeys[i]);
        }
    }
}
