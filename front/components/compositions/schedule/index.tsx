"use client";

import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  momentLocalizer,
  type Formats,
  type DateLocalizer,
  type SlotInfo,
  type View,
  type CalendarProps,
} from "react-big-calendar";
import Cookies from "js-cookie";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { revalidateAction } from "@/lib";
import { useDialogContext } from "@/contexts";
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  toast,
} from "@/components/ui";
import { ConfirmCancelDialog, ConfirmDeleteDialog } from "../dialog";
import {
  ScheduleTemplate,
  type IScheduleFormSchema,
  type IScheduleCard,
} from "@/components/templates";
import {
  calculateTimeDifferenceInMinutes,
  capitalizeFirstLetter,
  getSevenDaysAgo,
} from "@/lib/utils";
import {
  getScheduleEventPropGetter,
  getScheduleLimiter,
  selectRangeFormat,
} from "./utils";
import { CookiesEnum, UserRoleEnum } from "@/enums";
import { useScreenDetector } from "@/hooks";
import { serverFetcher } from "@/services";
import {
  IScheduleItem,
  IScheduleCard as IScheduleCardItem,
  IScheduleCardBlock,
} from "@/components/templates/schedule/card";
import { BlockDetail } from "@/components/templates/schedule/block-detail";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./styles.css";

interface Props {
  trainings: IScheduleItem[];
  date: Date;
  view: View;
  userRole: UserRoleEnum;
  userId: string | undefined;
  athletes?: { id: string; name: string }[];
  coaches?: { id: string; name: string }[];
}

export type { IScheduleCard };

const localizer = momentLocalizer(moment);

const fallbackFilters = { athleteIds: [], coachIds: [] };

