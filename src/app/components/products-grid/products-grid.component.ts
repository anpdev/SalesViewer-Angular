import { Component, OnInit, Output,  EventEmitter, OnChanges, Input, ChangeDetectorRef } from '@angular/core';
import 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { DataService } from '../../services/data.service';
import CustomStore from 'devextreme/data/custom_store';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-products-grid',
    templateUrl: './products-grid.component.html',
    styleUrls: ['./products-grid.component.scss'],
    providers: [DataService, DatePipe]
})
export class ProductsGridComponent implements OnInit, OnChanges {
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @Input() range: Array<Date>;
    dataSource: DataSource;
    gridDataSource: any = {};
    selectedRows: any = {};
    loadingVisible = false;
    loading: string;
    selectionChanged(event: any): void {
        this.onChange.emit(event);
       // this.onChange.emit(this.selectedRows[0]);
    }

  
      ngOnChanges(event: any): void {
        this.range = event.range.currentValue; 
        function isNotEmpty(value: any): boolean {
          return value !== undefined && value !== null && value !== "";
        } 
        
        

         if (this.range) { 
         
            let format = 'yyyy-MM-dd';
            let startDate = this.datePipe.transform(this.range[0], format);
            let endDate =  this.datePipe.transform(this.range[1], format);
         
            
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
                   if(loadOptions.skip !== undefined){
                   return this.httpClient.get( 'https://del.hiecor.biz/dashboard/?mode=product_grid&ai_skin=full_page&action=productgrid&'+ params) 
                     .toPromise()

                     .then((res: any) => { 
                           this.loadingVisible = false;
                           this.selectedRows[0] = res.values[0];
                          
                          return {
                              data: res.values,
                              totalCount:res.total_count
                        }

                    })
                    .catch(error => {   throw 'Data Loading Error'  });
                  }
              },
             
              
           });

              this.dataSource = new DataSource({
                  store: this.gridDataSource
                });

                this.selectedRows = [1];
       
     }
        
   }


    constructor(private dataService: DataService,private httpClient: HttpClient,private datePipe: DatePipe, private cdRef:ChangeDetectorRef) {
      

    }

    ngOnInit() { 
         this.loading = " ";
         this.loadingVisible = true;
        

    }




}
