import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-products-chart',
    templateUrl: './products-chart.component.html',
    styleUrls: ['./products-chart.component.scss'],
    providers: [DataService]
})
export class ProductsChartComponent implements OnInit, OnChanges {
    @Input() category: string;
    @Input() range: Array<Date>;
    @Input() productId: number;
    @Input() isRowChanged: boolean;
    dataSource: Array<any>;

    customizeTooltip = (pointInfo: any): any => {
        return {
            text: '<span style="font-size: 14px; color: #808080;">' + pointInfo.argument + '</span><br />'
                + '<span>$' + (pointInfo.originalValue).toFixed(2) + '</span>'
        };
    }
    constructor(private dataService: DataService) { }

    ngOnInit() {
    }

    ngOnChanges() { 
    
   if (this.isRowChanged) {

       if(this.category && this.range) {

              let action; 
              if(this.category =='channel') action = 'channels'; 
              if(this.category =='sector') action = 'sectors';
              if(this.category =='region') action = 'regions';
             
 

            this.dataService.getData(this.category + 's', {
                    action : action,
                    productId: this.productId,
                    startDate: this.range[0],
                    endDate: this.range[1]
            }).subscribe(data => { 
              setTimeout(() => this.dataSource= data, 0);
           
            });
         }
        }
    }

}
