import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DisputeRoutes } from '@dispute/dispute.routes';
import { DisputeResourceService } from '@dispute/services/dispute-resource.service';
import { DisputeService } from '@dispute/services/dispute.service';
import { Dispute } from '@shared/models/dispute.model';

@Component({
  selector: 'app-find-ticket',
  templateUrl: './find-ticket.component.html',
  styleUrls: ['./find-ticket.component.scss'],
})
export class FindTicketComponent {
  constructor(
    private route: Router,
    private disputeResource: DisputeResourceService,
    private disputeService: DisputeService
  ) {}

  public onSearch(): void {
    this.disputeResource.getTicket().subscribe((response) => {
      this.disputeService.ticket$.next(response);

      this.disputeResource.getDispute().subscribe((dispute: Dispute) => {
        this.disputeService.dispute$.next(dispute);
        this.route.navigate([DisputeRoutes.routePath(DisputeRoutes.STEPPER)]);
      });
    });
  }
}
