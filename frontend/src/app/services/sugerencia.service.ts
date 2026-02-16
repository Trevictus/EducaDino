import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay, map, retry, catchError, tap } from 'rxjs';
import { ApiService, PaginatedResponse } from '../core/services/api.service';
import { SugerenciaRequest } from '../models/sugerencia-model';

@Injectable({
  providedIn: 'root',
})
export class SugerenciaService {
  private apiService = new ApiService();
  private readonly endpoint = '/sugerencias';

  create(request: SugerenciaRequest): Observable<any> {
    return this.apiService.post(this.endpoint, request);

  } catchError(error: any): Observable<never>{
    console.error('An error occurred', error);
    return throwError(error);
  }
}
