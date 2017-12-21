import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chats: any;
  joined: boolean;
  newUser = { users: '', chatRooms: '' };
  msgData = { chatRooms: '', users: '', chatMessages: '' };
  socket = io('http://localhost:4000');

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      this.getChatByRoom(user.chatRooms);
      this.msgData = {
        chatRooms: user.chatRooms,
        users: user.users,
        chatMessages: ''
      };
      this.joined = true;
      this.scrollToBottom();
    }
    this.socket.on('new-message', function (data) {
      if (data.message.chatRooms === JSON.parse(localStorage.getItem('user')).chatRooms) {
        this.chats.push(data.message);
        this.msgData = {
          chatRooms: user.chatRooms,
          users: user.users,
          chatMessages: ''
        };
        this.scrollToBottom();
      }
    }.bind(this));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getChatByRoom(chatRooms) {
    this.chatService.getChatByRoom(chatRooms).then((res) => {
      this.chats = res;
    }, (err) => {
      console.log(err);
    });
  }

  joinRoom() {
    const date = new Date();
    localStorage.setItem('user', JSON.stringify(this.newUser));
    this.getChatByRoom(this.newUser.chatRooms);
    this.msgData = {
      chatRooms: this.newUser.chatRooms,
      users: this.newUser.users,
      chatMessages: ''
    };
    this.joined = true;
    this.socket.emit('save-message', {
      chatRooms: this.newUser.chatRooms,
      users: this.newUser.users,
      chatMessages: 'Join this room',
      updated_at: date
    });
  }

  sendMessage() {
    this.chatService.saveChat(this.msgData).then((result) => {
      this.socket.emit('save-message', result);
    }, (err) => {
      console.log(err);
    });
  }

  logout() {
    const date = new Date();
    const user = JSON.parse(localStorage.getItem('user'));
    this.socket.emit('save-message', {
      chatRooms: user.chatRooms,
      users: user.users,
      chatMessages: 'Left this room',
      updated_at: date
    });
    localStorage.removeItem('user');
    this.joined = false;
  }

}
