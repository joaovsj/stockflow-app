import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, shareReplay, throwError } from 'rxjs';
import { Notyf } from 'notyf';

const notyf =   new Notyf({
  position: {
    x: 'right',
    y: 'top',
  }
});


export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe(
    shareReplay(),            // solve problem of multi cache
    takeUntilDestroyed(),    //  solve problem of memory leak

    catchError((error: HttpErrorResponse)=>{

      // console.log(error);

      if(error.status == 0){
        notyf.error({message: "Erro ao conectar com o servidor"});
      }
      
      return throwError(()=> error.error);
    })
  );
};
