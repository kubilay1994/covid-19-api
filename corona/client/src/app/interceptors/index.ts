/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { StripUndefinedParamsInterceptor } from './strip-undefined-params.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: StripUndefinedParamsInterceptor,
        multi: true,
    },
];
