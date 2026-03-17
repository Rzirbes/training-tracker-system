import { ClubsForm, clubsSchema, type IClubFormProps } from './form'

export const ClubTemplate = Object.assign({}, { Form: ClubsForm, schema: clubsSchema })

export type ClubTemplateProps = {
  Form: IClubFormProps
}