import { Component, OnInit } from '@angular/core';
import { Router, Event, ActivatedRoute, ActivationEnd, NavigationEnd } from "@angular/router";
import { filter, map, buffer, pluck } from "rxjs/operators";

/**
 * Check if an angular router 'Event' is instance of 'NavigationEnd' event
 */
const isNavigationEnd = (ev: Event) => ev instanceof NavigationEnd;
/**
 * Check if an angular router 'Event' is instance of 'NavigationEnd' event
 */
const isActivationEnd = (ev: Event) => ev instanceof ActivationEnd;


@Component({
  selector: 'ark-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {
  public bcLoadedData: any [] = [];
  constructor(
                private router: Router,
                private route: ActivatedRoute
              ) {
                this._fetchbreadcrumData();
              }
  
  ngOnInit() { }

  _fetchbreadcrumData() {
    const navigationEnd$ = this.router.events.pipe(filter(isNavigationEnd));
    const selfClass = this;
    this.router.events
      .pipe(
        filter(isActivationEnd),
        pluck("snapshot"),
        pluck("data"),
        buffer(navigationEnd$),
        map((bcData: any[]) => bcData.reverse())
      )
      .subscribe(x => {
        x.map(x => {
          if(Object.keys(x).length >=1) {
            x.bc.map(x => {this.bcLoadedData.push(x); } );
          }
        });
      });
  }
}
