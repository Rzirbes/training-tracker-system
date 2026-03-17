import { serverFetcher } from "@/services";
import {
  getFirstAndLastDayOfMonth,
  getFirstAndLastDayOfWeek,
} from "@/lib/dates";
import { Schedule, type IScheduleCard } from "@/components/compositions";
import { verifySession } from "@/server";
import { cn } from "@/lib/utils";
import { UserRoleEnum } from "@/enums";
import type { IPageProps } from "@/types";
import type { View } from "react-big-calendar";

type ListAllProps = {
  id: string;
  name: string;
}[];

export default async function AuthPage({ searchParams }: IPageProps) {
  const session = await verifySession();
  console.log("AUTH PAGE SESSION", session);

  const view: View = (searchParams?.view as View) ?? "week";
  const date: Date = searchParams?.date
    ? new Date(searchParams?.date as string)
    : new Date();

  const { firstDay, lastDay } =
    view === "month"
      ? getFirstAndLastDayOfMonth(date)
      : getFirstAndLastDayOfWeek(date);

  const isAdmin = session.user?.type === UserRoleEnum.ADMIN;

  console.log("ANTES DOS FETCHES");

  const [schedules, athletes, coaches] = await Promise.all([
    serverFetcher<{ schedules: IScheduleCard[] }>(
      `schedule?startDate=${firstDay?.toISOString()}&endDate=${lastDay?.toISOString()}`,
      { next: { tags: ["schedules"] } },
    ).then((res) => {
      console.log("SCHEDULE OK");
      return res.data.schedules ?? [];
    }),

    serverFetcher<ListAllProps>("athletes/all", {
      next: { tags: ["all-athletes"] },
    }).then((res) => {
      console.log("ATHLETES OK");
      return res.data ?? [];
    }),

    isAdmin
      ? serverFetcher<ListAllProps>("coaches/all", {
          next: { tags: ["all-coaches"] },
        }).then((res) => {
          console.log("COACHES OK");
          return res.data ?? [];
        })
      : [],
  ]);

  console.log("DEPOIS DOS FETCHES");
  return (
    <section
      className={cn(
        "pt-4 pb-12 px-6 md:px-10 w-full",
        isAdmin && "xl:max-w-[calc(100vw-280px)]",
      )}
    >
      <h1 className="text-2xl font-semibold pt-2">Agenda</h1>
      <Schedule
        date={date}
        view={view}
        userRole={session.user?.type || UserRoleEnum.COLLABORATOR}
        userId={session.user?.uuid}
        athletes={athletes}
        coaches={coaches}
        trainings={schedules.map(({ start, end, ...rest }) => ({
          ...rest,
          start: new Date(start),
          end: new Date(end),
        }))}
      />
    </section>
  );
}
