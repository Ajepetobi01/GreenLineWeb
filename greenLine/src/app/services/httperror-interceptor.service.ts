import {
  HttpErrorResponse,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, throwError } from 'rxjs';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class HttperrorInterceptorService {
  constructor(private nzNotify: NzMessageService, private location: Location) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('HTTP Request Started');
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('eeee', error);
        let errorMessage = this.setError(error);
        if (error.status === 401 || error.status === 403) {
          errorMessage = 'You are unauthorized !!';
          this.location.back();
        }

        this.nzNotify.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
  setError(error: HttpErrorResponse): string {
    let errorMessage = 'Unknown Error Occured OR No Response From Server';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status !== 0) {
        errorMessage = error.error;
      }
    }
    return errorMessage;
  }
}
