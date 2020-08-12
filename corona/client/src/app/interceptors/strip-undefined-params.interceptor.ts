import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class StripUndefinedParamsInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        let params = request.params;
        for (const key of request.params.keys()) {
            if (!params.get(key)) {
                params = params.delete(key);
            }
        }
        request = request.clone({ params });
        return next.handle(request);
    }
}
