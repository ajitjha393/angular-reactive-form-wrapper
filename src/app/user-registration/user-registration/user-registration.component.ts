import { Component, OnDestroy, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  constructor(private fb: FormBuilder, private formService: FormService) {}

  ngOnInit(): void {
    this.formService.initValidators();
    this.userForm = this.formService.getUserForm();
  }

  ngOnDestroy(): void {
    this.formService.unsubscribe();
  }
}

@Injectable({
  providedIn: 'root',
})
export class FormService {
  userForm: FormGroup;
  private ageValueChanges: Subscription;

  constructor(private fb: FormBuilder) {
    this.userForm = fb.group({
      basicInfo: fb.group({
        firstName: [],
        lastName: [],
        email: [],
        age: [],
      }),
      address: fb.group({
        street: [],
        number: [],
        postal: [],
        company: [],
      }),
    });
  }

  getUserForm() {
    return this.userForm;
  }

  initValidators() {
    this.setAgeCompanyValidator();
  }

  setAgeCompanyValidator() {
    const companyFormControl = this.userForm.get('address.company');

    this.ageValueChanges = this.userForm
      .get('basicInfo.age')
      .valueChanges.subscribe((age) => {
        if (age > 18) {
          companyFormControl.setValidators(Validators.required);
        } else {
          companyFormControl.clearValidators();
        }
        companyFormControl.updateValueAndValidity();
      });

    return this.ageValueChanges;
  }

  unsubscribe() {
    this.ageValueChanges?.unsubscribe();
  }
}
