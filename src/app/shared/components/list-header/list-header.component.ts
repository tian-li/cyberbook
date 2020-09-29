import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() leftButtonIcon: string;
  @Input() rightButtonIcon: string;
  @Input() typeSwitcherConfig: { enabled: boolean, types: any };

  @Output() leftButtonClicked = new EventEmitter<void>();
  @Output() rightButtonClicked = new EventEmitter<void>();
  @Output() typeChanged = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
