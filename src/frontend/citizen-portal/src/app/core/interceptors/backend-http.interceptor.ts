import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RouteUtils } from '@core/utils/route-utils.class';
import { MockDisputeService } from 'tests/mocks/mock-dispute.service';
import { LoggerService } from '@core/services/logger.service';
import { MockConfig } from 'tests/mocks/mock-config';
import { AppConfigService } from 'app/services/app-config.service';

@Injectable()
export class BackendHttpInterceptor implements HttpInterceptor {
  constructor(
    private mockDisputeService: MockDisputeService,
    private appConfigService: AppConfigService,
    private logger: LoggerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const currentRoutePath = RouteUtils.currentRoutePath(
      request.url
    ).toLowerCase();

    // handle translations
    if (currentRoutePath.includes('json')) {
      return next.handle(request);

      // TODO: remove later
      // for now, lookups always use mock
    } else if (currentRoutePath === 'lookups') {
      return this.handleLookupsRequests(request.method);
    }

    if (this.appConfigService.useMockServices) {
      if (
        currentRoutePath !== 'tickets' &&
        !currentRoutePath.includes('dispute') &&
        currentRoutePath !== 'lookups'
      ) {
        throw new HttpErrorResponse({
          error: 'Mock Bad Request',
          status: 400,
        });
      }

      // Handle 'tickets' requests
      if (currentRoutePath === 'tickets') {
        return this.handleTicketsRequests(request.method);

        // Handle 'disputes' requests
      } else if (currentRoutePath.includes('dispute')) {
        console.log('yes');
        return this.handleDisputesRequests(request.method);

        // Handle 'lookups' requests
      } else if (currentRoutePath === 'lookups') {
        return this.handleLookupsRequests(request.method);
      }
    }
    return next.handle(request);
  }

  private handleTicketsRequests(
    requestMethod: string
  ): Observable<HttpEvent<unknown>> {
    const ticket = this.mockDisputeService.ticket;

    switch (requestMethod) {
      case 'GET':
      case 'PUT':
      case 'POST':
        return of(new HttpResponse({ status: 200, body: { result: ticket } }));
        break;
      default:
        throw new HttpErrorResponse({
          error: 'Mock Bad Request',
          status: 400,
        });
    }
  }

  private handleDisputesRequests(
    requestMethod: string
  ): Observable<HttpEvent<unknown>> {
    console.log('handleDisputesRequests');
    switch (requestMethod) {
      case 'POST':
        return of(new HttpResponse({ status: 200, body: {} }));
        break;
      case 'GET':
      case 'PUT':
      default:
        throw new HttpErrorResponse({
          error: 'Mock Bad Request',
          status: 400,
        });
    }
  }

  private handleLookupsRequests(
    requestMethod: string
  ): Observable<HttpEvent<unknown>> {
    switch (requestMethod) {
      case 'GET':
        return of(
          new HttpResponse({
            status: 200,
            body: { result: MockConfig.get() },
          })
        );
        break;
      default:
        throw new HttpErrorResponse({
          error: 'Mock Bad Request',
          status: 400,
        });
    }
  }
}
