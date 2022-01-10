import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-type-switcher',
  templateUrl: './type-switcher.component.html',
  styleUrls: ['./type-switcher.component.scss']
})
export class TypeSwitcherComponent implements OnInit {
  @Input() types!: { value: string | boolean, display: string }[];
  @Input() selectedType!: string | boolean;

  @Output() typeChanged: EventEmitter<string | boolean> = new EventEmitter<string | boolean>();

  ngOnInit() {
    if (!this.selectedType) {
      this.selectedType = this.types[0].value;
    }
  }

  changeType(type: string | boolean) {
    this.selectedType = type;
    this.typeChanged.emit(type);
  }
}
