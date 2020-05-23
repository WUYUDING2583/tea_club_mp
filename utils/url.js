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
}