import { Component } from '@angular/core';
import {ContactForm} from '../../components/shared/contact-form/contact-form';

@Component({
  selector: 'app-feedback-page',
  imports: [
    ContactForm
  ],
  templateUrl: './feedback-page.html',
  styleUrl: './feedback-page.scss',
})
export class FeedbackPage {

}
