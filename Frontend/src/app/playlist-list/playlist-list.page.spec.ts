import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistListPage } from './playlist-list.page';

describe('PlaylistListPage', () => {
  let component: PlaylistListPage;
  let fixture: ComponentFixture<PlaylistListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
