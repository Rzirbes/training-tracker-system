import { PainForm, painSchema, type IPainFormProps} from './form'

export const PainTemplate = Object.assign({}, { Form: PainForm, schema: painSchema })

export type PainTemplateProps = {
  Form: IPainFormProps
}