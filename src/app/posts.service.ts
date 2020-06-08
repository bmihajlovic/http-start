import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';

import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PostsService {

    error = new Subject<string>();

    constructor(private http: HttpClient) {

    }

    createAndStorePost(title: string, content: string) {
       
      const postData: Post = { title: title, content: content } ;

      this.http
      .post(
        'https://ng-complete-guide-dab10.firebaseio.com/posts.json',
        postData,
        {
            observe: 'response'
        }
      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
          this.error.next(error.message);
      });
    }

    fetchPosts() {
        return this.http
        .get<{ [key: string] : Post }>(
          'https://ng-complete-guide-dab10.firebaseio.com/posts.json', {
              headers: new HttpHeaders({ 'CustomHeader' : 'Hello' }),
              params: new HttpParams().set('print', 'pretty'), // unutar zagrade je definisano bilo sta, jer to je
            //   ono sto ide u linku posle ovoga posts.json?print=,etty ...
              responseType: 'json'
          })
          .pipe(
            map(responseData => {
            const postArray : Post[] = [];
            for (const key in responseData) {
              if(responseData.hasOwnProperty(key)) {
                postArray.push({...responseData[key], id: key})
              }
            }
            return postArray;
          }),
          catchError(errorResponse => {
              return throwError(errorResponse);
          })
         );
        //  .subscribe(posts => {
        //    this.isFetching = false
        //    this.loadedPosts = posts;
    //   });
    }

    deletePosts() {
        return this.http.delete('https://ng-complete-guide-dab10.firebaseio.com/posts.json', {
            observe: 'events',
            responseType: 'text'
        }).pipe(tap(event => {
            console.log(event);
            if (event.type === HttpEventType.Sent) {
                
            }
            if (event.type === HttpEventType.Response) {
                console.log(event.body);
            }
        }));
    }
}