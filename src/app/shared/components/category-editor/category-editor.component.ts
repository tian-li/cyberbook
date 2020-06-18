import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

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
    'check',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
    'email',
  ]


  selectedColor = '#e8682c';
  selectedIcon = 'check';

  categoryNameControl = new FormControl('category');

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit(): void {
    console.log('data', this.data);
  }

}
