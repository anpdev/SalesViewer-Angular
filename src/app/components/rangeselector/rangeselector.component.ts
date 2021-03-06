import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-rangeselector',
    templateUrl: './rangeselector.component.html',
    styleUrls: ['./rangeselector.component.scss'],
    providers: [DataService]
})
export class RangeSelectorComponent implements OnInit {
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @Input() shutterColor = '#fff';
   
    currentYear: number;
    thisYear: number = new Date().getFullYear();
    dataSource: Array<Object>;
    
    public range: any;
loadingVisible = false;
    private correctOffset(offset: number): boolean {
        let neededYear = this.currentYear + offset;
        return neededYear <= this.thisYear && neededYear >= this.thisYear - 2;
    }

    change(event: any): void {
        this.range = event;

        Promise.resolve().then(() => this.onChange.emit(event));
    }
    


    customizeTooltip = (pointInfo: any) => {
            
            return { text: '<span style="font-size: 14px; color: #808080">' + pointInfo.argument + '</span><br />'
            + '<span>$' + pointInfo.value + '</span>' };
        
    }



    changeYear(offset: number): void {
        console.log(this.shutterColor);
        if(!this.correctOffset(offset)) {
            return;
        }

        this.currentYear += offset;

        this.dataService.getData('sales', {
            startDate: new Date(this.currentYear, 0, 1),
            endDate: new Date(this.currentYear, 11, 31),
            action :'sales'
          }).subscribe(data => this.dataSource = data);
                           


    }

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.currentYear = new Date().getFullYear();
        this.changeYear(0);
    }
}
