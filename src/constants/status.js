
const status = {
  order: {
    TEMP: 'temp', // trạng thái khi khách hàng tạo đơn hàng nhưng chưa xác nhận
    PENDING: 'pending', // đơn hàng sau khi khách hàng xác nhận
    PREPAREPICKUP: 'preparePickup', // Chuẩn bị lấy hàng
    PICKUP: 'pickup', // Lấy hàng
    CANCEL: 'cancel', // Chưa lấy hàng về kho và khách hàng yêu cầu hủy
    STORAGE: 'storage', // Lưu kho
    PREPARE_DELIVERY: 'prepareDelivery', // Chuẩn bị giao hàng
    DELIVERY: 'delivery', // Giao hàng
    REFUND_STORAGE: 'refundStorage', // Hàng bị trả đang lưu kho sẽ gửi lại cho khách (có tính phí)
    PREPARE_REFUND_RETURNING: 'prepareRefundReturn', // Hàng bị trả đang được chuẩn bị để trả cho khách
    REFUND_RETURNING: 'refundReturning', // Hàng bị trả đang được gửi lại cho khách
    REFUND_NOSTORAGE: 'refundNoStorage', // Hàng bị trả đã được gửi lại cho khách
    CANCEL_STORAGE: 'cancelStorage', // Hàng bị hủy đang được lưu kho
    CANCEL_RETURNING: 'cancelReturning', // Hàng bị hủy đang được gửi trả lại cho khách
    PREPARE_CANCEL_RETURNING: 'prepareCancelReturn', // Hàng bị hủy đang được chuẩn bị để trả cho khách
    CANCEL_NOSTORAGE: 'cancelNoStorage', // Hàng bị hủy đã được gửi lại cho khách
    DONE: 'done',
    PAID: 'paid',
  },
  pickup: {
    PENDING: 'pending',
    DOING: 'doing',
    DONE: 'done',
  },
  delivery: {
    PENDING: 'pending',
    DOING: 'doing',
    DONE: 'done',
  },
  refund: {
    PENDING: 'pending',
    DOING: 'doing',
    DONE: 'done',
  },
};

module.exports = status;
