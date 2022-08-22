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

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subscription = this.dataService.getStocks()
        .subscribe(stock => {
          this.stocks = stock;
        });
  }

  getHighPrice(values) {
    return Math.max(...values).toFixed(5)
  }

  getLowPrice(values) {
    return Math.min(...values).toFixed(5)
  }

  changeToggle(index) {
    this.togglesButton[index] = !this.togglesButton[index]
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
