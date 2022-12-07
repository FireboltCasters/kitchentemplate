import {action, createStore, useStoreActions, useStoreState} from "easy-peasy";
import {SynchedVariableInterface} from "../storage/SynchedVariableInterface";
import {KeyExtractorHelper} from "../storage/KeyExtractorHelper";
import {RequiredStorageKeys} from "../storage/RequiredStorageKeys";
import {ConfigHolder} from "../ConfigHolder";
import {RequiredSynchedStates} from "./RequiredSynchedStates";

export function useSynchedState(storageKey): [value: string, setValue: (value) => {}] {
    const value = useStoreState((state) => {
      return state[storageKey]?.value
    });
    const setValue = useStoreActions((actions) => actions[storageKey].setValue);
    return [
        value,
        setValue
    ]
}

export function useSynchedJSONState(storageKey): [value: any, setValue: (value) => {}] {
  const [jsonStateAsString, setJsonStateAsString] = useSynchedState(storageKey);
  const parsedJSON = JSON.parse(jsonStateAsString || "null");
  const setValue = (dict) => setJsonStateAsString(JSON.stringify(dict))
  return [
    parsedJSON,
    setValue
  ]
}

export class SynchedState {

    private static store;
    private static globalSynchedStoreModels: {[key: string] : SynchedVariableInterface} = {};

    static getContextStore(){
        return SynchedState.store;
    }

    static getRequiredStorageKeys(){
        return KeyExtractorHelper.getListOfStaticKeyValues(RequiredStorageKeys);
    }

    static getPluginStorageKeys(){
        if(!!ConfigHolder.plugin){
            return KeyExtractorHelper.getListOfStaticKeyValues(ConfigHolder.plugin.getStorageKeysClass())
        }
        return [];
    }

    static getRequiredSynchedStates(){
        return KeyExtractorHelper.getListOfStaticKeyValues(RequiredSynchedStates);
    }

    static getPluginSynchedStates(){
        if(!!ConfigHolder.plugin){
            return KeyExtractorHelper.getListOfStaticKeyValues(ConfigHolder.plugin.getSynchedStateKeysClass())
        }
        return [];
    }

    private static registerSynchedState(key: string, defaultValue?: string, beforeHook?, afterHook?, override: boolean = false){
        let additionalModel = SynchedState.globalSynchedStoreModels[key];
        if(!!additionalModel && !override){
            return new Error("Additional variable for storage already exists for that key: "+key);
        }
        SynchedState.globalSynchedStoreModels[key] = new SynchedVariableInterface(key, defaultValue, beforeHook, afterHook);
    }

    static registerSynchedStates(listOfKeys: string[] | string, defaultValue?: string, beforeHook?, afterHook?, override: boolean = false){
        if (typeof listOfKeys === 'string'){
            listOfKeys = [listOfKeys];
        }

        for(let i=0; i<listOfKeys.length; i++){
            let key = listOfKeys[i];
            SynchedState.registerSynchedState(key, defaultValue, beforeHook, afterHook, override);
        }
    }

    private static handleAction(storageKey, state, payload, aditionalStoreModel: SynchedVariableInterface){
        let beforeHook = aditionalStoreModel.beforeHook;
        let afterHook = aditionalStoreModel.afterHook;
        let cancel = false;
        if(!!beforeHook){
            cancel = !beforeHook(storageKey, state, payload);
        }
        if(!cancel){
            state.value = payload;
            if(!!afterHook){
                afterHook(storageKey, state, payload);
            }
        }
    }

    static initSynchedKeys(){
        SynchedState.registerSynchedStates(SynchedState.getRequiredSynchedStates())
        SynchedState.registerSynchedStates(SynchedState.getPluginSynchedStates())
    }

    static initContextStores(){
        let model = {};

        let additionalKeys = Object.keys(SynchedState.globalSynchedStoreModels);

        for(let i=0; i<additionalKeys.length; i++){
            let key = additionalKeys[i];
            let aditionalStoreModel: SynchedVariableInterface = SynchedState.globalSynchedStoreModels[key];
            let storageKey = aditionalStoreModel.key;
            model[storageKey] = {
                value: aditionalStoreModel.defaultValue,
                setValue: action((state, payload) => {
                    SynchedState.handleAction(storageKey, state, payload, aditionalStoreModel);
                })
            }
        }

        const store = createStore(
            model
        );

        SynchedState.store = store;
    }


  /**
   * Image cache
   */

  static useCachedBase64ImagesDict() {
      return useSynchedJSONState(RequiredStorageKeys.KEY_DIRECTUS_IMAGE_CACHE);
  }

  static useCachedBase64Image(assetId) {
      if(!assetId) {
          return [null, () => {}];
      }

      const [cachedBase64ImagesDict, setCacheBase64ImagesDict] = SynchedState.useCachedBase64ImagesDict();
      const usedCachedBase64ImagesDict = cachedBase64ImagesDict || {};
      const cachedBase64Image = usedCachedBase64ImagesDict[assetId] || null;
      const setCachedBase64Image = (base64Image) => {
          if(!base64Image){
              delete usedCachedBase64ImagesDict[assetId];
          } else {
              usedCachedBase64ImagesDict[assetId] = base64Image;
          }
          setCacheBase64ImagesDict(usedCachedBase64ImagesDict);
      }

      return [cachedBase64Image, setCachedBase64Image];
  }

}
