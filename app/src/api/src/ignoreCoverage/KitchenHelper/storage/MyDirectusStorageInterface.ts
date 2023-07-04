import {Cookie} from "../screens/legalRequirements/CookieHelper";

export interface MyDirectusStorageInterface{
    get(key: string);
    set(key: string, value: string);
    getAllKeys(): string[];
    delete(key: string);
    init();
    initContextStores(SynchedState: any);
    get_auth_expires_date(): string;
    get_auth_refresh_token(): string;
    get_auth_access_token(): string;
    has_credentials_saved(): boolean;
    getCookieFromStorageString(storageString: string): Cookie;
    getNewCookieFromKeyValue(key: string, value: string): Cookie
    getStorageStringFromCookie(cookie: Cookie): string
}
