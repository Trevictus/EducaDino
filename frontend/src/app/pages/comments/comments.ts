import { Component } from '@angular/core';
import { FormInput } from '../../components/shared/form-input/form-input';
import { FormTextarea} from '../../components/shared/form-textarea/form-textarea';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [FormInput, FormTextarea],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments {

}
