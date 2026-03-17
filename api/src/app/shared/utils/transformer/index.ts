import { capitalizeFirstLetter } from './capitalize-first-letter.util';
import { nameToTitleCase } from './name-title-case.util';
import { formatPhoneNumberByCountryCode } from './phone.util';
import { transformSlug as slug } from './slug.util';

export const transformer = Object.assign(
  {},
  {
    nameToTitleCase,
    slug,
    capitalizeFirstLetter,
    phone: formatPhoneNumberByCountryCode,
  },
);
