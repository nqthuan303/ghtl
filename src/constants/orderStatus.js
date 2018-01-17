const status = {
  TEMP: 'temp', // Tạm
  PENDING: 'pending', // Chờ giải quyết
  PREPAREPICKUP: 'preparePickup', // Chuẩn bị lấy hàng
  PICKUP: 'pickup', // Lấy hàng
  CANCEL: 'cancel', // Chưa lấy hàng về kho và khách hàng yêu cầu hủy
  STORAGE: 'storage', // Lưu kho
  PREPAREDELIVERY: 'prepareDelivery', // Chuẩn bị giao hàng
  DELIVERY: 'delivery', // Giao hàng
  REFUND_STORAGE: 'refundStorage', // Hàng bị trả đang lưu kho sẽ gửi lại cho khách (có tính phí)
  REFUND_RETURNING: 'refundReturning', // Hàng bị trả đang được gửi lại cho khách
  REFUND_NOSTORAGE: 'refundNoStorage', // Hàng bị trả đã được gửi lại cho khách
  CANCEL_STORAGE: 'cancelStorage', // Hàng bị hủy đang được lưu kho
  CANCEL_RETURNING: 'cancelReturning', // Hàng bị hủy đang được gửi trả lại cho khách
  CANCEL_NOSTORAGE: 'cancelNoStorage', // Hàng bị hủy đã được gửi lại cho khách
  DONE: 'done', // đã giao hàng xong
  PAID: 'paid', // đã thanh toán
};

module.exports = status;
