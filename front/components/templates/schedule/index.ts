import { ScheduleDetail } from './detail'
import { ScheduleForm, IScheduleFormSchema } from './form'
import { ScheduleToolbar } from './toolbar'
import { ScheduleCard, IScheduleCard } from './card'
import { ScheduleShowMore } from './show-more'
import { ScheduleBlockForm } from './form-block-schedule'

export const ScheduleTemplate = Object.assign(
  {},
  {
    Form: ScheduleForm,
    Detail: ScheduleDetail,
    Card: ScheduleCard,
    Toolbar: ScheduleToolbar,
    ShowMore: ScheduleShowMore,
    BlockForm: ScheduleBlockForm
  }
)

export type { IScheduleFormSchema, IScheduleCard }
