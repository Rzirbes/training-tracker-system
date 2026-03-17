import { Coach, Address, State, City, Country } from '@prisma/client';
import { CoachEntity } from 'src/app/modules/coaches/entities';

export class CoachAdapter {
  static create(coach: CoachEntity) {
    const email = coach.getEmail();
    const name = coach.getName();
    const role = coach.getRole();
    const phone = coach.getPhone();
    const schedulerColor = coach.getSchedulerColor();
    const user = coach.getUser();
    const address = coach.getAddress();
    const buildingNumber = address?.getBuildingNumber();
    const zipCode = address?.getZipCode();
    const street = address?.getStreet();
    const neighborhood = address?.getNeighborhood();
    const complement = address?.getComplement();
    const countryId = address?.getCountryId();
    const stateId = address?.getStateId();
    const cityId = address?.getCityId();

    const shouldCreateAddress =
      !!buildingNumber ||
      !!zipCode ||
      !!street ||
      !!neighborhood ||
      !!cityId ||
      !!stateId ||
      !!countryId;

    return {
      email,
      name,
      schedulerColor,
      role,
      phone,
      user: {
        create: {
          email,
          name,
          password: user.getPassword(),
          role: user.getRole(),
          firstAccess: user.getFirstAccess(),
        },
      },
      ...(shouldCreateAddress && {
        address: {
          create: {
            zipCode,
            street,
            buildingNumber,
            neighborhood,
            complement,
            country: {
              connect: {
                uuid: countryId,
              },
            },
            city: {
              connect: {
                uuid: cityId,
              },
            },
            state: {
              connect: {
                uuid: stateId,
              },
            },
          },
        },
      }),
    };
  }

  static update(coach: CoachEntity) {
    const email = coach.getEmail();
    const name = coach.getName();
    const role = coach.getRole();
    const phone = coach.getPhone();
    const schedulerColor = coach.getSchedulerColor();
    const isEnabled = coach.getIsEnabled();
    const address = coach.getAddress();
    const addressId = coach.getAddressId();
    const buildingNumber = address?.getBuildingNumber();
    const zipCode = address?.getZipCode();
    const street = address?.getStreet();
    const neighborhood = address?.getNeighborhood();
    const complement = address?.getComplement();
    const countryId = address?.getCountryId();
    const stateId = address?.getStateId();
    const cityId = address?.getCityId();

    const shouldUpdateAddress =
      !!buildingNumber ||
      !!zipCode ||
      !!street ||
      !!neighborhood ||
      !!cityId ||
      !!stateId ||
      !!countryId;

    const addressData = {
      zipCode,
      street,
      buildingNumber,
      neighborhood,
      complement,
      country: {
        connect: {
          uuid: countryId,
        },
      },
      city: {
        connect: {
          uuid: cityId,
        },
      },
      state: {
        connect: {
          uuid: stateId,
        },
      },
    };

    return {
      email,
      name,
      schedulerColor,
      role,
      phone,
      isEnabled,
      user: {
        update: {
          name,
          email,
          isEnabled,
        },
      },
      ...(shouldUpdateAddress && {
        address: addressId
          ? {
              update: {
                where: { id: coach.getAddressId() },
                data: addressData,
              },
            }
          : {
              create: addressData,
            },
      }),
    };
  }

  static find(
    coach: Coach & {
      address?: Address & { state?: State; city?: City; country?: Country };
    },
  ) {
    return new CoachEntity({
      ...coach,
      ...(coach?.address && {
        address: {
          ...coach?.address,
          stateId: coach?.address?.state?.uuid,
          cityId: coach?.address?.city?.uuid,
          countryId: coach?.address?.country?.uuid,
        },
      }),
    });
  }
}
