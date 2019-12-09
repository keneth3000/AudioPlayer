import { Injectable, ViewChild } from '@angular/core';
import { TrackI } from '../interfaces/track-i';
import { Howl } from 'howler';
import { IonRange } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  //modelo de rutas
  playlist: TrackI[] = [
    {
      name: 'dulce',
      path: './assets/mp3/dulce.mp3'
    }
  ];

  //variable
  activateTrack: TrackI = null;
  player: Howl = null;
  isPlayin: boolean = false;
  progress = 0;
  @ViewChild('range', {static:false})range:IonRange;

  constructor() { }

  //metodos
  start(track: TrackI) {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      html5:true,
      onpaly: () => {
        this.isPlayin = true;
        this.activateTrack = track;
        this.updateProgress();
      },
      onend:()=>{
        console.log('onend')
      }
    });
    this.player.play();
  }

  togglePlayer(pause){
    this.isPlayin = !pause;
    if(pause){
      this.player.pause();
    }else{
      this.player.play();
    }
  }

  next(){
    let index = this.playlist.indexOf(this.activateTrack);
    if(index != this.playlist.length -1){
      this.start(this.playlist[index + 1]);
    }else{
      this.start(this.playlist[0]);
    }
  }

  prev(){
    let index = this.playlist.indexOf(this.activateTrack);
    if(index > 0){
      this.start(this.playlist[index -1]);
    }else{
      this.start(this.playlist[this.playlist.length -1]);
    }
  }

  seek(){
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue/100));
  }

  updateProgress(){
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(()=>{
      this.updateProgress();
    }, 1000);
  }
}
