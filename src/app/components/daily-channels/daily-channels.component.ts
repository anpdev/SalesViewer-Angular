import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import * as moment from 'moment';
@Component({
    selector: 'app-daily-channels',
    templateUrl: './daily-channels.component.html',
    styleUrls: ['./daily-channels.component.scss'],
    providers: [DataService]
})
export class DailyChannelsComponent implements OnInit {
    channelsDataSource: Array<any>;
    summaryData: any = {};
    summary = 0;
    lastDate: Date;

    customizeLabel = (pointInfo: any): any => {
        if(pointInfo.valueText !== '00:00 AM') {
            return pointInfo.valueText;
        }
    }

  customizeTooltip = (pointInfo: any): any => {
       
        return {
            text: '<span>$' + pointInfo.value + '</span>'
             
        };
    }




    dateChanged(date: Date) { 

        this.dataService.getData('channels', { day: date, action : 'revenuebychannel'}).subscribe(data => {
            this.channelsDataSource = data.map(function(item) { 
                return {
                    SaleDate: moment(item['SaleDate'], moment.defaultFormat).toDate(),
                    ...item['SalesByChannel']
                };
            });
            this.resetSummary();
            this.calcSummary();
        });
    }

    summaryKeys(): Array<string> {
        return Object.keys(this.summaryData);
    }

    private calcSummary(): void {
         this.summaryData = [];
        for(let item of this.channelsDataSource) {
            for(let field in item) {
                if(item.hasOwnProperty(field) && field !== 'SaleDate') {
                    item[field] = Number(item[field]);
                    this.summaryData[field] = this.summaryData[field] || 0;
                    this.summaryData[field] += item[field];
                    this.summary += item[field];
                }
            }
        }
    }

    private resetSummary(): void {
        for(let field in this.summaryData) {
            if(this.summaryData.hasOwnProperty(field)) {
                this.summaryData[field] = 0;
            }
        }
        this.summary = 0;
    }

    constructor(private dataService: DataService) { }

    ngOnInit() {
        let today = new Date();
        //today.setDate(today.getDate() - 1);
        this.lastDate = today;
    }

}
