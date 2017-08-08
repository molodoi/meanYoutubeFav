import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

/**
 * Pour gérer l'evenement sur le searchinput
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';

import { YoutubeService } from '../services/youtube.service';
import { FavoriteService } from '../services/favorite.service';

@Component({
  selector: 'youtube-search',
  templateUrl: './youtube-search.component.html',
  styleUrls: ['./youtube-search.component.css']
})
export class YoutubeSearchComponent implements OnInit {

  @ViewChild('searchterm') searchterm:ElementRef;
  results: any[];

  // player
  id = ''; // 'mOD2sGp4V8o';
  private player;
  private ytEvent;
  dangerousVideoUrl: string;
  videoUrl: any; //SafeResourceUrl;


  constructor(
    public yts:YoutubeService, 
    overlay: Overlay, 
    vcRef: ViewContainerRef, 
    public modal: Modal, 
    private sanitizer: DomSanitizer, 
    private favoriteService: FavoriteService
  ) {    
               //overlay.defaultViewContainer = vcRef;  
  }

  ngOnInit() {
    this.updateVideoUrl(this.id);
  }

  ngAfterViewInit() {
    const eventObservable = Observable
            .fromEvent(this.searchterm.nativeElement, 'input')
            //.do(data => console.log(data))
            .debounceTime(700); 

    eventObservable.subscribe(
      ((data:any) => this.goSearch(data)),
      ((err:any) => console.error(err)),
      () => console.log('complete')
    )                               
  }
  
  goSearch(term:any){
    this.yts.search(term.target.value).subscribe((data) => {
      console.log(data);
      this.results = data;
      this.id = data[0].id.videoId;
      this.updateVideoUrl(this.id);
    });
  }

  onClick(videoId: string) {
    this.updateVideoUrl(videoId);
  }

  addToFavorites(video: any) {
    this.openModal(video);
  }

  updateVideoUrl(id: string) {
    // Appending an ID to a YouTube URL is safe.
    // Always make sure to construct SafeValue objects as
    // close as possible to the input data so
    // that it's easier to check if the value is safe.
    this.dangerousVideoUrl = 'https://www.youtube.com/embed/' + id;
    this.videoUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
  }


  openPopup(video: any) {
        this.modal.alert()
        .size('lg')
        .showClose(true)
        .title(video.snippet.title)
        .body(`
            <div> 
              <button>ajouter</button> &nbsp <button>annuler</button>
            </div>
            `)
        .open();
  }

  openModal(video: any) {
    this.modal.prompt()
    .size('lg')
    .isBlocking(true)
    .showClose(true)
    .keyboard(27)
    .title('Ajouter à mes fovoris')
    .titleHtml('<h3>Ajouter cette vidéo à mes favoris</h3>')
    .body('Commentaire facultatif ("à voir demain", "montrer à Sam"...)')
    .bodyClass('modal-body')
    .footerClass('modal-footer')
    .okBtn('ajouter aux favoris')
    .okBtnClass('btn btn-primary')
    .open()
    .catch(err => { console.error(err); }) // catch error not related to the result (modal open...)
    .then((dialog:any) => dialog.result) // dialog has more properties,lets just return the promise for a result. 
    .then(result => { this.modalOk(result, video); }) // if ok was clicked.
    .catch(err => { console.error(new Error('cancelled by user')); }); //was cancelled (click or non block click)
  }

  modalOk(data, video){
    // console.log(data, video);
    if(data.trim() !== '') {
      video.userDescription = data.trim();
    }

    console.log(video);
    
    this.favoriteService
        .createFavorite(video)
        .subscribe(
          this.favoriteCreated,
          this.favoriteCreatedError
        );

  }

  modalError(err) {
    console.error(err);
  }

  favoriteCreated(data) {
    console.log('back from service');
    console.log(data);
  }

  favoriteCreatedError(err) {
    console.error(err);
  }



}