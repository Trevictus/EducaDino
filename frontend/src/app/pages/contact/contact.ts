import { Component } from '@angular/core';
import { ContactForm } from '../../components/shared/contact-form/contact-form';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactForm],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
}
