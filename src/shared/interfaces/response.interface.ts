export interface IResponseSuccess {
  success: boolean;
  code: number;
  message: string;
  data: any;
}

export interface IResponseError {
  success: boolean;
  code: number;
  message: string;
  errors: any;
}

export interface IDBSuccess {
  success: boolean;
  message: string;
  data: any;
}

export interface IDBError {
  success: boolean;
  message: string;
  errors: any;
}
