import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { inventory } from 'src/app/services/model';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  // passing inputs to a component
  @Input() inventories : inventory[];
  // output an event with inventory id :D
  @Output() goToInventory : EventEmitter<string> = new EventEmitter();

  constructor() { 

  }


  ngOnInit() {
    
  }

}
