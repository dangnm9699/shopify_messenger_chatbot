import { useCallback, useState } from "react";
import { Card, DatePicker, Button } from "@shopify/polaris";

export default function DateChooser({
  id,
  setOrders,
  startDate,
  endDate,
  startMinus1Date,
  loading,
  setLoading,
}) {
  const now = new Date();
  const [{ month, year }, setDate] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  const [selectedDates, setSelectedDates] = useState({
    start: new Date(startDate),
    end: new Date(endDate),
  });
  const handleClickApply = useCallback(async () => {
    setLoading(true);

    let start = new Date(selectedDates.start);
    let end = new Date(selectedDates.end);
    end.setDate(end.getDate() + 1);

    const ordersRes = await fetch(
      `http://localhost:8081/orders?created_at_min=${start
        .toISOString()
        .substring(0, 19)}&created_at_max=${end
        .toISOString()
        .substring(0, 19)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const ordersResJson = await ordersRes.json();
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    setOrders([...ordersResJson.orders]);
    setLoading(false);
  }, [selectedDates, loading]);

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  return (
    <>
      <Card sectioned>
        <DatePicker
          id={id}
          month={new Date().getMonth()}
          year={new Date().getFullYear()}
          multiMonth
          allowRange
          disableDatesAfter={new Date(endDate)}
          disableDatesBefore={new Date(startMinus1Date)}
          onChange={setSelectedDates}
          onMonthChange={handleMonthChange}
          selected={selectedDates}
        />
      </Card>
      <br />
      <Button primary loading={loading} onClick={handleClickApply}>
        Apply
      </Button>
    </>
  );
}
