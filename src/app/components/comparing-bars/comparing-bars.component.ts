import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DataService } from '../../services/data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ThemeService } from '../../services/theme.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Subscription }   from 'rxjs/Subscription';

const DAY_TYPE = 'day';

@Component({
    selector: 'app-comparing-bars',
    templateUrl: './comparing-bars.component.html',
    styleUrls: ['./comparing-bars.component.scss'],
    providers: [DataService, DecimalPipe, DatePipe]
})
export class ComparingBarsComponent implements OnInit {
    @Input() type: string;
    @Input() category: string;
    pastValueField: string;
    pastName: string;
    presentValueField: string;
    presentName: string;
    format: string;
    tooltipFormat: string;
    dataSource: Array<any> = [];
    caption: string;
    parameters: Array<any>;
    maxAxisValue: number;
    maxLevels: Array<number> = [];
    subscription: Subscription;
    counter = 0;
    
    customizeArgumentLabel = (pointInfo: any): any => { 
        return this.getShortFieldName(pointInfo.value);
    }

    customizeValueLabel = (pointInfo: any): any => {
        if(pointInfo.value < pointInfo.max) {
            return pointInfo.valueText;
        }
        return '';
    }

    customizePoint = (pointInfo: any): any => {
        if(pointInfo.seriesName === 'Today' || pointInfo.seriesName === 'ThisMonth') { 
            //let color = this.themeService.getColor(this.category, pointInfo.argument);
            let color = '#'+Math.random().toString(16).substr(2,6);
            return {
                color: color,
                hoverStyle: {
                    color: color,
                    hatching: {
                        opacity: 0
                    }
                }
            };
        }
    }

    customizeTooltip = (pointInfo: any): any => {
        let color = this.themeService.getColor(this.category, pointInfo.argument);
        let value = this.type === DAY_TYPE ? pointInfo.valueText : this.decimalPipe.transform(pointInfo.value, '1.0-0');
        return {
            text: '<span style="font-size: 14px; color: #808080;">' + pointInfo.argumentText.toUpperCase() + '</span><br />'
                + '<span style="color: ' + color + '">' + value + '</span><br />'
                + '<span style="font-size: 14px; color: #808080;">' + this.getDateName(pointInfo.seriesName) + '</span>'
        };
    }

    dateChanged(date: Date): void {
        let dataField = this.type === DAY_TYPE ? 'twoDays' : 'twoMonths';
        let requestData = {};
        requestData[dataField] = date;
        requestData['action'] = this.getServiceName() == 'products' ? 'revenuebyproduct' : 'revenuebysector'; 
       
        this.dataService.getData(this.getServiceName(),requestData).subscribe(data => { 

            this.maxAxisValue = this.getMaxAxisValue(data); 
             this.dataSource = data;
        });
    }

    private getDateName(seriesName: string): string {
        if(this.type === DAY_TYPE) {
            return seriesName;
        }

        let currentDate = new Date(); 
       
        if(seriesName === 'ThisMonth' || seriesName === 'LastMonth') {
             return seriesName;
            //currentDate.setMonth(-1);
        }
        return this.datePipe.transform(currentDate, 'MMMM');
    }

    private getShortFieldName(fieldName: string): string {
        let replaceTable = {
            'Manufacturing': 'Manuf.',
            'Eco Supreme': 'Eco Supr.',
            'EnviroCare Max': 'Enviro Max'
        };

        return replaceTable[fieldName] || fieldName;
    }

    private getServiceName(): string {
        return this.category.toLowerCase() + 's';
    }

    private getMaxAxisValue(data: Array<any>): number {
        let max = 0;

        for(let item of data) {
            let pastValue = item[this.pastValueField];
            let presentValue = item[this.presentValueField];
            let maxOfPair = pastValue < presentValue ? presentValue : pastValue;
            max = max > maxOfPair ? max : maxOfPair;
        }

        for(let maxLevel of this.maxLevels) {
            if(maxLevel > max) {
                return maxLevel;
            }
        }

        return max;
    }

    constructor(
        private dataService: DataService,
        private themeService: ThemeService,
        private decimalPipe: DecimalPipe,
        private datePipe: DatePipe,
        private http: HttpClient,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        if(this.type === DAY_TYPE) {
            this.caption = 'DAILY SALES PERFORMANCE';
            this.pastValueField = 'YesterdaySales';
            this.pastName = 'Yesterday';
            this.presentValueField = 'TodaySales';
            this.presentName = 'Today';
            this.format = 'currency thousands';
            this.tooltipFormat = 'currency';
        } else {
            this.caption = 'UNIT SALES BY CATEGORY';
            this.pastValueField = 'LastMonthUnits';
            this.pastName = 'LastMonth';
            this.presentValueField = 'ThisMonthUnits';
            this.presentName = 'ThisMonth';
            this.format = 'thousands';
            this.tooltipFormat = 'decimal';
        }

        for(let i = 1e3; i <= 1e7; i*=10) {
            for(let level of [ 4, 8, 12, 20 ]) {
                this.maxLevels.push(level*i);
            }
        }

  // Have to remove this on deployment
 
    
    let cbars = localStorage.getItem("cbars");

    if(cbars === null) { 
        
        let action = this.getServiceName() == 'products' ? 'revenuebyproduct' : 'revenuebysector';
             
        this.dataService.getData(this.getServiceName(), { now: new Date(),action : action }).subscribe(data => {

        localStorage.setItem('cbars',JSON.stringify(data));
   
          this.getMaxAxisValue(data);
          this.parameters = data;

        });
     } else {
      
            let localStorageData =JSON.parse( localStorage.getItem("cbars"));
            this.getMaxAxisValue(localStorageData);
            this.parameters = localStorageData;
            localStorage.removeItem('cbars');
      }
    }
     ngOnDestroy(): void {
       //localStorage.removeItem('cbars');
    }
    
}  