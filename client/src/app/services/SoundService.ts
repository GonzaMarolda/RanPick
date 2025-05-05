import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class SoundService {
  private audioElements: { [key: string]: HTMLAudioElement[] } = {}
  private maxTickInstances = 5 

  constructor() {
    this.preloadSounds()
  }

  private preloadSounds() {
    this.audioElements['tick'] = Array.from({ length: this.maxTickInstances }, () => 
      new Audio(environment.url + '/uploads/sounds/tick.mp3')
    )
    
    let selectedAudio = new Audio(environment.url + '/uploads/sounds/selected.mp3')
    selectedAudio.volume *= 0.1;
    this.audioElements['selected'] = [selectedAudio]
  }

  play(name: string) {
    if (!this.audioElements[name]) return

    const availableAudio = this.audioElements[name].find(audio => 
      audio.paused || audio.ended
    )

    if (availableAudio) {
      availableAudio.currentTime = 0 
      availableAudio.play()
    }
  }
}