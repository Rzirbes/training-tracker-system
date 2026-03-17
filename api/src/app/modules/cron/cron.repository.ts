export interface ICronRepository {
  sendWellBeingMonitory(): Promise<void>;
  sendScheduleNotification(): Promise<void>;
}
