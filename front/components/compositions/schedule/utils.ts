export const selectRangeFormat = ({
  start,
  end,
}: {
  start: Date;
  end: Date;
}) => {
  const startHours = String(start.getHours()).padStart(2, "0");
  const startMinutes = String(start.getMinutes()).padStart(2, "0");
  const endHours = String(end.getHours()).padStart(2, "0");
  const endMinutes = String(end.getMinutes()).padStart(2, "0");
  return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
};

export function getScheduleLimiter() {
  const limiter = {
    min: new Date(),
    max: new Date(),
  };

  limiter.min.setHours(5, 0, 0);
  limiter.max.setHours(23, 59, 59);

  return { limiter };
}

export function getScheduleEventPropGetter(event: {
  trainer: { color: string };
}) {
  return {
    style: {
      padding: "0px",
      borderRadius: "8px",
      color: "white",
      border: "none",
      boxShadow: "0 4px 8px rgba(0, 0, 0.1, 0.1)",
    },
  };
}
