import { Component, OnInit, Output,Input, EventEmitter, OnChanges } from '@angular/core';
import 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { DataService } from '../../services/data.service';
import CustomStore from 'devextreme/data/custom_store';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-customers-grid',
    templateUrl: './customers-grid.component.html',
    styleUrls: ['./customers-grid.component.scss'],
    providers: [DataService,DatePipe]
})
export class CustomersGridComponent implements OnInit, OnChanges {
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @Input() range: Array<Date>;
     dataSource: DataSource;
     gridDataSource: any = {};
     selectedRows: any = {};
     loadingVisible = false;
     loading: string;
    customerChanged(event: any): void { 
              this.onChange.emit(event);
    } 

    
    RouterLink(pointInfo: any) : void{
           window.location.href = 'https://del.hiecor.biz/all_in_one/?custID='+ pointInfo.value;
    }

    constructor(private dataService: DataService,private _httpClient: HttpClient ,private datePipe: DatePipe) { 
      
       

    }

     ngOnChanges(event: any): void {
             
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

                            

                              return this._httpClient.get( 'https://del.hiecor.biz/dashboard/?mode=product_grid&ai_skin=full_page&action=customers&'+ params) 
                                 .toPromise()
                                .then((res: any) => { 
                                   this.loadingVisible = false;
                                   this.selectedRows[0] = res.values[0];

                                    return {
                                        data: res.values,
                                        totalCount:res.total_count
                                    }
                                }) 
                                .catch(error => { throw 'Data Loading Error' });
                            }
                          },
                      
              
           });
               this.dataSource = new DataSource({
                  store: this.gridDataSource
                });

          this.selectedRows = [1];
         }
        } 
     


    ngOnInit() {
    this.loading = " ";
    this.loadingVisible = true;
   
            
    }

}
