module.exports = {
  getOrderCountByDate: function (orders) {
    let dates = [];
    orders.forEach((order) => {
      let date = {};

      date.created_at = order.created_at.substring(0, 10);
      date.quantity = 1;
      dates.push(date);
    });

    let result = dates.reduce((final, data) => {
      let isAlread = final.find((value) => value.created_at == data.created_at);
      if (!isAlread) {
        final.push(data);
      } else {
        let index = final.indexOf(isAlread);
        final[index].quantity += data.quantity;
      }
      return final;
    }, []);
    return result;
  },
  getOrderMinMaxByDate: function (orders) {
    let dates = [];
    orders.forEach((order) => {
      let date = {};

      date.created_at = order.created_at.substring(0, 10);
      date.min = parseFloat(order.total_price);
      date.max = parseFloat(order.total_price);
      dates.push(date);
    });

    let result = dates.reduce((final, data) => {
      let isAlread = final.find((value) => value.created_at == data.created_at);
      if (!isAlread) {
        final.push(data);
      } else {
        let index = final.indexOf(isAlread);
        final[index].min = Math.min(final[index].min, data.min);
        final[index].max = Math.max(final[index].max, data.max);
      }
      return final;
    }, []);
    return result;
  },
  getAvgByDateRange: function (orders) {
    let avg = 0;
    orders.forEach((order) => {
      avg += parseFloat(order.total_price);
    });

    if (orders.length) {
      avg /= orders.length;
      avg = Math.round(avg);
    }

    return {
      avgValuePerOrder: avg,
      numberOfOrders: orders.length
    };
  },
};
