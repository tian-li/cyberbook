import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '@cyberbook/core/model/category';
import { ConfirmationAlertComponent } from '@cyberbook/shared/components/confirmation-alert/confirmation-alert.component';
import { AlertLevel, availableCategoryColors, availableCategoryIcons } from '@cyberbook/shared/constants';
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

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) private data: { editMode: boolean, allCategories: Category[], category?: Category },
              private bottomSheetRef: MatBottomSheetRef<CategoryEditorComponent>,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.data.category) {
      this.categoryNameControl.setValue(this.data.category.name);
      this.selectedColor = this.data.category.color;
      this.selectedIcon = this.data.category.icon;
    }
  }

  get actionType(): string {
    return this.data.editMode ? '编辑' : '新建';
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  save() {
    const categoryName = this.categoryNameControl.value.trim();

    if (this.data.allCategories.some(c => c.name === categoryName)) {
      this.alertForDuplication(categoryName);
      return;
    }

    const changes: Partial<Category> = {
      name: categoryName,
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

  private alertForDuplication(categoryName: string) {
    this.dialog.open(ConfirmationAlertComponent, {
      width: '400px',
      height: '200px',
      disableClose: true,
      data: {
        message: `${categoryName} 已存在`,
        alertLevel: AlertLevel.danger
      }
    });
  }
}
