// tslint:disable
/**
 * n0bbs
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as globalImportUrl from 'url';
import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface ApiThreadsResponses
 */
export interface ApiThreadsResponses {
    /**
     * 
     * @type {string}
     * @memberof ApiThreadsResponses
     */
    display_name?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiThreadsResponses
     */
    comment: string;
}
/**
 * 
 * @export
 * @interface InlineObject
 */
export interface InlineObject {
    /**
     * 
     * @type {string}
     * @memberof InlineObject
     */
    title: string;
    /**
     * 
     * @type {boolean}
     * @memberof InlineObject
     */
    anonymous?: boolean;
    /**
     * 
     * @type {Array<ApiThreadsResponses>}
     * @memberof InlineObject
     */
    responses: Array<ApiThreadsResponses>;
}
/**
 * 
 * @export
 * @interface InlineObject1
 */
export interface InlineObject1 {
    /**
     * 
     * @type {any}
     * @memberof InlineObject1
     */
    image: any;
}
/**
 * 
 * @export
 * @interface InlineResponse200
 */
export interface InlineResponse200 {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse200
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse200
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse200
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<InlineResponse200Results>}
     * @memberof InlineResponse200
     */
    results?: Array<InlineResponse200Results>;
}
/**
 * 
 * @export
 * @interface InlineResponse2001
 */
export interface InlineResponse2001 {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2001
     */
    count?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2001
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2001
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<InlineResponse2001Results>}
     * @memberof InlineResponse2001
     */
    results?: Array<InlineResponse2001Results>;
}
/**
 * 
 * @export
 * @interface InlineResponse2001Results
 */
export interface InlineResponse2001Results {
    /**
     * 
     * @type {any}
     * @memberof InlineResponse2001Results
     */
    image: any;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2001Results
     */
    author?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2001Results
     */
    created_at?: string;
}
/**
 * 
 * @export
 * @interface InlineResponse200Results
 */
