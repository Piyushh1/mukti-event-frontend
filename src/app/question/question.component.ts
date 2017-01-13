import { Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { QuestionService } from '../question.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['question.component.css']
})

export class QuestionComponent implements OnInit {

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  constructor(
    private router: Router,
    private questionService: QuestionService,
    private route: ActivatedRoute
  ) {}

  private setObj = {};
  private questionObj = [];
  private verify = true;
  private question_id;
  private storyVerify = true;
  private user_id: number;

  ngOnInit() {

    this.route.params.subscribe(params => {
       this.user_id = +params['id']; // (+) converts string 'id' to a number
       console.log('user-iddd',this.user_id);
    });
    // we will send user_id to find the current set no nd then fetch set and respective ques.
    this.questionService.fetchSet(this.user_id)
      .then( data=> {
        this.setObj = data;
        // console.log(this.setObj);
        this.questionService.fetchQuestion()
        .then( data=> {
          this.questionObj = data;
          // console.log(this.questionObj);
        })
      })
      .catch( this.handleError );

    // this._flashMessagesService.show('We are in about component!', { timeout: 1000 });
  }
 
  onAnswerSubmit(form_data, id) {
    this.question_id = id;
    form_data.id = id;
    console.log(this);
    this.questionService.onAnswerSubmit(form_data)
      .then( data=> {
        if(data.verified) {
          this.verify = true;
          window.open(data.url);
        } else {
          this.verify = false;
   //wait 3 Seconds and hide
          setTimeout(function() {
          this.verify = true;
          console.log(this.verify);
          }, 3000);
        }
      })
      .catch( this.handleError );
  }

  onStorySubmit(form_data, id) {
    // we will send set id match ans nd if correct increment the set id of corresponding user . nd reload the page 
    // so that fetch set and fetch ques automatically gets updated.
    form_data.id = id;
    form_data.user_id = this.user_id;
    this.questionService.onStorySubmit(form_data)
      .then( data=> {
        if(data.verified) {
          window.location.reload();
          this.router.navigate(['/home/question']);
        } else {
          this.storyVerify = false; 
        }
      })
      .catch( this.handleError );
  }

}

