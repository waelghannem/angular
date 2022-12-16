import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoAuthenticationComponent } from './sso-authentication.component';

describe('SsoAuthenticationComponent', () => {
  let component: SsoAuthenticationComponent;
  let fixture: ComponentFixture<SsoAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SsoAuthenticationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsoAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