export interface InlineResponse200Results {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse200Results
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse200Results
     */
    title: string;
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse200Results
     */
    anonymous?: boolean;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse200Results
     */
    responses_count?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse200Results
     */
    read_responses_count?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse200Results
     */
    last_responded_at?: string;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {any} image 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImage(image: any, options: any = {}): RequestArgs {
            // verify required parameter 'image' is not null or undefined
            if (image === null || image === undefined) {
                throw new RequiredError('image','Required parameter image was null or undefined when calling createImage.');
            }
            const localVarPath = `/api/images/`;
            const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new FormData();


            if (image !== undefined) { 
                localVarFormParams.append('image', image as any);
            }
    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            localVarUrlObj.query = {...localVarUrlObj.query, ...localVarQueryParameter, ...options.query};
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: globalImportUrl.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {InlineObject} [inlineObject] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createThread(inlineObject?: InlineObject, options: any = {}): RequestArgs {
            const localVarPath = `/api/threads/`;
            const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = {...localVarUrlObj.query, ...localVarQueryParameter, ...options.query};
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof inlineObject !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(inlineObject !== undefined ? inlineObject : {}) : (inlineObject || "");

            return {
                url: globalImportUrl.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} [limit] Number of results to return per page.
         * @param {number} [offset] The initial index from which to return the results.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listImages(limit?: number, offset?: number, options: any = {}): RequestArgs {
            const localVarPath = `/api/images/`;
            const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }


    
            localVarUrlObj.query = {...localVarUrlObj.query, ...localVarQueryParameter, ...options.query};
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: globalImportUrl.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} [limit] Number of results to return per page.
         * @param {number} [offset] The initial index from which to return the results.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listThreads(limit?: number, offset?: number, options: any = {}): RequestArgs {
            const localVarPath = `/api/threads/`;
            const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }


    
            localVarUrlObj.query = {...localVarUrlObj.query, ...localVarQueryParameter, ...options.query};
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: globalImportUrl.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} id A unique integer value identifying this thread.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveThread(id: string, options: any = {}): RequestArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id','Required parameter id was null or undefined when calling retrieveThread.');
            }
            const localVarPath = `/api/threads/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const localVarUrlObj = globalImportUrl.parse(localVarPath, true);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarUrlObj.query = {...localVarUrlObj.query, ...localVarQueryParameter, ...options.query};
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: globalImportUrl.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {any} image 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImage(image: any, options?: any): (axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2001Results> {
            const localVarAxiosArgs = DefaultApiAxiosParamCreator(configuration).createImage(image, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {InlineObject} [inlineObject] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createThread(inlineObject?: InlineObject, options?: any): (axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse200Results> {
            const localVarAxiosArgs = DefaultApiAxiosParamCreator(configuration).createThread(inlineObject, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {number} [limit] Number of results to return per page.
         * @param {number} [offset] The initial index from which to return the results.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listImages(limit?: number, offset?: number, options?: any): (axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2001> {
            const localVarAxiosArgs = DefaultApiAxiosParamCreator(configuration).listImages(limit, offset, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {number} [limit] Number of results to return per page.
         * @param {number} [offset] The initial index from which to return the results.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listThreads(limit?: number, offset?: number, options?: any): (axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse200> {
            const localVarAxiosArgs = DefaultApiAxiosParamCreator(configuration).listThreads(limit, offset, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} id A unique integer value identifying this thread.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveThread(id: string, options?: any): (axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse200Results> {
            const localVarAxiosArgs = DefaultApiAxiosParamCreator(configuration).retrieveThread(id, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @param {any} image 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImage(image: any, options?: any): AxiosPromise<InlineResponse2001Results> {
            return DefaultApiFp(configuration).createImage(image, options)(axios, basePath);
        },
        /**
         * 
         * @param {InlineObject} [inlineObject] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createThread(inlineObject?: InlineObject, options?: any): AxiosPromise<InlineResponse200Results> {
            return DefaultApiFp(configuration).createThread(inlineObject, options)(axios, basePath);
        },
        /**
         * 
         * @param {number} [limit] Number of results to return per page.
         * @param {number} [offset] The initial index from which to return the results.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listImages(limit?: number, offset?: number, options?: any): AxiosPromise<InlineResponse2001> {
            return DefaultApiFp(configuration).listImages(limit, offset, options)(axios, basePath);
        },
        /**
         * 
         * @param {number} [limit] Number of results to return per page.
         * @param {number} [offset] The initial index from which to return the results.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listThreads(limit?: number, offset?: number, options?: any): AxiosPromise<InlineResponse200> {
            return DefaultApiFp(configuration).listThreads(limit, offset, options)(axios, basePath);
        },
        /**
         * 
         * @param {string} id A unique integer value identifying this thread.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        retrieveThread(id: string, options?: any): AxiosPromise<InlineResponse200Results> {
            return DefaultApiFp(configuration).retrieveThread(id, options)(axios, basePath);
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @param {any} image 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public createImage(image: any, options?: any) {
        return DefaultApiFp(this.configuration).createImage(image, options)(this.axios, this.basePath);
    }

    /**
     * 
     * @param {InlineObject} [inlineObject] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public createThread(inlineObject?: InlineObject, options?: any) {
        return DefaultApiFp(this.configuration).createThread(inlineObject, options)(this.axios, this.basePath);
    }

    /**
     * 
     * @param {number} [limit] Number of results to return per page.
     * @param {number} [offset] The initial index from which to return the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public listImages(limit?: number, offset?: number, options?: any) {
        return DefaultApiFp(this.configuration).listImages(limit, offset, options)(this.axios, this.basePath);
    }

    /**
     * 
     * @param {number} [limit] Number of results to return per page.
     * @param {number} [offset] The initial index from which to return the results.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public listThreads(limit?: number, offset?: number, options?: any) {
        return DefaultApiFp(this.configuration).listThreads(limit, offset, options)(this.axios, this.basePath);
    }

    /**
     * 
     * @param {string} id A unique integer value identifying this thread.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public retrieveThread(id: string, options?: any) {
        return DefaultApiFp(this.configuration).retrieveThread(id, options)(this.axios, this.basePath);
    }

}


