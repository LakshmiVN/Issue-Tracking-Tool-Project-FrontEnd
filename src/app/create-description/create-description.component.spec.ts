import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDescriptionComponent } from './create-description.component';

describe('CreateDescriptionComponent', () => {
  let component: CreateDescriptionComponent;
  let fixture: ComponentFixture<CreateDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
