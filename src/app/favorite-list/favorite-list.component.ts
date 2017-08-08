import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';

@Component({
  selector: 'app-favorite-list',
  templateUrl: './favorite-list.component.html',
  styleUrls: ['./favorite-list.component.css']
})
export class FavoriteListComponent implements OnInit {

  favorites: any = [];

  constructor(private favoriteService: FavoriteService) { }

  ngOnInit() {
    this.favoriteService
        .getAllFavorites()
        .subscribe(posts => {
            this.favorites = posts;
        });
  }

  /**
   * Delete In Mongo
   * 
   * @param favoriteId
   */
  deleteFavorite(favoriteId) {
    this.favoriteService
        .deleteFavorite(favoriteId)
        .subscribe(
          data => {
            console.log(data);
            this.deleteFavoriteFromTemplate(favoriteId);
          },
          err => {
            console.log(err);
          }         
        );
  }

  /**
   * Delete in frontend
   * 
   * @param favoriteId 
   */
  deleteFavoriteFromTemplate(favoriteId) {
    this.favorites = this.favorites.filter(f => f._id !== favoriteId);
  }
}
