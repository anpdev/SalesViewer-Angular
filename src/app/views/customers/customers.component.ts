import { Component, OnInit, Output,  EventEmitter, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { DataService } from '../../services/data.service';
import * as worldMapData from 'devextreme/dist/js/vectormap-data/world.js';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss'],
    providers: [DataService]
})
export class CustomersComponent implements OnInit, OnDestroy {
     @Output() onChange: EventEmitter<any> = new EventEmitter();
    subscription: Subscription;
    world: any = worldMapData.world;
    citySales: Array<any>;

    customerId: {
        id : number
    };
    range: Array<Date>;

    productsSales: Array<any>;

    bubbleColor: string;
    shutterColor: string;

    update(): void {
        if(this.range && this.customerId) {
            this.dataService.getData('products', {
                action : 'customerdetails',
                customerId: this.customerId.id,
                startDate: this.range[0],
                endDate: this.range[1]
            }).subscribe(data => {
                this.productsSales = data;
            });

            this.dataService.getData('cities', {
                action : 'cities',
                customerId: this.customerId.id,
                startDate: this.range[0],
                endDate: this.range[1]
            }).subscribe(data => {  
                if (Object.keys(data).length <= 0) { return;}
                this.citySales = [];
                for(let i = 0; i < Object.keys(data).length; i++) { 
                   
                   if( data[i].Coordinates[1] == null) { continue; }
                    this.citySales.push({
                        coordinates: [ data[i].Coordinates[1], data[i].Coordinates[0] ],
                        attributes: { name: data[i].City, sales: data[i].Sales }
                    });
                }
            });
        }
    }



 customizeMapTooltip = (pointInfo: any): any => {
            
            /*return { text: '<span style="font-size: 14px; color: #808080">' + pointInfo.attribute('Criteria') + '</span><br />'
            + '<span>$' + (pointInfo.attribute('sales')).toFixed(2) + '</span>' };*/
        
    }

customizeTooltip  = (pointInfo: any): any => {
            
            return { text: '<span style="font-size: 14px; color: #808080">' + pointInfo.argument + '</span><br />'
            + '<span>$' + pointInfo.value + '</span>' };
        
    }

    customizeLegendText = (pointInfo: any): any => {
        let roundedValue = this.productsSales[pointInfo.seriesIndex].Sales;
        return pointInfo.seriesName + ' / $' + roundedValue;
    }

    rangeChanged(event: any): void {
        this.onChange.emit(event);
        this.range = event.value;
        //this.update(); commented because to prevent detail api call twice.
    }

    customerChanged(event: any): void {
        this.customerId = event.selectedRowKeys[0];
        this.update();
    }

    private applyThemeConstants = () => {
        this.bubbleColor = this.themeService.getThemeItem("map", "layer:marker:bubble", "color");
        this.shutterColor = this.themeService.getThemeItem("backgroundColor");
        console.log( this.bubbleColor,  this.shutterColor);
    }

    constructor(private dataService: DataService, private themeService: ThemeService) { }

    ngOnInit() {
        this.subscription = this.themeService.themeChanged.subscribe(this.applyThemeConstants);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
