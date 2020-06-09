const HOST ="http://192.168.1.228:8080";
const HOME=`${HOST}/mp`;

export const url={
  test:()=>`${HOST}/test`,
  decryptPhoneNumber:(data)=>`${HOME}/decryptPhoneNumber/${data}`,
  swiper:()=>`${HOME}/swipers`,
  fetchHotProducts:()=>`${HOME}/product/hot`,
  fetchHotBoxes:()=>`${HOME}/box/hot`,
  fetchArticles:()=>`${HOME}/article`,
  fetchReadingActivity:()=>`${HOME}/reading/activity`,
  addIngot:(userId,ingot)=>`${HOME}/balance/ingot/add/${userId}/${ingot}`,
  addCredit: (userId, credit) => `${HOME}/balance/credit/add/${userId}/${credit}`,
  fetchProducts:()=>`${HOME}/product`,
  fetchProduct:(uid)=>`${HOME}/product/${uid}`,
  getVerifyCode: (contact) => `${HOME}/sms/${contact}`,
  login: (contact, otp) => `${HOME}/login?contact=${contact}&otp=${otp}`,
  register: (contact, otp) => `${HOME}/register?contact=${contact}&otp=${otp}`,
  getUserInfoByPhone:(phone)=>`${HOME}/customer/${phone}`,
  addToCart:()=>`${HOME}/cart`,
  getShopNameList:()=>`${HOME}/shopName`,
  saveAddress:()=>`${HOME}/address`,
  placeOrder:()=>`${HOME}/order`,
  fetchOrder:(orderId)=>`${HOME}/order/${orderId}`,
  charge: (value, userId) => `${HOME}/simulateCharge/${userId}/${value}`,
  pay:(userId,orderId)=>`${HOME}/pay/${userId}/${orderId}`,
  fetchLatestUnpayOrder:(userId)=>`${HOME}/latestUnpayOrder/${userId}`,
  cancelOrder:(orderId)=>`${HOME}/order/cancel/${orderId}`,
  getShopList:()=>`${HOME}/shop`,
  fetchShopBoxes:(shopId)=>`${HOME}/shop/box/${shopId}`,
  fetchReservations: (boxId, startTime, endTime) => `${HOME}/reservations/${boxId}/${startTime}/${endTime}`,
  getShop:(shopId)=>`${HOME}/shop/${shopId}`,
  reserve:()=>`${HOME}/reserve`,
  fetchBox:(boxId)=>`${HOME}/box/${boxId}`,
  fetchCart:(userId)=>`${HOME}/cart/${userId}`,
  changeCartProductNumber:()=>`${HOME}/cart/changeNumber`,
  deleteCartItem:()=>`${HOME}/cart`,
  payCart:()=>`${HOME}/payCart`,
  placeProductOrder:()=>`${HOME}/order/product`,
  fetchAddress:(addressId)=>`${HOME}/address/${addressId}`,
  fetchAll: (page, userId) => `${HOME}/orders/all/${page}/${userId}`,
  fetchUnpay: (page, userId) => `${HOME}/orders/unpay/${page}/${userId}`,
  fetchPayed: (page, userId) => `${HOME}/orders/payed/${page}/${userId}`,
  fetchShipped: (page, userId) => `${HOME}/orders/shipped/${page}/${userId}`,
  fetchRefund: (page, userId) => `${HOME}/orders/refund/${page}/${userId}`,
  refund: (orderId) => `${HOME}/order/refund/${orderId}`,
  fetchUnpayReservations: (page, userId) => `${HOME}/reservations/unpay/${page}/${userId}`,
  fetchPayedReservations: (page, userId) => `${HOME}/reservations/payed/${page}/${userId}`,
  fetchCompleteReservations: (page, userId) => `${HOME}/reservations/complete/${page}/${userId}`,
  fetchRefundReservations: (page, userId) => `${HOME}/reservations/refund/${page}/${userId}`,
  reservationRefund:(orderId)=>`${HOME}/reservations/refund/${orderId}`,
  fetchNotifications:(userId,page)=>`${HOME}/notice/${userId}/${page}`,
  fetchUnreadNotifications: (userId) => `${HOME}/notice/unread/${userId}`,
  readNotification:(noticeId)=>`${HOME}/notice/${noticeId}`,
  clearUnRead:(userId)=>`${HOME}/notice/clear/${userId}`,
  deleteAddress:(addressId)=>`${HOME}/address/${addressId}`,
  fetchBoxProduct: () => `${HOME}/boxProduct`,
  fetchBills: (userId,page)=>`${HOME}/bills/${userId}/${page}`,
  fetchChargeRecords: (userId, page) => `${HOME}/charge/${userId}/${page}`,
} 