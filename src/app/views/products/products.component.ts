import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import * as Color from 'color';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit, OnDestroy {

    @Output() onChange: EventEmitter<any> = new EventEmitter();
    @Output() onProductChange: EventEmitter<any> = new EventEmitter();
   
    subscription: Subscription;

    product: any;
    productId: number;
    range: Array<Date>;

    shutterColor: string;
    isRowChanged = false;
    productChanged(event: any): void { 
       
       if( event.selectedRowKeys.length > 0) { 
           this.product = event.selectedRowKeys[0];
           this.productId = event.selectedRowKeys[0].product_id;
           this.isRowChanged = true;
           
        };
        
    }

    rangeChanged(event: any): void { 
        this.isRowChanged = false;
        this.range = event.value; 
        this.onChange.emit(event);
    }

    private applyThemeConstants = () => this.shutterColor = this.themeService.blendColor(
        Color(this.themeService.getThemeItem("backgroundColor")),
        Color("rgba(150, 150, 150, 0.1)") // gray-line background
    ).toString();

    constructor(private themeService: ThemeService,  private changeDedectionRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.subscription = this.themeService.themeChanged.subscribe(this.applyThemeConstants);
    }

    ngAfterViewChecked() { 
     this.changeDedectionRef.detectChanges();
   }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
