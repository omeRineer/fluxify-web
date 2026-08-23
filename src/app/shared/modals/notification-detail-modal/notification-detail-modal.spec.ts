import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDetailModal } from './notification-detail-modal';

describe('NotificationDetailModal', () => {
  let component: NotificationDetailModal;
  let fixture: ComponentFixture<NotificationDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
