import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {finalize, Observable} from "rxjs";
import {LoadingService} from "./loading.service";
import {jwtDecode} from "jwt-decode";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loader: LoadingService) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    this.loader.show();
    const cloned = req.clone({
      headers: req.headers.set("X-Authorization",
        "Bearer " + localStorage.getItem('access')).set('api_token', 'wirdaw-napjy9-vyzwiP')
    });
    if (localStorage.getItem('access')) {
      let loginInfo: any = jwtDecode(String(localStorage.getItem('access')))
      this.loader.setPrivLevel('testPrivLevel');
    }
    return next.handle(cloned).pipe(
      finalize(() => {
        this.loader.hide();
      })
    );
  }
}
