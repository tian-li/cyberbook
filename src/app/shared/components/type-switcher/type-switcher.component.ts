import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-type-switcher',
  templateUrl: './type-switcher.component.html',
  styleUrls: ['./type-switcher.component.scss']
})
export class TypeSwitcherComponent implements OnInit {
  @Input() types: { value: string, display: string }[];
  @Input() selectedType: string;

  @Output() typeChanged: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    if (!this.selectedType) {
      this.selectedType = this.types[0].value;
    }
  }

  changeType(type: string) {
    this.selectedType = type;
    this.typeChanged.emit(type);
  }
}
