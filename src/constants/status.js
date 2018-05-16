const status = {
  getOrderStatus: () => {
    const result = [];
    for (const key in status.order) {
      if (key) {
        const item = status.order[key];
        result.push(item.value);
      }
    }
    return result;
  },
  paymentStatus: {
    PENDING: {
      name: 'Chưa đối soát', // đơn hàng chưa được xử lý thanh toán
      value: 'pending',
    },
    UNPAID: {
      name: 'Chưa thanh toán', // đơn hàng chưa thanh toán cho shop
      value: 'unPaid',
    },
    PAID: {
      name: 'Đã thanh toán', // đơn hàng đã thanh toán cho shop
      value: 'paid',
    },
  },
  orderPayBy: {
    SENDER: {
      name: 'Người gửi',
      value: 'sender',
    },
    RECEIVER: {
      name: 'Người nhận',
      value: 'receiver',
    },
  },
  order: {
    TEMP: { // trạng thái khi khách hàng tạo đơn hàng nhưng chưa xác nhận
      name: 'Tạm',
      value: 'temp',
    },
    PENDING: { // đơn hàng đang đợi xử lý
      name: 'Chờ lấy hàng',
      value: 'pending',
    },
    CANCEL: { // Chưa lấy hàng về kho và khách hàng yêu cầu hủy
      name: 'Hủy',
      value: 'cancel',
    },
    PICKUP: {
      name: 'Đang lấy hàng',
      value: 'pickup',
    },
    STORAGE: {
      name: 'Lưu kho',
      value: 'storage',
    },
    DELIVERYPREPARE: {
      name: 'Chuẩn bị giao hàng',
      value: 'deliveryPrepare',
    },
    DELIVERY: {
      name: 'Đang giao hàng',
      value: 'delivery',
    },
    DELIVERED: {
      name: 'Đã giao',
      value: 'delivered',
    },
    RETURNFEESTORAGE: { // Hàng trả có phí đang được lưu kho
      name: 'Trả (phí) - lưu kho',
      value: 'returnFeeStorage',
    },
    RETURNFEEPREPARE: { // Hàng trả có phí (chuẩn bị trả)
      name: 'Trả (phí) - Chuẩn bị trả',
      value: 'returnFeePrepare',
    },
    RETURNINGFEE: { // Hàng trả có phí (đang trả)
      name: 'Trả (phí) - Đang trả',
      value: 'returningFee',
    },
    RETURNEDFEE: { // Hàng trả có phí (đã trả)
      name: 'Trả (phí) - Đã trả',
      value: 'returnedFee',
    },
    RETURNSTORAGE: { // hàng trả không phí (lưu kho)
      name: 'Trả - lưu kho',
      value: 'returnStorage',
    },
    RETURNPREPARE: { // Hàng trả không phí (chuẩn bị trả)
      name: 'Trả - Chuẩn bị trả',
      value: 'returnPrepare',
    },
    RETURNING: { // Hàng trả không phí (đang trả)
      name: 'Trả - Đang trả',
      value: 'returning',
    },
    RETURNED: { // Hàng trả không phí (đã trả)
      name: 'Trả - Đã trả',
      value: 'returned',
    },
  },
  pickup: {
    INPROCESS: 'inProcess',
    DONE: 'done',
  },
  delivery: {
    PENDING: 'pending',
    DOING: 'doing',
    COMPLETED: 'completed', // chuyến đi đã kết thúc nhưng chưa thu tiền của shipper
    DONE: 'done', // chuyến đi đã được thu tiền
  },
  refund: {
    PENDING: 'pending',
    DOING: 'doing',
    DONE: 'done',
  },
  payment: { // trạng thái thanh toán của bảng kê
    CANCEL: 'cancel', // hủy bảng kê
    DOING: 'doing', // bảng kê chưa thanh toán cho shop
    DONE: 'done', // bảng kê đã thanh toán cho shop
  },
  paymentMethods: {
    TRANSFER: {
      value: 'transfer',
      name: 'Chuyển khoản',
    },
    CASH: {
      value: 'cash',
      name: 'Tiền mặt',
    },
  },
};

module.exports = status;