const toHms = (d: Date) => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}:00`;
};

const BaseCalendar = require("react-big-calendar")
  .Calendar as React.ComponentType<CalendarProps<IScheduleItem>>;
const DnDCalendar = withDragAndDrop<IScheduleItem>(BaseCalendar);

const timeGutterFormat = "HH:mm";
const currentTimeElement = ".rbc-current-time-indicator";
const weekdayFormat = "ddd";
const dayFormat = { base: "dddd, DD/MM", mobile: "ddd" };

const isSchedule = (i: IScheduleItem): i is IScheduleCardItem =>
  i.type === "SCHEDULE";

export function Schedule({
  trainings = [],
  date,
  view,
  userRole,
  athletes = [],
  coaches = [],
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const { dialog } = useDialogContext();
  const { limiter } = getScheduleLimiter();
  const { isDesktop } = useScreenDetector();

  const [filters, setFilters] = useState<{
    athleteIds: string[];
    coachIds: string[];
  }>({
    athleteIds: [],
    coachIds: [],
  });

  useEffect(() => {
    let storedFilters = fallbackFilters;
    const stored = Cookies.get(CookiesEnum.SCHEDULE);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        storedFilters = {
          athleteIds: Array.isArray(parsed?.athleteIds)
            ? parsed.athleteIds
            : [],
          coachIds: Array.isArray(parsed?.coachIds) ? parsed.coachIds : [],
        };
      } catch {
        storedFilters = fallbackFilters;
      }
    }

    const allAthleteIds = Array.isArray(athletes)
      ? athletes.map(({ id }) => id)
      : [];
    const allCoachIds = Array.isArray(coaches)
      ? coaches.map(({ id }) => id)
      : [];

    let initialAthleteIds = storedFilters.athleteIds.length
      ? storedFilters.athleteIds
      : allAthleteIds;

    let initialCoachIds = storedFilters.coachIds.length
      ? storedFilters.coachIds
      : allCoachIds;

    if (userRole !== UserRoleEnum.ADMIN) {
      initialAthleteIds = allAthleteIds;
      initialCoachIds = allCoachIds;
    }

    setFilters({ athleteIds: initialAthleteIds, coachIds: initialCoachIds });
  }, [athletes, coaches, userRole]);

  const onFilterChange = useCallback(
    (newFilters: { athleteIds?: string[]; coachIds?: string[] }) => {
      const updatedFilters = {
        athleteIds: newFilters.athleteIds ?? filters.athleteIds,
        coachIds: newFilters.coachIds ?? filters.coachIds,
      };

      setFilters(updatedFilters);
      Cookies.set(CookiesEnum.SCHEDULE, JSON.stringify(updatedFilters));
    },
    [filters],
  );

  const filteredTrainings = useMemo(() => {
    const { athleteIds, coachIds } = filters;

    return trainings.filter((t) => {
      if (isSchedule(t)) {
        const matchAthlete =
          !t.athlete?.id || athleteIds.includes(t.athlete.id);
        const matchCoach = coachIds.includes(t.trainer.id);
        return userRole !== UserRoleEnum.ADMIN
          ? matchAthlete
          : matchAthlete && matchCoach;
      } else {
        if (userRole !== UserRoleEnum.ADMIN) return true;
        const matchCoach = coachIds.includes(t.trainer.id);
        return matchCoach;
      }
    });
  }, [filters, trainings, userRole]);

  const today = new Date();
  const sevenDaysAgo = getSevenDaysAgo();

  const formats = {
    selectRangeFormat,
    timeGutterFormat,
    weekdayFormat: (
      date: Date,
      culture: string | undefined,
      localizer: DateLocalizer,
    ) => capitalizeFirstLetter(localizer.format(date, weekdayFormat, culture)),
    dayFormat: (
      date: Date,
      culture: string | undefined,
      localizer: DateLocalizer,
    ) =>
      capitalizeFirstLetter(
        localizer.format(
          date,
          !isDesktop ? dayFormat.mobile : dayFormat.base,
          culture,
        ),
      ),
  };

  function setDate(date: Date) {
    params.set("date", date.toJSON());
    router.push(pathname.concat("?").concat(params.toString()));
  }

  function setView(view: View) {
    params.set("view", view);
    router.push(pathname.concat("?").concat(params.toString()));
  }

  function onSelectSlot(props: SlotInfo) {
    if (userRole !== UserRoleEnum.ADMIN) {
      toast({ title: "Você não tem permissão para agendar treinos" });
      return;
    }
    if (props.start.getTime() < sevenDaysAgo.getTime()) {
      if (props.action === "select")
        toast({
          title:
            "Selecione apenas horários futuros ou dentro da última semana!",
        });
      return;
    }
    const start = props.start.toLocaleTimeString();
    const end = props.end.toLocaleTimeString();
    const duration = calculateTimeDifferenceInMinutes(start, end);
    openForm({
      defaultValues: { duration, date: props.start, time: { start, end } },
    });
  }

  function openForm(formProps?: {
    defaultValues: IScheduleFormSchema;
    type?: "create" | "update";
  }) {
    dialog.current?.open(
      <DialogContent className="max-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle className="flex flex-col gap-1 mt-3">
            Formulário de agendamento
          </DialogTitle>
          <DialogDescription>
            Preencha as informações a seguir:{" "}
          </DialogDescription>
        </DialogHeader>
        <ScheduleTemplate.Form onCancel={dialog.current.close} {...formProps} />
      </DialogContent>,
    );
  }

  function openBlockDetail(block: IScheduleCardBlock) {
    dialog.current?.open(
      <DialogContent className="max-w-sm">
        <DialogHeader className="sr-only">
          <DialogTitle className="flex flex-col gap-1 mt-3">
            Detalhes do bloqueio
          </DialogTitle>
          <DialogDescription>Veja a seguir:</DialogDescription>
        </DialogHeader>

        <BlockDetail
          userRole={userRole}
          block={block}
          onClose={dialog.current.close}
          onEdit={() => {
            dialog.current?.open(
              <DialogContent className="max-w-lg">
                <DialogHeader className="sr-only">
                  <DialogTitle>Editar bloqueio</DialogTitle>
                  <DialogDescription>
                    Atualize as informações:
                  </DialogDescription>
                </DialogHeader>

                {"BlockForm" in ScheduleTemplate ? (
                  <ScheduleTemplate.BlockForm
                    onCancel={dialog.current.close}
                    type="update"
                    defaultValues={{
                      id: block.id,
                      date: block.start,
                      coachId: block.trainer.id,
                      description: block.description ?? "",
                      time: {
                        start: toHms(block.start),
                        end: toHms(block.end),
                      },
                    }}
                  />
                ) : (
                  <div className="p-2 text-sm">
                    <p>
                      Formulário de edição de bloqueio ainda não implementado.
                    </p>
                  </div>
                )}
              </DialogContent>,
            );
          }}
          onDelete={() => {
            dialog.current?.open(
              <ConfirmDeleteDialog
                title="Você tem certeza que deseja excluir este bloqueio?"
                description="Essa ação não poderá ser desfeita depois."
                route={`schedule/block-time/${block.id}`}
                onClose={dialog.current?.close}
                onSuccess={() => {
                  dialog.current?.close();
                  revalidateAction("schedules");
                }}
              />,
            );
          }}
        />
      </DialogContent>,
    );
  }

  function openEventDetail(trainingSchedule: IScheduleCardItem) {
    const { id, start, end, athlete, trainer, trainingPlanning } =
      trainingSchedule;
    dialog.current?.open(
      <DialogContent className="max-w-sm">
        <DialogHeader className="sr-only">
          <DialogTitle className="flex flex-col gap-1 mt-3">
            Detalhes aberto
          </DialogTitle>
          <DialogDescription>Veja a seguir:</DialogDescription>
        </DialogHeader>
        <ScheduleTemplate.Detail
          userRole={userRole}
          trainingSchedule={trainingSchedule}
          onClose={dialog.current.close}
          onDelete={() => {
            dialog.current?.open(
              <ConfirmDeleteDialog
                title="Você tem certeza que deseja excluir este agendamento?"
                description="O planejamento de treino também será excluído, assim como notificaremos o atleta sobre o cancelamento. Essa ação não poderá ser desfeita depois."
                route={`schedule/${trainingSchedule.id}`}
                onClose={dialog.current?.close}
                onSuccess={() => {
                  dialog.current?.close();
                  revalidateAction("schedules");
                }}
              />,
            );
          }}
          onCancel={() =>
            dialog.current?.open(
              <ConfirmCancelDialog
                title="Você tem certeza que deseja cancelar esse agendamento?"
                route={`schedule/${id}/cancel`}
                onSuccess={() => revalidateAction("schedules")}
                onClose={dialog.current.close}
              />,
            )
          }
          onEdit={() =>
            openForm({
              type: "update",
              defaultValues: {
                tab: 0,
                id,
                date: start,
                athleteId: athlete?.id,
                coachId: trainer.id,
                trainingTypeId: trainingPlanning.trainingType.id,
                pse: trainingPlanning.pse,
                description: trainingPlanning.description ?? "",
                duration: trainingPlanning.duration,
                time: {
                  start: start.toLocaleTimeString(),
                  end: end.toLocaleTimeString(),
                },
              },
            })
          }
        />
      </DialogContent>,
    );
  }

  // Drag/Resize só para SCHEDULE
  function handleEventDrop({
    event,
    start,
    end,
  }: EventInteractionArgs<IScheduleItem>) {
    if (!isSchedule(event)) {
      toast({ title: "Bloqueios não podem ser movidos." });
      return;
    }

    // congele o tipo certo fora da closure
    const schedule: IScheduleCardItem = event;
    const startDate = new Date(start);
    const endDate = new Date(end);

    async function handleOnUpdate() {
      const response = await serverFetcher(`schedule/${schedule.id}`, {
        method: "PUT",
        body: JSON.stringify({
          id: schedule.id,
          athleteId: schedule.athlete?.id,
          coachId: schedule.trainer.id,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          trainingPlanning: {
            trainingTypeId: schedule.trainingPlanning.trainingType.id,
            description: schedule.trainingPlanning.description,
            duration: schedule.trainingPlanning.duration,
            pse: schedule.trainingPlanning.pse,
          },
        }),
      });

      if (response.ok) {
        revalidateAction("schedules");
        toast({
          title: "Horário atualizado!",
          description: "O agendamento foi movido com sucesso.",
          variant: "success",
        });
        dialog.current?.close();
      } else {
        toast({
          title: "Erro ao atualizar agendamento",
          description: response.data?.message ?? "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    }

    dialog.current?.open(
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar alteração</DialogTitle>
          <DialogDescription>
            Deseja alterar o horário do treino de{" "}
            <strong>{schedule.athlete?.name}</strong>?<br />
            De:{" "}
            <strong>
              {schedule.start.toLocaleDateString("pt-BR", {
                dateStyle: "full",
              })}{" "}
              {" às "}
              {schedule.start.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
            .<br />
            Para:{" "}
            <strong>
              {startDate.toLocaleDateString("pt-BR", { dateStyle: "full" })}{" "}
              {" às "}
              {startDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </strong>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="outline" onClick={() => dialog.current?.close()}>
            Cancelar
          </Button>
          <Button onClick={handleOnUpdate}>Confirmar</Button>
        </div>
      </DialogContent>,
    );
  }

  function handleEventResize({
    event,
    start,
    end,
  }: EventInteractionArgs<IScheduleItem>) {
    if (!isSchedule(event)) {
      toast({ title: "Bloqueios não podem ser redimensionados." });
      return;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);

    openForm({
      type: "update",
      defaultValues: {
        ...event,
        date: startDate,
        time: {
          start: startDate.toLocaleTimeString(),
          end: endDate.toLocaleTimeString(),
        },
      },
    });
  }

  function scrollToCurrentTime() {
    const element = document.querySelector(currentTimeElement);
    if (element)
      element.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  useEffect(() => {
    scrollToCurrentTime();
    const observer = new MutationObserver(() => {
      const element = document.querySelector(currentTimeElement);
      if (element) {
        scrollToCurrentTime();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [view]);

  return (
    <DndProvider backend={HTML5Backend}>
      <DnDCalendar
        scrollToTime={today}
        selectable
        step={50}
        timeslots={1}
        localizer={localizer}
        events={filteredTrainings}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        min={limiter.min}
        max={limiter.max}
        formats={formats as Formats}
        onSelectSlot={onSelectSlot}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        resizable
        draggableAccessor={(e: IScheduleItem) => e.type === "SCHEDULE"}
        resizableAccessor={(e: IScheduleItem) => e.type === "SCHEDULE"}
        eventPropGetter={getScheduleEventPropGetter}
        components={{
          showMore: (props) => (
            <ScheduleTemplate.ShowMore
              events={props.events}
              date={date}
              onClick={(e) => {
                e.stopPropagation();
                startTransition(() => {
                  setDate(props.slotDate);
                  setView("day");
                });
              }}
            />
          ),
          event: ({ event }) => {
            const item = event as IScheduleItem;
            return (
              <ScheduleTemplate.Card
                view={view}
                openTraining={openEventDetail}
                openBlock={openBlockDetail}
                training={
                  item.type === "SCHEDULE"
                    ? (item as IScheduleCardItem)
                    : undefined
                }
                blocked={
                  item.type === "BLOCK_TIME"
                    ? (item as IScheduleCardBlock)
                    : undefined
                }
              />
            );
          },
          toolbar: (props) => (
            <ScheduleTemplate.Toolbar
              {...props}
              userRole={userRole}
              scheduleTraining={() => openForm()}
              athleteList={athletes}
              coachList={coaches}
              onFilterChange={onFilterChange}
              appliedFilters={filters}
            />
          ),
        }}
      />
    </DndProvider>
  );
}
