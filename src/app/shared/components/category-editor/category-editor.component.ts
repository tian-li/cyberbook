import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Category } from '@spend-book/core/model/category';
import { availableCategoryColors, availableCategoryIcons } from '@spend-book/shared/constants';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit {
  readonly availableCategoryColors = availableCategoryColors;
  readonly availableCategoryIcons = availableCategoryIcons;

  selectedColor = this.availableCategoryColors[0];
  selectedIcon = this.availableCategoryIcons[0];
  categoryNameControl = new FormControl('', [Validators.required, Validators.maxLength(5)]);

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { editMode: boolean, category?: Category },
              private bottomSheetRef: MatBottomSheetRef<CategoryEditorComponent>) {
  }

  ngOnInit(): void {
    console.log('data', this.data);
    if (this.data.category) {
      this.categoryNameControl.setValue(this.data.category.name);
      this.selectedColor = this.data.category.color;
      this.selectedIcon = this.data.category.icon;
    }
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  selectIcon(icon) {
    this.selectedIcon = icon;
  }

  save() {
    const id = this.data.category ? this.data.category.id : uuid();

    const result: Partial<Category> = {
      id,
      name: this.categoryNameControl.value,
      color: this.selectedColor,
      icon: this.selectedIcon
    }
    this.bottomSheetRef.dismiss(result);
  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }

}
