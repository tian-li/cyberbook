import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit {

  colors = [
    '#f44444',
    '#e8682c',
    '#f8d339',
    '#c6f834',
    '#6ec232',
    '#2ad792',
    '#13b9d4',
    '#0928be',
    '#af34ed',
    '#cc048a',
  ]

  icons = [
    'account_balance_wallet',
    'account_balance',
    'analytics',
    'book',
    'language',
    'verified_user',
    'brightness_auto',
    'insert_drive_file',
    'table_rows',
    'cloud_done',
    'computer',
    'phone_android',
    'devices_other',
    'headset_mic',
    'videogame_asset',
    'camera_roll',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
    'storefront',
  ]


  selectedColor = '#f44444';
  selectedIcon = 'account_balance_wallet';

  categoryNameControl = new FormControl('', [Validators.required, Validators.maxLength(5)]);

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private bottomSheetRef: MatBottomSheetRef<CategoryEditorComponent>) {
  }

  ngOnInit(): void {
    console.log('data', this.data);
    if(this.data.category) {
      this.categoryNameControl.setValue(this.data.category.name)
      // this.selectedColor = this.data.category.color;
      // this.selectedIcon = this.data.category.icon;
    }
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  selectIcon(icon) {
    this.selectedIcon = icon;
  }

  save() {
    this.bottomSheetRef.dismiss({ name: this.categoryNameControl.value, color: this.selectedColor, icon: this.selectedIcon });
  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }

}
