import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  provideRouter
} from '@angular/router';

import {
  ChangePassword
} from './change-password';

describe('ChangePassword', () => {

  let component: ChangePassword;
  let fixture: ComponentFixture<ChangePassword>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        ChangePassword
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(ChangePassword);

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component)
      .toBeTruthy();

  });

  it('should show error when current password is empty', () => {

    component.currentPassword = '';
    component.newPassword = 'newpass123';
    component.confirmPassword = 'newpass123';

    component.changePassword();

    expect(component.errorMessage)
      .toBe(
        'Please enter your current password.'
      );

  });

  it('should show error when new password is too short', () => {

    component.currentPassword = 'oldpass123';
    component.newPassword = '123';
    component.confirmPassword = '123';

    component.changePassword();

    expect(component.errorMessage)
      .toBe(
        'New password must contain at least 6 characters.'
      );

  });

  it('should show error when passwords do not match', () => {

    component.currentPassword = 'oldpass123';
    component.newPassword = 'newpass123';
    component.confirmPassword = 'different123';

    component.changePassword();

    expect(component.errorMessage)
      .toBe(
        'New password and confirmation password do not match.'
      );

  });

  it('should show error when new password is same as current password', () => {

    component.currentPassword = 'samepass123';
    component.newPassword = 'samepass123';
    component.confirmPassword = 'samepass123';

    component.changePassword();

    expect(component.errorMessage)
      .toBe(
        'New password must be different from your current password.'
      );

  });

  it('should change password successfully with valid input', () => {

    component.currentPassword = 'oldpass123';
    component.newPassword = 'newpass123';
    component.confirmPassword = 'newpass123';

    component.changePassword();

    expect(component.successMessage)
      .toBe(
        'Password changed successfully.'
      );

    expect(component.currentPassword)
      .toBe('');

    expect(component.newPassword)
      .toBe('');

    expect(component.confirmPassword)
      .toBe('');

  });

  it('should toggle current password visibility', () => {

    expect(component.showCurrentPassword)
      .toBeFalsy();

    component.toggleCurrentPassword();

    expect(component.showCurrentPassword)
      .toBeTruthy();

    component.toggleCurrentPassword();

    expect(component.showCurrentPassword)
      .toBeFalsy();

  });

  it('should toggle new password visibility', () => {

    expect(component.showNewPassword)
      .toBeFalsy();

    component.toggleNewPassword();

    expect(component.showNewPassword)
      .toBeTruthy();

  });

  it('should toggle confirm password visibility', () => {

    expect(component.showConfirmPassword)
      .toBeFalsy();

    component.toggleConfirmPassword();

    expect(component.showConfirmPassword)
      .toBeTruthy();

  });

});