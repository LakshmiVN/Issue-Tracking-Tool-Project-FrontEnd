import { TestBed } from '@angular/core/testing';

import { WatcherServiceService } from './watcher-service.service';

describe('WatcherServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WatcherServiceService = TestBed.get(WatcherServiceService);
    expect(service).toBeTruthy();
  });
});
