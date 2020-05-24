import { configure, observable, action } from 'mobx-miniprogram';
import {url} from "../utils/url.js";
import { get } from "../utils/request.js";

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const box = observable({

  // 数据字段
  hotBoxes: new Array(),
  boxes: new Array(),
  byBoxes:new Object(),
  byReservations: new Object(),

  // actions
  fetchReservations:action(function(boxId,startTime,endTime){
    get(url.fetchReservations(boxId,startTime,endTime))
      .then(res=>{
        this.convertReservationsToPlainStructure(res,boxId);
      })
      .catch(err=>{
        console.log(err)
      })
  }),
  convertReservationsToPlainStructure:action(function(data,boxId){
    let byReservations = new Object();
    let reservations = new Array();
    data.forEach(reservation => {
      reservations.push(reservation.reservationTime);
      if (!byReservations[reservation.reservationTime]) {
        byReservations[reservation.reservationTime] = reservation;
      }
    });
    const thiz=this;
    this.byBoxes = { ...this.byBoxes, [boxId]: { ...this.byBoxes[boxId], reservations: this.byBoxes[boxId].reservations.concat(reservations.filter(time => thiz.byBoxes[boxId].reservations.indexOf(time) == -1))}}
    this.byReservations=byReservations;
  }),
  fetchShopBoxes:action(function(shopId){
    get(url.fetchShopBoxes(shopId))
      .then(res=>{
        this.convertBoxesToPlainStructure(res);
      })
      .catch(err=>{
        console.log(err)
      })
  }),
  fetchHotBoxes: action(function () {
    get(url.fetchHotBoxes())
    .then(res=>{
      this.convertHotBoxesToPlainStructure(res);
    })
  }),
  convertBoxesToPlainStructure:action(function(data){
    let boxes = new Array();
    let byBoxes=new Object()
    data.forEach(item => {
      boxes.push(item.uid)
      const photos = item.photos.map((photo) =>`data:image/jpeg;base64,${photo.photo}`)
      if(!byBoxes[item.uid]){
        byBoxes[item.uid] = {
          ...item,  photo: `data:image/jpeg;base64,${item.photos[0].photo}`,photos
        }
      }
    });
    this.boxes = boxes;
    this.byBoxes=byBoxes;
  }),
  convertHotBoxesToPlainStructure: action(function (data) {
    let hotBoxes = new Array();
    data.forEach(item => {
      hotBoxes.push({
        ...item.box, number: item.number, photo: `data:image/jpeg;base64,${item.box.photos[0].photo}`
      });
    });
    this.hotBoxes = hotBoxes;
  })

})
