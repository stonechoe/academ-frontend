"use client";

import axios from 'axios';
import { AxiosError } from 'axios';
import { AxiosRequestConfig } from 'axios';

const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  maxRedirects: 0,
  withCredentials: true,
});

class ApiError extends Error {
  code: number | undefined;

  constructor(code? : number) {
    super();
    this.code = code;
  }
}

const buildUrlWithParams = (baseUrl: string, req: Record<string, (string | number)>) => {
  const newReq = Object.keys(req).reduce((acc : Record<string, string>, key) => { acc[key] = String(req[key]);  return acc}, {});
  const params = new URLSearchParams(newReq).toString();
  return params !== '' ? `${baseUrl}?${params}` : baseUrl;
};


export type ApiResponse<T> = {
  status: "SUCCESS" | "ERROR"
  code: number,
  data: T,
  message: string,
  version: string,
} | {
  status: "FAILURE",
  data: "NO_RES" | "NO_REQ" | "FAIL_RES",
  message: string,
  version: string,
};

function failWith(data : "NO_RES" | "NO_REQ" | "FAIL_RES", message: string) : ApiResponse<any> {
  return {
    status: "FAILURE",
    data,
    message,
    version : "NO VERSION, This response was generated by Academ Fronted"
  }
}

export function build<Req, Res>(method: "POST" | "GET", path: string, allowedStatus: number[], config? : AxiosRequestConfig) {
  return async function (req: Req, ): Promise<ApiResponse<Res>> {

      const ret = (method === "POST" ? backend
        .post(path, req,{
            ...{validateStatus: (status: number) => status >= 200 && status < 300 || allowedStatus.includes(status)},
            ...config
          }) : backend.get(buildUrlWithParams(path, req as Record<string, string | number>),
            {
              ...{validateStatus: (status: number) => status >= 200 && status < 300 || allowedStatus.includes(status)},
              ...config
            }));
      
      return await ret.then((res) => {
        const data = res.data;
        data.code = res.status;
        return Promise.resolve(res.data as ApiResponse<Res>);
      }
      ).catch((error: AxiosError) => {
        if (error.response) {
          return Promise.resolve(failWith("FAIL_RES", "실패한 응답을 받았습니다."));
        }
        else if (
          error.request
        ) {
          return Promise.resolve(failWith("NO_RES", "응답을 수신하지 못했습니다. 장치가 네트워크에 연결되어 있지 않거나 서버가 오프라인입니다."));
        }
        else {
          return Promise.resolve(failWith("NO_REQ", "요청을 전송하지 못했습니다. 장치가 네트워크에 연결 되지 않았나요?"));
        }
      }).catch(() => {
        return Promise.resolve(failWith("NO_REQ", "알 수 없는 오류"));
      });
    
  }
}
