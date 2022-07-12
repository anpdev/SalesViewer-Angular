import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
    selector: 'app-products-info',
    templateUrl: './products-info.component.html',
    styleUrls: ['./products-info.component.scss']
})
export class ProductsInfoComponent implements OnInit, OnChanges {
    @Input() product: any;
    department: string;
    supplier: string;
    supplier_code: string;
    brand: string;
    location: string;
    restock_level: string;
    unitsInInventory: string;
    private replaceLineEnd(input: string) {
         if(input == null) return;
        return input.replace(/\|/g, '<br>');
    }

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges() { 
       if(this.product) { 
            
            this.department = this.replaceLineEnd(this.product.department);
            this.supplier = this.replaceLineEnd(this.product.supplier);
            this.supplier_code = this.replaceLineEnd(this.product.supplier_code);
            this.brand = this.replaceLineEnd(this.product.brand);
            this.location = this.replaceLineEnd(this.product.location);
            this.restock_level = this.replaceLineEnd(this.product.restock_level);
            this.unitsInInventory = this.replaceLineEnd(this.product.unitsInInventory);

                      
        }
    }
}
