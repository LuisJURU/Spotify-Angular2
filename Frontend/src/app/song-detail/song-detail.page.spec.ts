import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongDetailPage } from './song-detail.page';

describe('SongDetailPage', () => {
  let component: SongDetailPage;
  let fixture: ComponentFixture<SongDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SongDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
