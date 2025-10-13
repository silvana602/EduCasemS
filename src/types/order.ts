import type { Status } from "./status";

export interface Order {
  id: string;
  studentId: string;
  amountBOB: number;
  status: Status;
  createdAt: string;
};