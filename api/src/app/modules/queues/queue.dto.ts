import { MailQueueEnum } from 'src/app/shared';

class ScheduleEmail {
  date: string;
  coach?: string;
  time: {
    start: string;
    end: string;
  };
}

export class SendMailToQueueDto {
  name: string;
  email: string;
  token: string;
  type: MailQueueEnum;
  schedule?: ScheduleEmail;
}

export class ReceiveMailFromQueueDto {
  id: string;
  receiptHandle: string;
  body: SendMailToQueueDto;
}
