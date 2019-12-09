import { Howl } from 'howler'
import { Component, ViewChild } from '@angular/core';
import { IonRange } from '@ionic/angular';
import { TrackI } from '../interfaces/track-i'
import { TrackService } from '../services/track.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  playlist: TrackI[] = [
    {
      name: 'dulce',
      path: './assets/mp3/dulce.mp3'
    },
    {
      name: 'precioso',
      path: './assets/mp3/precioso.mp3'
    }
  ];

  activeTrack: TrackI = null;
  player: Howl = null;
  isPlayin: boolean = false;
  progress = 0;
  @ViewChild('range', { static: false }) range: IonRange


  constructor(public trackService: TrackService) { }

  start(track: TrackI) {
     if (this.player) {
       this.player.stop();
     }
     this.player = new Howl({
       src: [track.path],
       html5: true,
       onplay: () => {

         this.isPlayin = true;
         this.activeTrack = track;
         this.updateProgress();
       },
       onend: () => {
         console.log('onend');
       }
     });
     this.player.play();
    
  }

  togglePlayer(pause) {
     this.isPlayin = !pause;
     if (pause) {
       this.player.pause();
     } else {
       this.player.play();
     }
   
  }

  next() {
     let index = this.playlist.indexOf(this.activeTrack);
     if (index != this.playlist.length - 1) {
       this.start(this.playlist[index + 1]);
     } else {
       this.start(this.playlist[0]);
     }
   
  }

  prev() {
     let index = this.playlist.indexOf(this.activeTrack);
     if (index > 0) {
       this.start(this.playlist[index - 1]);
     } else {
       this.start(this.playlist[this.playlist.length - 1]);
     }
   
  }

  seek() {
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }


updateProgress() {
  let seek = this.player.seek();
  this.progress = (seek / this.player.duration()) * 100 || 0;
  setTimeout(() => {
    this.updateProgress();
  }, 1000);
}


}
