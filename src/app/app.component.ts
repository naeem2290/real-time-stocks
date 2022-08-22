import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './core/data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  stocks: any;
  subscription: Subscription;
  togglesButton = [true,true,true,true];
  stopData = [false,false,false,false];
  allStoreData = [{data:[]},{data:[]},{data:[]},{data:[]}]

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subscription = this.dataService.getStocks()
        .subscribe(stock => {
          this.stocks = stock;
          this.getData(stock);
          this.bindData();
        });
  }

  getData(stocks) {
    this.stopData.forEach(element => {
      if(element && this.allStoreData[this.stopData.indexOf(element)].data.length == 0) {
        this.allStoreData[this.stopData.indexOf(element)].data = (stocks[this.stopData.indexOf(element)]);
      }
    });
  }

  bindData() {
    this.allStoreData.forEach((element, index) => {
      if(element.data.length != 0) {
        this.stocks[index] = element.data;
      }
    });
  }

  getHighPrice(values) {
    return Math.max(...values).toFixed(5)
  }

  getLowPrice(values) {
    return Math.max(...values).toFixed(5)
  }

  changeToggle(index) {
    this.togglesButton[index] = !this.togglesButton[index];
    if(!this.togglesButton[index]) {
      this.stopData[index] = !this.stopData[index];
    } else {
      this.allStoreData[index].data = [];
      this.stopData[index] = !this.stopData[index];
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
