import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as socketIo from 'socket.io-client';
import { Socket } from '../shared/interfaces';

@Injectable()
export class DataService {

  socket: Socket;
  observer: Observer<number>;

  getStocks() : Observable<number> {
    this.socket = socketIo('http://localhost:8080');

    this.socket.on('data', (res) => {
      this.observer.next(res.data);
    });

    return this.createObservable();
  }

  createObservable() : Observable<number> {
      return new Observable<number>(observer => {
        this.observer = observer;
      });
  }

}
