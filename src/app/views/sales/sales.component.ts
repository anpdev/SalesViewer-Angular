import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import { DataService } from '../../services/data.service';
import CustomStore from 'devextreme/data/custom_store';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss'],
    providers: [DataService, DatePipe, DecimalPipe]
})

export class SalesComponent implements OnInit, OnDestroy {
    loadingVisible = false;
    subscription: Subscription;
    dataSource: DataSource;
    gridDataSource: any = {};
    selectedRows: any = {};
   
    private range: Array<Date>;
    
    bulletColor: string;
    shutterColor: string;
    loading: string;
   
    
    customizeTooltip = (pointInfo: any): any => {
        return { text: '$' + this.decimalPipe.transform(pointInfo.originalValue, '1.0-0') };
    }

    onRangeChanged(event: any): void {
        this.range = event.value; 

        let format = 'yyyy-MM-dd';
        let startDate = this.datePipe.transform(this.range[0], format);
        let endDate =  this.datePipe.transform(this.range[1], format);
       
 
          function isNotEmpty(value: any): boolean {
            return value !== undefined && value !== null && value !== "";
            } 

          

             this.gridDataSource = new CustomStore({

             load: (loadOptions: any) => {
              let params: HttpParams = new HttpParams();
                [
                    "skip", 
                    "take", 
                    "requireTotalCount", 
                    "requireGroupCount", 
                    "sort", 
                    "filter", 
                    "totalSummary", 
                    "group",   
                    "groupSummary"
                ].forEach(function(i) {
                    if(i in loadOptions && isNotEmpty(loadOptions[i])) 
                        params = params.set(i, JSON.stringify(loadOptions[i]));
                }); 

                    params = params.set('startDate', startDate);
                    params = params.set('endDate', endDate);
                 
                   return this.httpClient.get( 'https://del.hiecor.biz/dashboard/?mode=product_grid&ai_skin=full_page&action=salesgrid&'+ params) 
                     .toPromise()
                    .then((res: any) => { 
                          this.loadingVisible = false;
                          return {
                              data: res.values,
                              totalCount:res.total_count
                        }

                    })
                    .catch(error => { throw 'Data Loading Error' });
              },
             
              
           });

            this.dataSource = new DataSource({
              store: this.gridDataSource
            });

    }

    private applyThemeConstants = () => {
        this.bulletColor = this.themeService.getThemeItem("bullet", "color");
        this.shutterColor = this.themeService.getThemeItem("backgroundColor");
    }

   

    constructor(private dataService: DataService, private datePipe: DatePipe, private decimalPipe: DecimalPipe, private themeService: ThemeService, private httpClient: HttpClient) { }

        ngOnInit() { 
          this.loading = " ";
          this.loadingVisible = true;
         
    }

    ngOnDestroy(): void {
       // this.subscription.unsubscribe();
    }
}
