export const filterSalesHistory = (filterBy: string): Date | null => {
  //   const currentDate = new Date();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week (Sunday)

  const startOfMonth = new Date();
  startOfMonth.setHours(0, 0, 0, 0);
  startOfMonth.setDate(1); // Start of the current month

  const startOfYear = new Date();
  startOfYear.setHours(0, 0, 0, 0);
  startOfYear.setMonth(0, 1); // Start of the current year

  switch (filterBy) {
    case 'day':
      return startOfToday;
    case 'week':
      return startOfWeek;
    case 'month':
      return startOfMonth;
    case 'year':
      return startOfYear;
    default:
      return null;
  }
};
