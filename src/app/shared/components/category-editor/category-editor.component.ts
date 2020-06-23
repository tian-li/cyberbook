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
  readonly availableCategoryColors: string[] = availableCategoryColors;
  readonly availableCategoryIcons: string[] = availableCategoryIcons;

  selectedColor: string = this.availableCategoryColors[0];
  selectedIcon: string = this.availableCategoryIcons[0];
  categoryNameControl = new FormControl('', [Validators.required, Validators.maxLength(5)]);

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) private data: { editMode: boolean, category?: Category },
              private bottomSheetRef: MatBottomSheetRef<CategoryEditorComponent>) {
  }

  ngOnInit(): void {
    if (this.data.category) {
      this.categoryNameControl.setValue(this.data.category.name);
      this.selectedColor = this.data.category.color;
      this.selectedIcon = this.data.category.icon;
    }
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  save() {
    const changes: Partial<Category> = {
      name: this.categoryNameControl.value,
      color: this.selectedColor,
      icon: this.selectedIcon
    }

    let result: Partial<Category>;

    if (!!this.data.category) {
      result = {
        ...this.data.category,
        ...changes
      }
    } else {
      result = {
        id: uuid(),
        ...changes,
        addedByUser: true,
      }
    }

    this.bottomSheetRef.dismiss(result);
  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }

}
