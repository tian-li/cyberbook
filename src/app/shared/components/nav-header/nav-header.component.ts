import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit {

  @Input() title: string;
  @Input() leftButtonIcon: string;
  @Input() rightButtonIcon: string;
  @Input() typeSwitcherConfig: { enabled: boolean, types: any } = {
    enabled: false,
    types: []
  };

  @Output() leftButtonClicked = new EventEmitter<void>();
  @Output() rightButtonClicked = new EventEmitter<void>();
  @Output() typeChanged = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
