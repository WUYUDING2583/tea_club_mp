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
}