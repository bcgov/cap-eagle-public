import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Project } from 'app/models/project';
import { CommentPeriodService } from 'app/services/commentperiod.service';

@Component({
  templateUrl: './commenting-tab.component.html',
  styleUrls: ['./commenting-tab.component.scss'],
  animations: [
    trigger('visibility', [
      transition(':enter', [   // :enter is alias to 'void => *'
        animate('0.2s 0s', style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate('0.2s 0.75s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CommentingTabComponent implements OnInit, OnDestroy {
  public loading = true;
  public project: Project = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public commentPeriodService: CommentPeriodService, // used in template
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    // get project
    this.route.parent.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (data: { project: Project }) => {
          if (data.project) {
            this.project = data.project;
            this.loading = false;
          } else {
            alert('Uh-oh, couldn\'t load project');
            this.loading = false;
            // project not found --> navigate back to project list
            this.router.navigate(['/projects']);
          }
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}