/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { AxiosRequestHeaders } from "axios";
import { API } from "./api";

export class HttpMethods {
  static async post(
    path: string,
    body?: any,
    headers?: AxiosRequestHeaders
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await API.post(path, body, { headers });
        if (body && body["returnResponse"]) {
          resolve(response);
        } else {
          resolve(response?.data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  static async get(path: string, headers?: AxiosRequestHeaders): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await API.get(path, { headers });
        resolve(response?.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static async put(
    path: string,
    body: Object,
    headers?: AxiosRequestHeaders
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await API.put(path, body, { headers });
        resolve(response?.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static async patch(
    path: string,
    body: Object,
    headers?: AxiosRequestHeaders
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await API.patch(path, body, { headers });
        resolve(response?.data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static async delete(
    path: string,
    headers?: AxiosRequestHeaders
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await API.delete(path, { headers: headers });

        resolve(response?.data);
      } catch (err) {
        reject(err);
      }
    });
  }
}
