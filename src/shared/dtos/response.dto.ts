import {
  IDBError,
  IDBSuccess,
  IResponseError,
  IResponseSuccess,
} from '../interfaces/response.interface';

export class ResponseError implements IResponseError {
  constructor(message: string, code: number, errors?: any) {
    this.success = false;
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
  success: boolean;
  code: number;
  message: string;
  errors: any[];
}

export class ResponseSuccess implements IResponseSuccess {
  constructor(message: string, code: number, data?: any) {
    this.success = true;
    this.code = code;
    this.message = message;
    this.data = data;
  }
  success: boolean;
  code: number;
  message: string;
  data: any[];
}

export class DBSuccess implements IDBSuccess {
  constructor(message: string, data?: any) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
  success: boolean;
  message: string;
  data: any;
  errors: any;
}

export class DBError implements IDBError {
  constructor(message: string, errors?: any) {
    this.success = false;
    this.message = message;
    this.errors = errors;
  }
  success: boolean;
  message: string;
  errors: any;
  data:any;
}
