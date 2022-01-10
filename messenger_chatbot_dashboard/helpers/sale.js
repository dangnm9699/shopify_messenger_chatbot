module.exports = {
  getTopProductsByUnitSold: function (orders) {
    let products = [];
    orders.forEach((order) => {
      let line_items = order.line_items;
      line_items.forEach((line_item) => {
        let product = {
          id: line_item.product_id,
          title: line_item.title,
          quantity: line_item.quantity,
        };
        products.push(product);
      });
    });
    let result = products.reduce((final, data) => {
      let isAlready = final.find((value) => value.id == data.id);
      if (!isAlready) {
        final.push(data);
      } else {
        let index = final.indexOf(isAlready);
        final[index].quantity = final[index].quantity + data.quantity;
      }
      return final;
    }, []);
    return result;
  },
  getProductCountByDate: function (orders) {
    let dates = [];
    orders.forEach((order) => {
      let date = {};
      date.created_at = order.created_at.substring(0, 10);
      date.quantity = 0;

      let line_items = order.line_items;
      line_items.forEach((line_item) => {
        date.quantity += line_item.quantity;
      });

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
  getRevenueByDate: function (orders) {
    let dates = [];
    orders.forEach((order) => {
      let date = {};
      date.created_at = order.created_at.substring(0, 10);
      date.revenue = parseFloat(order.total_price);

      dates.push(date);
    });

    let result = dates.reduce((final, data) => {
      let isAlread = final.find((value) => value.created_at == data.created_at);
      if (!isAlread) {
        final.push(data);
      } else {
        let index = final.indexOf(isAlread);
        final[index].revenue += data.revenue;
      }
      return final;
    }, []);
    return result;
  },
};
