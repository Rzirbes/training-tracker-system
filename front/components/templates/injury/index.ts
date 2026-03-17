import {InjuryForm, type InjuryFormValues} from './form'
import {injuriesSchema} from './schema'


const InjuryTemplate = Object.assign({}, { Form: InjuryForm, schema: injuriesSchema })

export { InjuryTemplate }

export type InjuryTemplateProps = {
  InjuryForm: InjuryFormValues
}