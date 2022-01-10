module.exports = {
  numberWithCommas: function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  getFirstAndLastDate: function (orders) {
    let start = new Date();
    let end = new Date();

    orders.forEach((order) => {
      let created_at = new Date(order.created_at);

      if (created_at < start) {
        start = created_at;
      }
      if (created_at > end) {
        end = created_at;
      }
    });

    let startMinus1 = new Date(start.getTime());
    startMinus1.setDate(startMinus1.getDate() - 1);
    let endPlus1 = new Date(end.getTime());
    endPlus1.setDate(endPlus1.getDate() + 1);

    return {
      startDate: start,
      endDate: end,
      startMinus1Date: startMinus1,
      endPlus1Date: endPlus1,
    };
  },
};
