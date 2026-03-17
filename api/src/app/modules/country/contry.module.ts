import { Module } from "@nestjs/common";
import { CreateCountryUseCase, GetCountriesUseCase, GetCountryByUuidUseCase } from "./usecases";
import { CountryPostgresRepository } from "src/infra/databases/orms/prisma/postgres/repositories/country.repository";
import { CountryController } from "./controllers/country.controller";

@Module({
  controllers: [CountryController],
  providers: [
    CreateCountryUseCase,
    GetCountriesUseCase,
    GetCountryByUuidUseCase,
    {
      provide: 'ICountryRepository',
      useClass: CountryPostgresRepository,
    },
  ],
  exports: ['ICountryRepository', GetCountryByUuidUseCase],
})
export class CountryModule {}