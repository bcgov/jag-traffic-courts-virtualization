import { OffenceDisputeDetail } from './offenceDisputeDetail.model';

export interface Offence {
  id?: string;
  offenceNumber: number;
  invoiceType?: string;
  offenceDescription?: string;
  violationDateTime?: string;
  vehicleDescription?: string;

  ticketedAmount?: number;
  amountDue?: number;
  discountAmount?: number;
  discountDueDate?: string;

  // Part B
  offenceDisputeDetail: OffenceDisputeDetail;

  // derived later on
  includeOffenceInDispute?: boolean;
  offenceStatus?: number;
  offenceStatusDesc?: string;
}
