import { PrismaClient } from '@prisma/client';
import { stateSeed } from './state.seed';
import { citySeed } from './city.seed';
import { userSeed } from './user.seed';
import { countrySeed } from './country.seed';

export const prismaSeed = new PrismaClient();

async function main() {
  console.log(`Rodando a seed do postgres no ambiente `, process.env.NODE_ENV);

  await countrySeed();
  const states = await stateSeed();
  await citySeed(states);
  await userSeed();
}

main()
  .then(async () => {
    await prismaSeed.$disconnect();
  })
  .catch(async (e) => {
    console.error(`Erro ao executar seeds: `, { e });
    await prismaSeed.$disconnect();
    process.exit(1);
  });
