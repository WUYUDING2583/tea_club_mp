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
  fetchBox:action(function(boxId){
    return new Promise((resolve,reject)=>{
      get(url.fetchBox(boxId))
        .then(res=>{
          this.convertBoxToPlainStructure(res);
        })
        .catch(err=>{
          console.log(err);
        })
    })
  }), 
  convertBoxToPlainStructure: action(function (data) {
    let photos=null;
    if (data.photos) {
      photos = data.photos.map((photo) => `data:image/jpeg;base64,${photo.photo}`)
    }
    if(this.boxes.indexOf(data.uid)==-1){
      this.boxes=this.boxes.concat([data.uid]);
    }
    if(!data.reservations){
      data.reservations=new Array();
    }
    this.byBoxes = {
      ...this.byBoxes, [data.uid]: {
        ...data, photo: data.photos?`data:image/jpeg;base64,${data.photos[0].photo}`:null, photos
      }};
  }),
  fetchReservations:action(function(boxId,startTime,endTime){
    const thiz=this;
    return new Promise((resolve,reject)=>{
      get(url.fetchReservations(boxId, startTime, endTime))
        .then(res => {
          thiz.convertReservationsToPlainStructure(res, boxId);
          resolve()
        })
        .catch(err => {
          console.log(err);
          reject()
        })
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
    let byBoxes=new Object();
    let byReservations=new Object();
    data.forEach(item => {
      boxes.push(item.uid)
      let photos=null;
      if (item.photos) {
        photos = item.photos.map((photo) => `data:image/jpeg;base64,${photo.photo}`)
      }
      let reservations=new Array();
      item.reservations.forEach((reservation)=>{
        reservations.push(reservation.reservationTime);
        byReservations[reservation.reservationTime]=reservation;
      })
      if(!byBoxes[item.uid]){
        byBoxes[item.uid] = {
          ...item, photo: item.photos?`data:image/jpeg;base64,${item.photos[0].photo}`:null, photos, reservations
        }
      }
    });
    this.boxes = boxes;
    this.byBoxes=byBoxes;
    this.byReservations=byReservations;
  }),
  convertHotBoxesToPlainStructure: action(function (data) {
    let hotBoxes = new Array();
    data.forEach(item => {
      hotBoxes.push({
        ...item.box, number: item.number, photo: item.box.photos?`data:image/jpeg;base64,${item.box.photos[0].photo}`:null
      });
    });
    this.hotBoxes = hotBoxes;
  })

})
