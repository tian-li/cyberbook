import { Component, Input, OnInit } from '@angular/core';
import { MessageThread } from '@cyberbook/core/model/message-thread';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

@Component({
  selector: 'app-message-thread-item',
  templateUrl: './message-thread-item.component.html',
  styleUrls: ['./message-thread-item.component.scss']
})
export class MessageThreadItemComponent implements OnInit {
  @Input() messageThread: MessageThread;
  @Input() today: dayjs.Dayjs;
  @Input() isLastItem: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  lastMessageTimeDisplay(): string {
    const lastMessageTime = dayjs(this.messageThread.lastMessageDate);
    const diff = this.today.diff(lastMessageTime, 'day');

    // 同一天显示 小时:分钟
    if (diff === 0) {
      return lastMessageTime.format('HH:ss');
    }

    // 昨天显示昨天
    if (diff === 1) {
      return '昨天';
    }

    // 前天显示前天
    if (diff === 2) {
      return '前天';
    }

    // 小于等于7天显示星期几
    if (diff < 7) {
      return lastMessageTime.format('ddd');
    }

    // 大于7天显示 具体日期
    if (diff >= 7) {
      return lastMessageTime.format('MM/DD/YY');
    }
  }

  delete(event) {

  }

}
